import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { NotebookPen, Trash2 } from 'lucide-react'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, Chip, EmptyState, Skeleton } from '@/components/ui/misc'
import { Input, Label, Textarea } from '@/components/ui/input'
import type { JournalEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

export const HUNGER = ['Pouca', 'Leve', 'Moderada', 'Bastante', 'Muita']
export const FEELINGS = ['Tranquilo(a)', 'Satisfeito(a)', 'Com energia', 'Cansado(a)', 'Ansioso(a)', 'Estressado(a)']

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const y = new Date()
  y.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === y.toDateString()) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function Journal() {
  const { backend, user } = useSession()
  const toast = useToast()
  const [entries, setEntries] = useState<JournalEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [meal, setMeal] = useState('')
  const [hunger, setHunger] = useState<number | null>(null)
  const [feeling, setFeeling] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    backend
      .listJournal(user.id)
      .then(setEntries)
      .catch(() => setError(true))
  }, [backend, user.id])

  const grouped = useMemo(() => {
    const m = new Map<string, JournalEntry[]>()
    for (const e of entries ?? []) {
      const k = new Date(e.createdAt).toDateString()
      m.set(k, [...(m.get(k) ?? []), e])
    }
    return [...m.values()]
  }, [entries])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!meal.trim()) return setFormError('Descreva a refeição.')
    if (!hunger) return setFormError('Escolha seu nível de fome.')
    if (!feeling) return setFormError('Escolha como você estava se sentindo.')
    setSaving(true)
    try {
      const created = await backend.addJournal(user.id, { meal: meal.trim(), hunger, feeling, note: note.trim() })
      setEntries((x) => [created, ...(x ?? [])])
      setMeal('')
      setHunger(null)
      setFeeling(null)
      setNote('')
      toast.show('Registro salvo')
    } catch {
      toast.show('Não foi possível salvar. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    const prev = entries
    setEntries((x) => x!.filter((e) => e.id !== id))
    try {
      await backend.removeJournal(user.id, id)
    } catch {
      setEntries(prev)
      toast.show('Não foi possível remover.', 'error')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:gap-8">
      <Card className="h-fit p-5">
        <p className="font-semibold text-ink">Novo registro</p>
        <p className="mt-0.5 text-sm text-ink-muted">Observar, sem julgar.</p>
        <form onSubmit={submit} className="mt-5 space-y-5" noValidate>
          <div>
            <Label htmlFor="meal">Refeição</Label>
            <Input id="meal" value={meal} onChange={(e) => setMeal(e.target.value)} placeholder="Ex.: Omelete com salada" maxLength={160} />
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Nível de fome antes de comer</legend>
            <div className="grid grid-cols-5 gap-1.5">
              {HUNGER.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={hunger === i + 1}
                  onClick={() => setHunger(i + 1)}
                  className={cn(
                    'flex flex-col items-center rounded-xl border py-2 text-[11px] font-medium transition-colors',
                    hunger === i + 1 ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink-muted hover:border-brand-600/40',
                  )}
                >
                  <span className="text-base font-semibold">{i + 1}</span>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Como você estava se sentindo?</legend>
            <div className="flex flex-wrap gap-2">
              {FEELINGS.map((f) => (
                <Chip key={f} active={feeling === f} onClick={() => setFeeling(f)}>
                  {f}
                </Chip>
              ))}
            </div>
          </fieldset>
          <div>
            <Label htmlFor="note">
              Observação <span className="font-normal text-ink-subtle">(opcional)</span>
            </Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Algo que você queira lembrar" />
          </div>
          {formError && (
            <p role="alert" className="text-sm text-danger">
              {formError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={saving}>
            Salvar registro
          </Button>
        </form>
      </Card>

      <section>
        <p className="mb-3 font-semibold text-ink">Seus registros</p>
        {error ? (
          <p className="py-10 text-center text-sm text-danger">Não foi possível carregar o diário. Recarregue a página.</p>
        ) : !entries ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : entries.length === 0 ? (
          <Card>
            <EmptyState icon={NotebookPen} title="Nenhum registro ainda" text="Seus registros aparecem aqui. Comece pela próxima refeição." />
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped.map((list) => (
              <div key={list[0].createdAt}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle first-letter:uppercase">{dayLabel(list[0].createdAt)}</p>
                <div className="space-y-2.5">
                  {list.map((e) => (
                    <Card key={e.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{e.meal}</p>
                          <p className="mt-0.5 text-xs text-ink-subtle">
                            {new Date(e.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(e.id)}
                          aria-label="Excluir registro"
                          className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-subtle hover:bg-red-50 hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand">
                          Fome {e.hunger}/5 · {HUNGER[e.hunger - 1]}
                        </span>
                        <span className="rounded-full bg-gold-50 px-2.5 py-1 font-medium text-[#7A6438]">{e.feeling}</span>
                      </div>
                      {e.note && <p className="mt-3 text-sm text-ink-muted">{e.note}</p>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
