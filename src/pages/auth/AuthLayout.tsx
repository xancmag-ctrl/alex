import type { ReactNode } from 'react'
import { BookOpen, ChefHat, CalendarClock } from 'lucide-react'
import { Logo, LogoMark, APP_NAME } from '@/components/layout/Logo'
import { isDemoMode } from '@/lib/backend'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-bg">
      <section className="relative hidden w-[44%] max-w-xl flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <LogoMark className="[&_rect]:fill-white/10" />
          <span className="font-semibold">{APP_NAME}</span>
        </div>
        <div>
          <p className="text-[34px] font-semibold leading-tight tracking-tight">
            Aprenda, organize sua rotina e encontre opções práticas para o seu dia.
          </p>
          <ul className="mt-10 space-y-4 text-[15px] text-white/80">
            <li className="flex items-center gap-3">
              <ChefHat className="size-5 text-gold" /> Receitas simples e organizadas
            </li>
            <li className="flex items-center gap-3">
              <CalendarClock className="size-5 text-gold" /> Ferramentas para a sua rotina
            </li>
            <li className="flex items-center gap-3">
              <BookOpen className="size-5 text-gold" /> Conteúdos diretos ao ponto
            </li>
          </ul>
        </div>
        <p className="text-xs text-white/50">
          Conteúdo educativo. Não substitui avaliação ou acompanhamento de profissionais de saúde.
        </p>
        <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-28 -top-28 size-[420px] opacity-[0.07]">
          <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="40" />
        </svg>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-[15px] text-ink-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {isDemoMode && (
            <p className="mt-8 rounded-xl bg-gold-50 px-4 py-3 text-xs leading-relaxed text-[#7A6438]">
              <strong>Modo demonstração:</strong> o Supabase não está configurado, então os dados ficam salvos apenas
              neste navegador.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
      {message}
    </div>
  )
}
