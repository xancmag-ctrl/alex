import { useEffect, useState } from 'react'
import { Play, Square, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Chip } from '@/components/ui/misc'
import { formatDuration } from '@/lib/plan'

const KEY = 'ji_timer'
const PRESETS = [12, 13, 14, 16]

interface TimerState {
  startedAt: number
  hours: number
}

function load(): TimerState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as TimerState) : null
  } catch {
    return null
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function clock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** Temporizador simples. O estado fica no aparelho, então continua contando mesmo se a página for fechada. */
export function Timer() {
  const [state, setState] = useState<TimerState | null>(load)
  const [hours, setHours] = useState(state?.hours ?? 12)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!state) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [state])

  function start() {
    const s = { startedAt: Date.now(), hours }
    localStorage.setItem(KEY, JSON.stringify(s))
    setNow(Date.now())
    setState(s)
  }
  function stop() {
    localStorage.removeItem(KEY)
    setState(null)
  }

  const total = (state?.hours ?? hours) * 3_600_000
  const elapsed = state ? now - state.startedAt : 0
  const progress = Math.min(1, elapsed / total)
  const finished = state && elapsed >= total
  const R = 96
  const C = 2 * Math.PI * R
  const end = state ? new Date(state.startedAt + total) : null

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="flex flex-col items-center px-5 py-8">
        <div className="relative size-[232px]">
          <svg viewBox="0 0 220 220" className="size-full -rotate-90">
            <circle cx="110" cy="110" r={R} fill="none" stroke="#EEF3EE" strokeWidth="12" />
            <circle
              cx="110"
              cy="110"
              r={R}
              fill="none"
              stroke={finished ? '#C6A76A' : '#294C3A'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {state ? (
              <>
                <p className="text-xs uppercase tracking-wider text-ink-subtle">{finished ? 'Concluído' : 'Decorrido'}</p>
                <p className="mt-1 text-[34px] font-semibold tabular-nums tracking-tight text-ink" aria-live="off">
                  {clock(elapsed)}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {finished ? `Meta de ${state.hours}h atingida` : `Faltam ${formatDuration(Math.ceil((total - elapsed) / 60000))}`}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-ink-subtle">Período</p>
                <p className="mt-1 text-[44px] font-semibold tabular-nums tracking-tight text-ink">{hours}h</p>
                <p className="text-sm text-ink-muted">definido por você</p>
              </>
            )}
          </div>
        </div>

        {state ? (
          <>
            <p className="mt-6 text-sm text-ink-muted">
              Início {new Date(state.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · Término{' '}
              {end!.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <Button variant="outline" className="mt-5 w-full max-w-xs" onClick={stop}>
              <Square className="!size-4" /> {finished ? 'Encerrar' : 'Parar temporizador'}
            </Button>
          </>
        ) : (
          <>
            <div className="mt-7 flex flex-wrap justify-center gap-2" role="group" aria-label="Escolha o período">
              {PRESETS.map((h) => (
                <Chip key={h} active={hours === h} onClick={() => setHours(h)}>
                  {h}h
                </Chip>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="custom-hours" className="text-sm text-ink-muted">
                Outro valor
              </label>
              <input
                id="custom-hours"
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(e) => setHours(Math.min(24, Math.max(1, Number(e.target.value) || 1)))}
                className="h-10 w-20 rounded-lg border border-line bg-surface px-3 text-center tabular-nums focus-visible:border-brand-600 focus-visible:outline-none"
              />
              <span className="text-sm text-ink-muted">horas</span>
            </div>
            <Button className="mt-6 w-full max-w-xs" onClick={start}>
              <Play className="!size-4" /> Iniciar
            </Button>
          </>
        )}
      </Card>

      <Card className="h-fit p-5">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <Info className="size-4 text-brand-600" /> Sobre o temporizador
        </p>
        <ul className="mt-3 space-y-2.5 text-sm text-ink-muted">
          <li>• É uma ferramenta de acompanhamento, não uma recomendação de duração.</li>
          <li>• Continua contando mesmo se você fechar o app neste aparelho.</li>
          <li>• Sentiu tontura, fraqueza ou mal-estar? Pare e faça uma refeição.</li>
        </ul>
      </Card>
    </div>
  )
}
