import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-xl border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-ink-subtle transition-colors focus-visible:outline-none focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand/15 disabled:opacity-60 aria-[invalid=true]:border-danger',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[88px] w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand/15',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />
}

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
