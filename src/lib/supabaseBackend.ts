import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { AuthUser, Backend, Favorite, JournalEntry, Profile, ShoppingItem } from './types'

function toUser(u: User | null | undefined): AuthUser | null {
  return u ? { id: u.id, email: u.email ?? '' } : null
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data
}

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const sb: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })

  const mapShopping = (r: any): ShoppingItem => ({
    id: r.id,
    name: r.name,
    checked: r.checked,
    recipeSlug: r.recipe_slug,
    createdAt: r.created_at,
  })

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession()
      return toUser(data.session?.user)
    },

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((event, session) => cb(toUser(session?.user), event))
      return () => data.subscription.unsubscribe()
    },

    async signUp(name, email, password) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo: `${window.location.origin}/` },
      })
      if (error) throw new Error(error.message)
      // Supabase devolve um usuário "falso" sem identities quando o e-mail já existe.
      if (data.user && data.user.identities && data.user.identities.length === 0)
        throw new Error('already registered')
      return data.session ? { status: 'signed_in' } : { status: 'confirm_email' }
    },

    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
    },

    async signOut() {
      await sb.auth.signOut()
    },

    async requestPasswordReset(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })
      if (error) throw new Error(error.message)
    },

    async updatePassword(password) {
      const { error } = await sb.auth.updateUser({ password })
      if (error) throw new Error(error.message)
    },

    async getProfile(user) {
      const row = check(
        await sb.from('profiles').select('id,name,onboarded,plan,last_viewed,weight').eq('id', user.id).maybeSingle(),
      ) as any
      if (!row) {
        // Fallback caso o trigger não tenha criado o perfil.
        const { data } = await sb.auth.getUser()
        const name = (data.user?.user_metadata?.name as string) ?? ''
        check(await sb.from('profiles').upsert({ id: user.id, name }))
        return { id: user.id, email: user.email, name, onboarded: false, plan: null, lastViewed: null, weight: null }
      }
      return {
        id: row.id,
        email: user.email,
        name: row.name ?? '',
        onboarded: row.onboarded,
        plan: row.plan,
        lastViewed: row.last_viewed,
        weight: row.weight ?? null,
      } satisfies Profile
    },

    async updateProfile(userId, patch) {
      const row: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (patch.name !== undefined) row.name = patch.name
      if (patch.onboarded !== undefined) row.onboarded = patch.onboarded
      if (patch.plan !== undefined) row.plan = patch.plan
      if (patch.lastViewed !== undefined) row.last_viewed = patch.lastViewed
      if (patch.weight !== undefined) row.weight = patch.weight
      check(await sb.from('profiles').update(row).eq('id', userId))
      if (patch.name !== undefined) await sb.auth.updateUser({ data: { name: patch.name } })
    },

    async listFavorites(userId) {
      const rows = check(await sb.from('favorites').select('kind,slug').eq('user_id', userId)) as Favorite[]
      return rows ?? []
    },

    async setFavorite(userId, fav, on) {
      if (on) {
        check(
          await sb
            .from('favorites')
            .upsert({ user_id: userId, kind: fav.kind, slug: fav.slug }, { onConflict: 'user_id,kind,slug' }),
        )
      } else {
        check(await sb.from('favorites').delete().match({ user_id: userId, kind: fav.kind, slug: fav.slug }))
      }
    },

    async listChecks(userId, fromDay) {
      const rows = check(
        await sb.from('daily_checks').select('day,items').eq('user_id', userId).gte('day', fromDay),
      ) as { day: string; items: string[] }[]
      return Object.fromEntries((rows ?? []).map((r) => [r.day, r.items]))
    },

    async setChecks(userId, day, items) {
      check(await sb.from('daily_checks').upsert({ user_id: userId, day, items }, { onConflict: 'user_id,day' }))
    },

    async listShopping(userId) {
      const rows = check(
        await sb.from('shopping_items').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      ) as any[]
      return (rows ?? []).map(mapShopping)
    },

    async addShopping(userId, names, recipeSlug = null) {
      const rows = check(
        await sb
          .from('shopping_items')
          .insert(names.map((name) => ({ user_id: userId, name, recipe_slug: recipeSlug })))
          .select('*'),
      ) as any[]
      return (rows ?? []).map(mapShopping)
    },

    async updateShopping(userId, id, patch) {
      check(await sb.from('shopping_items').update(patch).match({ id, user_id: userId }))
    },

    async removeShopping(userId, ids) {
      if (!ids.length) return
      check(await sb.from('shopping_items').delete().eq('user_id', userId).in('id', ids))
    },

    async listJournal(userId) {
      const rows = check(
        await sb
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100),
      ) as any[]
      return (rows ?? []).map(
        (r): JournalEntry => ({
          id: r.id,
          meal: r.meal,
          hunger: r.hunger,
          feeling: r.feeling,
          note: r.note ?? '',
          createdAt: r.created_at,
        }),
      )
    },

    async addJournal(userId, entry) {
      const r = check(
        await sb
          .from('journal_entries')
          .insert({ user_id: userId, ...entry })
          .select('*')
          .single(),
      ) as any
      return { id: r.id, meal: r.meal, hunger: r.hunger, feeling: r.feeling, note: r.note ?? '', createdAt: r.created_at }
    },

    async removeJournal(userId, id) {
      check(await sb.from('journal_entries').delete().match({ id, user_id: userId }))
    },
  }
}
