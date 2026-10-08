import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string
  subtitle?: ReactNode
  back?: boolean | string
  action?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div className="mb-6">
      {back && (
        <button
          onClick={() => (typeof back === 'string' ? navigate(back) : window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="-ml-2 mb-3 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-ink-muted hover:bg-brand-50 hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Voltar
        </button>
      )}
      {title && (
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink lg:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-ink-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      )}
    </div>
  )
}
