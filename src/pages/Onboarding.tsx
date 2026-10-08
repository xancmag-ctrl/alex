import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChefHat, CalendarClock, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoMark, APP_NAME } from '@/components/layout/Logo'
import { useApp } from '@/contexts/AppContext'
import { firstName, cn } from '@/lib/utils'

export default function Onboarding() {
  const { profile, updateProfile } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  async function finish() {
    setSaving(true)
    try {
      await updateProfile({ onboarded: true })
    } finally {
      navigate('/', { replace: true })
    }
  }

  const name = firstName(profile?.name)
  const slides = [
    {
      visual: <LogoMark className="size-16" />,
      title: `Bem-vindo ao ${APP_NAME}${name ? `, ${name}` : ''}`,
      text: 'Um espaço simples e organizado para você entender o jejum intermitente no seu ritmo.',
    },
    {
      visual: (
        <div className="flex gap-3">
          {[ChefHat, CalendarClock, BookOpen].map((Icon, i) => (
            <div key={i} className="flex size-14 items-center justify-center rounded-2xl bg-brand-100 text-brand">
              <Icon className="size-6" strokeWidth={1.75} />
            </div>
          ))}
        </div>
      ),
      title: 'Aprenda, organize sua rotina e encontre opções práticas para o seu dia.',
      text: 'Receitas, ferramentas e conteúdos curtos — tudo em um só lugar.',
    },
    {
      visual: (
        <div className="flex size-16 items-center justify-center rounded-full bg-gold-50 text-gold">
          <Sparkles className="size-7" strokeWidth={1.75} />
        </div>
      ),
      title: 'Vamos começar?',
      text: 'Lembre-se: o jejum intermitente não é adequado para todas as pessoas. Na dúvida, converse com um profissional de saúde.',
    },
  ]
  const s = slides[step]
  const last = step === slides.length - 1

  return (
    <div className="flex min-h-dvh flex-col bg-bg px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex h-10 items-center justify-end">
          {!last && (
            <button onClick={finish} className="text-sm font-medium text-ink-muted hover:text-ink">
              Pular
            </button>
          )}
        </div>
        <div key={step} className="flex flex-1 animate-fade-in flex-col items-center justify-center text-center">
          <div className="mb-10">{s.visual}</div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">{s.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
        </div>
        <div className="mb-8 flex justify-center gap-2" aria-hidden>
          {slides.map((_, i) => (
            <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-6 bg-brand' : 'w-1.5 bg-line')} />
          ))}
        </div>
        {last ? (
          <Button size="lg" onClick={finish} loading={saving}>
            Começar
          </Button>
        ) : (
          <Button size="lg" onClick={() => setStep(step + 1)}>
            Continuar <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  )
}
