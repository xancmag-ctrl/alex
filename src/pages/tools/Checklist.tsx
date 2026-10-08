import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { Card, Skeleton } from '@/components/ui/misc'
import { cn, todayKey } from '@/lib/utils'

export const CHECK_ITEMS = [
  { id: 'refeicoes', label: 'Organizei minhas refeições' },
  { id: 'agua', label: 'Bebi água' },
  { id: 'consciente', label: 'Tive uma alimentação consciente' },
  { id: 'sono', label: 'Cuidei do meu sono' },
]

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}

export function Checklist() {
  const { backend, user } = useSession()
  const toast = useToast()
  const [data, setData] = useState<Record<string, string[]> | null>(null)
  const [error, setError] = useState(false)
  const days = lastDays(7)
  const today = todayKey()

  useEffect(() => {
    backend
      .listChecks(user.id, todayKey(days[0]))
      .then(setData)
      .catch(() => setError(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, user.id])

  const checked = data?.[today] ?? []

  async function toggle(id: string) {
    if (!data) return
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id]
    const prev = data
    setData({ ...data, [today]: next })
    try {
      await backend.setChecks(user.id, today, next)
      if (next.length === CHECK_ITEMS.length && checked.length < CHECK_ITEMS.length) toast.show('Dia completo. Muito bem!')
    } catch {
      setData(prev)
      toast.show('Não foi possível salvar. Tente novamente.', 'error')
    }
  }

  if (error) return <p className="py-10 text-center text-sm text-danger">Não foi possível carregar o checklist. Recarregue a página.</p>

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="p-2">
        <div className="flex items-center justify-between px-3 pb-1 pt-3">
          <p className="font-semibold text-ink">Hoje</p>
          <p className="text-sm text-ink-muted">
            {checked.length} de {CHECK_ITEMS.length}
          </p>
        </div>
        <div className="mx-3 mb-2 mt-2 h-1.5 overflow-hidden rounded-full bg-brand-50">
          <div className="h-full rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${(checked.length / CHECK_ITEMS.length) * 100}%` }} />
        </div>
        {!data ? (
          <div className="space-y-2 p-2">
            {CHECK_ITEMS.map((i) => (
              <Skeleton key={i.id} className="h-14" />
            ))}
          </div>
        ) : (
          <ul>
            {CHECK_ITEMS.map((item) => {
              const on = checked.includes(item.id)
              return (
                <li key={item.id}>
                  <button
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(item.id)}
                    className="flex min-h-14 w-full items-center gap-3.5 rounded-xl px-3 text-left transition-colors hover:bg-brand-50/60"
                  >
                    <span
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                        on ? 'border-brand bg-brand text-white' : 'border-[#C9D1CB] bg-surface',
                      )}
                    >
                      {on && <Check className="size-4" strokeWidth={3} />}
                    </span>
                    <span className={cn('text-[15px]', on ? 'text-ink-muted' : 'text-ink')}>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <p className="font-semibold text-ink">Últimos 7 dias</p>
        <p className="mt-0.5 text-sm text-ink-muted">Um lembrete gentil, não uma cobrança.</p>
        <div className="mt-5 flex justify-between">
          {days.map((d) => {
            const key = todayKey(d)
            const n = data?.[key]?.length ?? 0
            const ratio = n / CHECK_ITEMS.length
            return (
              <div key={key} className="flex flex-col items-center gap-2">
                <div
                  className={cn('flex size-9 items-center justify-center rounded-full text-xs font-semibold', key === today && 'ring-2 ring-brand/30 ring-offset-2')}
                  style={{
                    backgroundColor: ratio === 0 ? '#EEF1EC' : `rgba(82,115,93,${0.25 + ratio * 0.75})`,
                    color: ratio > 0.5 ? '#fff' : '#68736C',
                  }}
                  title={`${n} de ${CHECK_ITEMS.length}`}
                >
                  {n || ''}
                </div>
                <span className="text-[11px] capitalize text-ink-subtle">
                  {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3)}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
