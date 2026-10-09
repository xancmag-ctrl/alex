export type FavoriteKind = 'recipe' | 'article'

export interface PlanSettings {
  wake: string // "07:00"
  firstMeal: string // "12:00"
  lastMeal: string // "20:00"
  sleep: string // "23:00"
}

/** Meta de peso (opcional). Pesos em kg. */
export interface WeightGoal {
  start: number
  current: number
  goal: number
  updatedAt: string
}

export interface LastViewed {
  kind: FavoriteKind
  slug: string
  at: string
}

export interface Profile {
  id: string
  name: string
  email: string
  onboarded: boolean
  plan: PlanSettings | null
  lastViewed: LastViewed | null
  weight: WeightGoal | null
}

export interface Favorite {
  kind: FavoriteKind
  slug: string
}

export interface ShoppingItem {
  id: string
  name: string
  checked: boolean
  recipeSlug: string | null
  createdAt: string
}

export interface JournalEntry {
  id: string
  meal: string
  hunger: number // 1–5
  feeling: string
  note: string
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
}

export type SignUpResult = { status: 'signed_in' } | { status: 'confirm_email' }

/**
 * Camada de dados do app. Existem duas implementações:
 * - Supabase (produção) — `supabaseBackend.ts`
 * - Local/demonstração (sem variáveis de ambiente) — `localBackend.ts`
 */
export interface Backend {
  mode: 'supabase' | 'demo'
  // Auth
  getUser(): Promise<AuthUser | null>
  onAuthChange(cb: (user: AuthUser | null, event?: string) => void): () => void
  signUp(name: string, email: string, password: string): Promise<SignUpResult>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  updatePassword(password: string): Promise<void>
  // Perfil
  getProfile(user: AuthUser): Promise<Profile>
  updateProfile(userId: string, patch: Partial<Pick<Profile, 'name' | 'onboarded' | 'plan' | 'lastViewed' | 'weight'>>): Promise<void>
  // Favoritos
  listFavorites(userId: string): Promise<Favorite[]>
  setFavorite(userId: string, fav: Favorite, on: boolean): Promise<void>
  // Checklist diário
  listChecks(userId: string, fromDay: string): Promise<Record<string, string[]>>
  setChecks(userId: string, day: string, items: string[]): Promise<void>
  // Lista de compras
  listShopping(userId: string): Promise<ShoppingItem[]>
  addShopping(userId: string, names: string[], recipeSlug?: string | null): Promise<ShoppingItem[]>
  updateShopping(userId: string, id: string, patch: Partial<Pick<ShoppingItem, 'checked' | 'name'>>): Promise<void>
  removeShopping(userId: string, ids: string[]): Promise<void>
  // Diário
  listJournal(userId: string): Promise<JournalEntry[]>
  addJournal(userId: string, entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry>
  removeJournal(userId: string, id: string): Promise<void>
}
