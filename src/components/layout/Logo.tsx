import { cn } from '@/lib/utils'

export const APP_NAME = 'Jejum Inteligente'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#294C3A" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#DDE8DE" strokeWidth="2" />
      <path d="M16 8a8 8 0 0 1 8 8h-8z" fill="#C6A76A" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-ink">{APP_NAME}</span>
    </span>
  )
}
