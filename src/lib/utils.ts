import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Data local no formato AAAA-MM-DD (sem conversão para UTC). */
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Índice estável por dia — usado para "receita do dia", "dica do dia" etc. */
export function dayIndex(length: number, d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0)
  const day = Math.floor((d.getTime() - start.getTime()) / 86_400_000)
  return day % length
}

export function firstName(name?: string | null) {
  return (name ?? '').trim().split(/\s+/)[0] ?? ''
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}
