import type { ReactNode } from 'react'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className, label = 'Carregando' }: { className?: string; label?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center py-10 text-ink-muted', className)}>
      <Loader2 className="size-6 animate-spin" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-line/70', className)} />
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  text?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="size-6" strokeWidth={1.75} />
      </div>
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-xs text-sm text-ink-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface', className)} {...rest}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{children}</h2>
      {action}
    </div>
  )
}

/** Controle segmentado simples (substitui abas). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; icon?: LucideIcon }[]
  className?: string
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-1 rounded-xl bg-brand-50 p-1', className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
              active ? 'bg-surface text-brand shadow-sm' : 'text-ink-muted hover:text-ink',
            )}
          >
            {o.icon && <o.icon className="hidden size-4 shrink-0 sm:block" />}
            <span className="truncate">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Chip({
  active,
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink hover:border-brand-600/40',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
