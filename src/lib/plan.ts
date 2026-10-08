import type { PlanSettings } from './types'

export const DEFAULT_PLAN: PlanSettings = { wake: '07:00', firstMeal: '12:00', lastMeal: '20:00', sleep: '23:00' }

export const PLAN_EXAMPLES: { label: string; firstMeal: string; lastMeal: string }[] = [
  { label: '12:12', firstMeal: '08:00', lastMeal: '20:00' },
  { label: '14:10', firstMeal: '10:00', lastMeal: '20:00' },
  { label: '16:8', firstMeal: '12:00', lastMeal: '20:00' },
]

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h % 24) * 60 + (m || 0)
}

/** Duração entre dois horários, atravessando a meia-noite se necessário. */
export function span(from: string, to: string) {
  const d = toMinutes(to) - toMinutes(from)
  return d <= 0 ? d + 1440 : d
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${String(m).padStart(2, '0')}min`
}

export interface PlanStatus {
  eating: boolean
  /** minutos até a próxima mudança de período */
  minutesToChange: number
  eatingMinutes: number
  fastingMinutes: number
}

export function planStatus(plan: PlanSettings, now = new Date()): PlanStatus {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const start = toMinutes(plan.firstMeal)
  const eatingMinutes = span(plan.firstMeal, plan.lastMeal)
  const sinceStart = (nowMin - start + 1440) % 1440
  const eating = sinceStart < eatingMinutes
  const minutesToChange = eating ? eatingMinutes - sinceStart : 1440 - sinceStart
  return { eating, minutesToChange, eatingMinutes, fastingMinutes: 1440 - eatingMinutes }
}
