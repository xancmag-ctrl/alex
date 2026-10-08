import type { AuthUser, Backend, Favorite, JournalEntry, PlanSettings, LastViewed, ShoppingItem } from './types'
import { uid } from './utils'

/**
 * Backend de DEMONSTRAÇÃO: guarda tudo no localStorage do navegador.
 * É usado automaticamente quando as variáveis do Supabase não estão configuradas,
 * para que o app possa ser visualizado e testado sem servidor.
 * NÃO é seguro para produção (as senhas ficam no próprio aparelho).
 */

interface DemoUser {
  id: string
  email: string
  password: string
  name: string
  onboarded: boolean
  plan: PlanSettings | null
  lastViewed: LastViewed | null
}

interface DemoData {
  favorites: Favorite[]
  checks: Record<string, string[]>
  shopping: ShoppingItem[]
  journal: JournalEntry[]
}

const USERS = 'ji_demo_users'
const SESSION = 'ji_demo_session'
const dataKey = (id: string) => `ji_demo_data_${id}`

function read<T>(key: string, fallback: T, storage: Storage = localStorage): T {
  try {
    const raw = storage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export function createLocalBackend(): Backend {
  const listeners = new Set<(u: AuthUser | null, event?: string) => void>()
  const users = () => read<DemoUser[]>(USERS, [])
  const saveUsers = (list: DemoUser[]) => write(USERS, list)
  const data = (id: string) =>
    read<DemoData>(dataKey(id), { favorites: [], checks: {}, shopping: [], journal: [] })
  const saveData = (id: string, d: DemoData) => write(dataKey(id), d)
  const emit = (u: AuthUser | null, event: string) => listeners.forEach((l) => l(u, event))
  const findById = (id: string) => users().find((u) => u.id === id)

  const patchData = (id: string, fn: (d: DemoData) => void) => {
    const d = data(id)
    fn(d)
    saveData(id, d)
  }

  return {
    mode: 'demo',

    async getUser() {
      const id = read<string | null>(SESSION, null)
      const u = id ? findById(id) : undefined
      return u ? { id: u.id, email: u.email } : null
    },

    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },

    async signUp(name, email, password) {
      await delay()
      const list = users()
      const normalized = email.trim().toLowerCase()
      if (list.some((u) => u.email === normalized)) throw new Error('User already registered')
      if (password.length < 6) throw new Error('Password should be at least 6 characters')
      const user: DemoUser = {
        id: uid(),
        email: normalized,
        password,
        name: name.trim(),
        onboarded: false,
        plan: null,
        lastViewed: null,
      }
      saveUsers([...list, user])
      write(SESSION, user.id)
      emit({ id: user.id, email: user.email }, 'SIGNED_IN')
      return { status: 'signed_in' }
    },

    async signIn(email, password) {
      await delay()
      const u = users().find((x) => x.email === email.trim().toLowerCase() && x.password === password)
      if (!u) throw new Error('Invalid login credentials')
      write(SESSION, u.id)
      emit({ id: u.id, email: u.email }, 'SIGNED_IN')
    },

    async signOut() {
      localStorage.removeItem(SESSION)
      emit(null, 'SIGNED_OUT')
    },

    async requestPasswordReset() {
      await delay()
      // No modo demonstração nenhum e-mail é enviado.
    },

    async updatePassword(password) {
      await delay()
      const id = read<string | null>(SESSION, null)
      if (!id) throw new Error('Auth session missing')
      if (password.length < 6) throw new Error('Password should be at least 6 characters')
      saveUsers(users().map((u) => (u.id === id ? { ...u, password } : u)))
    },

    async getProfile(user) {
      const u = findById(user.id)
      if (!u) throw new Error('Auth session missing')
      return { id: u.id, email: u.email, name: u.name, onboarded: u.onboarded, plan: u.plan, lastViewed: u.lastViewed }
    },

    async updateProfile(userId, patch) {
      saveUsers(users().map((u) => (u.id === userId ? { ...u, ...patch } : u)))
    },

    async listFavorites(userId) {
      return data(userId).favorites
    },

    async setFavorite(userId, fav, on) {
      patchData(userId, (d) => {
        d.favorites = d.favorites.filter((f) => !(f.kind === fav.kind && f.slug === fav.slug))
        if (on) d.favorites.push(fav)
      })
    },

    async listChecks(userId, fromDay) {
      return Object.fromEntries(Object.entries(data(userId).checks).filter(([day]) => day >= fromDay))
    },

    async setChecks(userId, day, items) {
      patchData(userId, (d) => {
        d.checks[day] = items
      })
    },

    async listShopping(userId) {
      await delay(60)
      return data(userId).shopping
    },

    async addShopping(userId, names, recipeSlug = null) {
      const created = names.map<ShoppingItem>((name) => ({
        id: uid(),
        name,
        checked: false,
        recipeSlug,
        createdAt: new Date().toISOString(),
      }))
      patchData(userId, (d) => {
        d.shopping.push(...created)
      })
      return created
    },

    async updateShopping(userId, id, patch) {
      patchData(userId, (d) => {
        d.shopping = d.shopping.map((i) => (i.id === id ? { ...i, ...patch } : i))
      })
    },

    async removeShopping(userId, ids) {
      patchData(userId, (d) => {
        d.shopping = d.shopping.filter((i) => !ids.includes(i.id))
      })
    },

    async listJournal(userId) {
      await delay(60)
      return data(userId).journal
    },

    async addJournal(userId, entry) {
      const created: JournalEntry = { ...entry, id: uid(), createdAt: new Date().toISOString() }
      patchData(userId, (d) => {
        d.journal.unshift(created)
      })
      return created
    },

    async removeJournal(userId, id) {
      patchData(userId, (d) => {
        d.journal = d.journal.filter((j) => j.id !== id)
      })
    },
  }
}
