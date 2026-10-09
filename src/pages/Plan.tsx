import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sunrise, Utensils, Moon, MoonStar, Clock, ShieldCheck, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, SectionTitle } from '@/components/ui/misc'
import { Input, Label } from '@/components/ui/input'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { WeightGoalCard } from '@/components/WeightGoalCard'
import { DEFAULT_PLAN, PLAN_EXAMPLES, planStatus, formatDuration, span, toMinutes } from '@/lib/plan'
import type { PlanSettings } from '@/lib/types'
import { cn } from '@/lib/utils'

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

/** Barra de 24h com a janela de alimentação destacada e o horário atual. */
function DayBar({ plan, now }: { plan: PlanSettings; now: Date }) {
  const start = toMinutes(plan.firstMeal) / 1440
  const len = span(plan.firstMeal, plan.lastMeal) / 1440
  const nowPos = (now.getHours() * 60 + now.getMinutes()) / 1440
  const segments = start + len > 1 ? [[start, 1 - start], [0, start + len - 1]] : [[start, len]]
  return (
    <div>
      <div className="relative h-3 rounded-full bg-[#EFE8D8]">
        {segments.map(([l, w], i) => (
          <div key={i} className="absolute inset-y-0 rounded-full bg-brand-600" style={{ left: `${l * 100}%`, width: `${w * 100}%` }} />
        ))}
        <div
          className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded-full bg-ink ring-2 ring-surface"
          style={{ left: `${nowPos * 100}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-subtle">
        <span>0h</span>
        <span>6h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand-600" /> Alimentação
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#E5DAC2]" /> Sem alimentação
        </span>
      </div>
    </div>
  )
}

function Timeline({ plan, now }: { plan: PlanSettings; now: Date }) {
  const s = planStatus(plan, now)
  const steps = [
    { icon: Sunrise, title: 'Manhã', time: plan.wake, text: 'Acordar, beber água e começar o dia com calma.', active: false },
    {
      icon: Utensils,
      title: 'Período de alimentação',
      time: `${plan.firstMeal} – ${plan.lastMeal}`,
      text: `${formatDuration(s.eatingMinutes)} para suas refeições.`,
      active: s.eating,
    },
    {
      icon: Moon,
      title: 'Período sem alimentação',
      time: `${plan.lastMeal} – ${plan.firstMeal}`,
      text: `${formatDuration(s.fastingMinutes)}, incluindo o sono. Água é sempre bem-vinda.`,
      active: !s.eating,
    },
    {
      icon: Clock,
      title: 'Próxima refeição',
      time: s.eating ? 'Agora' : plan.firstMeal,
      text: s.eating ? 'Você está no seu período de alimentação.' : `Em ${formatDuration(s.minutesToChange)}.`,
      active: false,
    },
    { icon: MoonStar, title: 'Noite', time: plan.sleep, text: 'Desacelerar e priorizar uma boa noite de sono.', active: false },
  ]
  return (
    <ol className="relative">
      {steps.map((st, i) => (
        <li key={st.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-line" aria-hidden />}
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full border',
              st.active ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-brand-600',
            )}
          >
            <st.icon className="size-[18px]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-semibold text-ink">
                {st.title}
                {st.active && <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand">Agora</span>}
              </p>
              <p className="text-sm tabular-nums text-ink-muted">{st.time}</p>
            </div>
            <p className="mt-0.5 text-sm text-ink-muted">{st.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function PlanForm({ initial, onSave, onCancel }: { initial: PlanSettings; onSave: (p: PlanSettings) => Promise<void>; onCancel?: () => void }) {
  const [p, setP] = useState(initial)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof PlanSettings) => (e: React.ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: e.target.value })
  const fields: { k: keyof PlanSettings; label: string }[] = [
    { k: 'wake', label: 'Costumo acordar' },
    { k: 'firstMeal', label: 'Primeira refeição' },
    { k: 'lastMeal', label: 'Última refeição' },
    { k: 'sleep', label: 'Costumo dormir' },
  ]
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
          await onSave(p)
        } finally {
          setSaving(false)
        }
      }}
    >
      <p className="mb-2 text-sm font-medium text-ink">Formatos comuns (apenas exemplos)</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {PLAN_EXAMPLES.map((ex) => {
          const active = p.firstMeal === ex.firstMeal && p.lastMeal === ex.lastMeal
          return (
            <button
              type="button"
              key={ex.label}
              onClick={() => setP({ ...p, firstMeal: ex.firstMeal, lastMeal: ex.lastMeal })}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium',
                active ? 'border-brand bg-brand text-white' : 'border-line bg-surface hover:border-brand-600/40',
              )}
            >
              {ex.label} <span className={active ? 'text-white/70' : 'text-ink-muted'}>· {ex.firstMeal}–{ex.lastMeal}</span>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.k}>
            <Label htmlFor={f.k}>{f.label}</Label>
            <Input id={f.k} type="time" required value={p[f.k]} onChange={set(f.k)} className="tabular-nums" />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        Período de alimentação: <strong className="text-ink">{formatDuration(span(p.firstMeal, p.lastMeal))}</strong>
      </p>
      <div className="mt-5 flex gap-3">
        <Button type="submit" loading={saving} className="flex-1">
          Salvar horários
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

export default function Plan() {
  const { profile, updateProfile } = useSession()
  const toast = useToast()
  const now = useNow()
  const [editing, setEditing] = useState(!profile.plan)
  const plan = profile.plan

  async function save(p: PlanSettings) {
    try {
      await updateProfile({ plan: p })
      setEditing(false)
      toast.show('Horários salvos')
    } catch {
      toast.show('Não foi possível salvar. Tente novamente.', 'error')
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Meu Plano" subtitle="Organize sua rotina de acordo com o que faz sentido para você." />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="space-y-6">
          {plan && !editing ? (
            <>
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <SectionTitle>Seu dia</SectionTitle>
                  <span className="-mt-3 text-sm tabular-nums text-ink-muted">
                    Agora: {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <DayBar plan={plan} now={now} />
              </Card>
              <Card className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <SectionTitle>Rotina</SectionTitle>
                  <Button variant="ghost" size="sm" className="-mt-3" onClick={() => setEditing(true)}>
                    <Pencil /> Editar
                  </Button>
                </div>
                <Timeline plan={plan} now={now} />
              </Card>
            </>
          ) : (
            <Card className="p-5">
              <SectionTitle>{plan ? 'Editar horários' : 'Defina seus horários'}</SectionTitle>
              <p className="mb-5 text-sm text-ink-muted">
                Comece pelo que já é parecido com a sua rotina. Você pode mudar quando quiser.
              </p>
              <PlanForm initial={plan ?? DEFAULT_PLAN} onSave={save} onCancel={plan ? () => setEditing(false) : undefined} />
            </Card>
          )}
          <WeightGoalCard />
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <p className="font-semibold text-ink">Como usar</p>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-muted">
              <li>• Este plano é uma ferramenta de organização pessoal, não uma prescrição.</li>
              <li>• Ajuste os horários à sua rotina de trabalho, sono e família.</li>
              <li>• Sentiu mal-estar? Faça uma refeição. Seu bem-estar vem primeiro.</li>
              <li>• Use o Temporizador em Ferramentas para acompanhar um período definido por você.</li>
            </ul>
          </Card>
          <Link
            to="/aprenda/categoria/seguranca"
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-sm hover:bg-brand-50/50"
          >
            <ShieldCheck className="size-5 shrink-0 text-brand-600" />
            <span className="text-ink-muted">
              O jejum intermitente não é adequado para todas as pessoas. <strong className="text-ink">Veja a Central de Segurança.</strong>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  )
}
