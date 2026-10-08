import type { Backend } from './types'
import { createLocalBackend } from './localBackend'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isDemoMode = !url || !key

let instance: Backend | null = null
let pending: Promise<Backend> | null = null

/** Carrega o Supabase sob demanda (fica fora do bundle inicial no modo demo). */
export function getBackend(): Promise<Backend> {
  if (instance) return Promise.resolve(instance)
  if (!pending) {
    pending = isDemoMode
      ? Promise.resolve(createLocalBackend())
      : import('./supabaseBackend').then((m) => m.createSupabaseBackend(url!, key!))
    pending.then((b) => (instance = b))
  }
  return pending
}

export const SUPPORT_CONTACT = (import.meta.env.VITE_SUPPORT_CONTACT as string | undefined) ?? ''
