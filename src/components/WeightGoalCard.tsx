import { useState, type FormEvent } from 'react'
import { Target, Info } from 'lucide-react'
import { Card, SectionTitle } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Field, Input } from '@/components/ui/input'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { formatKg, isLargeChange, parseKg, validateKg, weightProgress } from '@/lib/weight'
import type { WeightGoal } from '@/lib/types'

const fmtInput = (n?: number) => (n === undefined ? '' : String(n).replace('.', ','))

export function WeightGoalCard() {
  const { profile, updateProfile } = useSession()
  const toast = useToast()
  const w = profile.weight
  const [dialog, setDialog] = useState<'goal' | 'update' | null>(null)
  const [current, setCurrent] = useState('')
  const [goal, setGoal] = useState('')
  const [errors, setErrors] = useState<{ current?: string; goal?: string }>({})
  const [saving, setSaving] = useState(false)

  function open(kind: 'goal' | 'update') {
    setCurrent(fmtInput(w?.current))
    setGoal(fmtInput(w?.goal))
    setErrors({})
    setDialog(kind)
  }

  async function save(next: WeightGoal | null, message: string) {
    setSaving(true)
    try {
      await updateProfile({ weight: next })
      toast.show(message)
      setDialog(null)
    } catch {
      toast.show('Não foi possível salvar. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function submitGoal(e: FormEvent) {
    e.preventDefault()
    const c = parseKg(current)
    const g = parseKg(goal)
    const errs = { current: validateKg(c) ?? undefined, goal: validateKg(g) ?? undefined }
    setErrors(errs)
    if (errs.current || errs.goal) return
    // Nova meta reinicia o ponto de partida; editar mantém o início se a direção não mudou.
    const sameDirection = w && Math.sign(w.goal - w.start) === Math.sign(g! - w.start)
    const start = w && sameDirection && w.goal === g ? w.start : c!
    void save({ start, current: c!, goal: g!, updatedAt: new Date().toISOString() }, 'Meta salva')
  }

  function submitUpdate(e: FormEvent) {
    e.preventDefault()
    const c = parseKg(current)
    const err = validateKg(c)
    setErrors({ current: err ?? undefined })
    if (err || !w) return
    void save({ ...w, current: c!, updatedAt: new Date().toISOString() }, 'Peso atualizado')
  }

  const c = parseKg(current)
  const g = parseKg(goal)
  const showLargeHint = dialog === 'goal' && c && g && !validateKg(c) && !validateKg(g) && isLargeChange(c, g)

  return (
    <Card className="p-5">
      <SectionTitle>Minha meta</SectionTitle>
      {!w ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Target className="size-5" strokeWidth={1.75} />
          </div>
          <p className="flex-1 text-sm text-ink-muted">
            Se fizer sentido para você, registre seu peso atual e uma meta. É opcional e só você vê.
          </p>
          <Button variant="outline" size="sm" onClick={() => open('goal')}>
            Definir meta
          </Button>
        </div>
      ) : (
        <WeightSummary w={w} onUpdate={() => open('update')} onEdit={() => open('goal')} />
      )}

      <Dialog open={dialog === 'goal'} onClose={() => setDialog(null)} title={w ? 'Editar meta' : 'Definir meta'}>
        <form onSubmit={submitGoal} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Field id="w-current" label="Peso atual (kg)" error={errors.current}>
              <Input id="w-current" inputMode="decimal" placeholder="Ex.: 72,5" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </Field>
            <Field id="w-goal" label="Meta (kg)" error={errors.goal}>
              <Input id="w-goal" inputMode="decimal" placeholder="Ex.: 68" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </Field>
          </div>
          {showLargeHint && (
            <p className="flex gap-2 rounded-xl bg-gold-50 p-3 text-sm text-[#7A6438]">
              <Info className="mt-0.5 size-4 shrink-0" />
              Metas maiores costumam ser mais tranquilas quando divididas em etapas. Considere uma meta intermediária e
              conversar com um profissional de saúde.
            </p>
          )}
          <Button type="submit" className="w-full" loading={saving}>
            Salvar meta
          </Button>
          {w && (
            <Button type="button" variant="ghost" className="w-full text-ink-muted" onClick={() => save(null, 'Meta removida')}>
              Remover meta
            </Button>
          )}
        </form>
      </Dialog>

      <Dialog open={dialog === 'update'} onClose={() => setDialog(null)} title="Atualizar peso">
        <form onSubmit={submitUpdate} className="space-y-4" noValidate>
          <Field id="w-update" label="Peso de hoje (kg)" error={errors.current}>
            <Input id="w-update" inputMode="decimal" autoFocus value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <p className="text-sm text-ink-muted">O peso varia naturalmente de um dia para o outro. Observe a tendência, não um único dia.</p>
          <Button type="submit" className="w-full" loading={saving}>
            Salvar
          </Button>
        </form>
      </Dialog>
    </Card>
  )
}

function WeightSummary({ w, onUpdate, onEdit }: { w: WeightGoal; onUpdate: () => void; onEdit: () => void }) {
  const p = weightProgress(w)
  return (
    <div>
      <div className="grid grid-cols-3 text-center">
        {[
          { label: 'Início', value: w.start },
          { label: 'Atual', value: w.current },
          { label: 'Meta', value: w.goal },
        ].map((i) => (
          <div key={i.label}>
            <p className="text-[11px] uppercase tracking-wider text-ink-subtle">{i.label}</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{formatKg(i.value)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-50" role="progressbar" aria-valuenow={Math.round(p.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da meta">
        <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${p.progress * 100}%` }} />
      </div>
      <p className="mt-2.5 text-sm text-ink-muted">
        {p.reached ? (
          <strong className="text-brand">Meta alcançada. Parabéns pela constância!</strong>
        ) : p.direction === 'manter' ? (
          'Objetivo: manter o peso.'
        ) : (
          <>
            Faltam <strong className="text-ink">{formatKg(p.remaining)}</strong> · atualizado em{' '}
            {new Date(w.updatedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
          </>
        )}
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={onUpdate}>
          Atualizar peso
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Editar meta
        </Button>
      </div>
    </div>
  )
}
