import type { WeightGoal } from './types'

export const MIN_KG = 30
export const MAX_KG = 300

/** Aceita "72,5" ou "72.5". Retorna null se inválido. */
export function parseKg(text: string): number | null {
  const n = Number(text.replace(',', '.').trim())
  if (!text.trim() || !Number.isFinite(n)) return null
  return Math.round(n * 10) / 10
}

export function validateKg(n: number | null): string | null {
  if (n === null) return 'Digite um peso válido.'
  if (n < MIN_KG || n > MAX_KG) return `Digite um valor entre ${MIN_KG} e ${MAX_KG} kg.`
  return null
}

export function formatKg(n: number) {
  return `${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`
}

export interface WeightProgress {
  /** 0 a 1 */
  progress: number
  remaining: number
  reached: boolean
  direction: 'perder' | 'ganhar' | 'manter'
}

export function weightProgress(w: WeightGoal): WeightProgress {
  const direction = w.goal < w.start ? 'perder' : w.goal > w.start ? 'ganhar' : 'manter'
  const remaining = Math.round(Math.abs(w.goal - w.current) * 10) / 10
  if (direction === 'manter') return { progress: 1, remaining, reached: remaining <= 0.5, direction }
  const done = (w.start - w.current) / (w.start - w.goal)
  const progress = Math.min(1, Math.max(0, done))
  const reached = direction === 'perder' ? w.current <= w.goal : w.current >= w.goal
  return { progress: reached ? 1 : progress, remaining: reached ? 0 : remaining, reached, direction }
}

/** Metas muito distantes do peso atual recebem um lembrete gentil (não bloqueia). */
export function isLargeChange(current: number, goal: number) {
  return Math.abs(goal - current) / current > 0.2
}
