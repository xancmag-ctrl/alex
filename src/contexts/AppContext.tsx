import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getBackend } from '@/lib/backend'
import type { AuthUser, Backend, Favorite, FavoriteKind, LastViewed, Profile } from '@/lib/types'
import { useToast } from '@/components/ui/toast'

interface AppState {
  backend: Backend | null
  ready: boolean
  user: AuthUser | null
  profile: Profile | null
  favorites: Favorite[]
  /** true quando o usuário chegou pelo link de redefinição de senha */
  recovering: boolean
  isFavorite(kind: FavoriteKind, slug: string): boolean
  toggleFavorite(kind: FavoriteKind, slug: string): Promise<void>
  updateProfile(patch: Partial<Pick<Profile, 'name' | 'onboarded' | 'plan'>>): Promise<void>
  markViewed(kind: FavoriteKind, slug: string): void
  signOut(): Promise<void>
  clearRecovering(): void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [backend, setBackend] = useState<Backend | null>(null)
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [recovering, setRecovering] = useState(false)
  const loadedFor = useRef<{ id: string; promise: Promise<void> } | null>(null)

  const loadUser = useCallback(async (b: Backend, u: AuthUser | null) => {
    if (!u) {
      loadedFor.current = null
      setUser(null)
      setProfile(null)
      setFavorites([])
      return
    }
    if (loadedFor.current?.id === u.id) return loadedFor.current.promise
    const promise = (async () => {
      try {
        const [p, f] = await Promise.all([b.getProfile(u), b.listFavorites(u.id)])
        setProfile(p)
        setFavorites(f)
        setUser(u)
      } catch {
        loadedFor.current = null
        // Sessão inválida/expirada: volta para o login.
        await b.signOut().catch(() => {})
        setUser(null)
      }
    })()
    loadedFor.current = { id: u.id, promise }
    return promise
  }, [])

  useEffect(() => {
    let unsub = () => {}
    let alive = true
    getBackend().then(async (b) => {
      if (!alive) return
      setBackend(b)
      unsub = b.onAuthChange((u, event) => {
        if (event === 'PASSWORD_RECOVERY') setRecovering(true)
        void loadUser(b, u)
      })
      await loadUser(b, await b.getUser())
      if (alive) setReady(true)
    })
    return () => {
      alive = false
      unsub()
    }
  }, [loadUser])

  const favKey = (f: Favorite) => `${f.kind}:${f.slug}`
  const favSet = useMemo(() => new Set(favorites.map(favKey)), [favorites])

  const isFavorite = useCallback((kind: FavoriteKind, slug: string) => favSet.has(`${kind}:${slug}`), [favSet])

  const toggleFavorite = useCallback(
    async (kind: FavoriteKind, slug: string) => {
      if (!backend || !user) return
      const on = !favSet.has(`${kind}:${slug}`)
      const prev = favorites
      // Atualização otimista: a interface responde na hora.
      setFavorites(on ? [...prev, { kind, slug }] : prev.filter((f) => !(f.kind === kind && f.slug === slug)))
      try {
        await backend.setFavorite(user.id, { kind, slug }, on)
        toast.show(on ? 'Salvo nos favoritos' : 'Removido dos favoritos')
      } catch {
        setFavorites(prev)
        toast.show('Não foi possível salvar. Tente novamente.', 'error')
      }
    },
    [backend, user, favSet, favorites, toast],
  )

  const updateProfile = useCallback(
    async (patch: Partial<Pick<Profile, 'name' | 'onboarded' | 'plan'>>) => {
      if (!backend || !user) return
      await backend.updateProfile(user.id, patch)
      setProfile((p) => (p ? { ...p, ...patch } : p))
    },
    [backend, user],
  )

  const markViewed = useCallback(
    (kind: FavoriteKind, slug: string) => {
      if (!backend || !user) return
      const lastViewed: LastViewed = { kind, slug, at: new Date().toISOString() }
      setProfile((p) => (p ? { ...p, lastViewed } : p))
      backend.updateProfile(user.id, { lastViewed }).catch(() => {})
    },
    [backend, user],
  )

  const signOut = useCallback(async () => {
    if (!backend) return
    await backend.signOut()
    await loadUser(backend, null)
  }, [backend, loadUser])

  const value: AppState = {
    backend,
    ready,
    user,
    profile,
    favorites,
    recovering,
    isFavorite,
    toggleFavorite,
    updateProfile,
    markViewed,
    signOut,
    clearRecovering: () => setRecovering(false),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>')
  return ctx
}

/** Para páginas autenticadas: backend e usuário garantidos. */
export function useSession() {
  const app = useApp()
  if (!app.backend || !app.user || !app.profile) throw new Error('Sessão ausente')
  return { ...app, backend: app.backend, user: app.user, profile: app.profile }
}
