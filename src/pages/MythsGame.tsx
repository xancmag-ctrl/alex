import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/misc'
import { MYTHS } from '@/data/myths'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

export default function MythsGame() {
  const { markViewed } = useApp()
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<'mito' | 'verdade' | null>(null)
  const [score, setScore] = useState(0)
  const finished = index >= MYTHS.length

  useEffect(() => {
    markViewed('article', 'mitos-e-verdades')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function choose(a: 'mito' | 'verdade') {
    if (answer) return
    setAnswer(a)
    if (a === MYTHS[index].answer) setScore((s) => s + 1)
  }
  function next() {
    setAnswer(null)
    setIndex((i) => i + 1)
  }
  function restart() {
    setIndex(0)
    setScore(0)
    setAnswer(null)
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <PageHeader back="/aprenda" title="Mitos e verdades" subtitle="Leia a afirmação e escolha: mito ou verdade?" />

      {finished ? (
        <Card className="p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-ink-subtle">Resultado</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight text-brand">
            {score}
            <span className="text-2xl text-ink-subtle">/{MYTHS.length}</span>
          </p>
          <p className="mx-auto mt-4 max-w-sm text-[15px] text-ink-muted">
            {score >= 12
              ? 'Excelente! Você já tem uma ótima base.'
              : score >= 8
                ? 'Muito bom! Alguns conteúdos podem ajudar a completar o quadro.'
                : 'Ótimo ponto de partida. Os conteúdos de Fundamentos vão te ajudar.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={restart}>
              <RotateCcw /> Jogar de novo
            </Button>
            <Button asChild>
              <Link to="/aprenda">Ver conteúdos</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-50">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${(index / MYTHS.length) * 100}%` }} />
            </div>
            <span className="text-sm tabular-nums text-ink-muted">
              {index + 1}/{MYTHS.length}
            </span>
          </div>

          <Card key={index} className="animate-fade-in p-6 sm:p-8">
            <p className="text-[21px] font-semibold leading-snug tracking-tight text-ink">“{MYTHS[index].statement}”</p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {(['mito', 'verdade'] as const).map((opt) => {
                const isCorrect = MYTHS[index].answer === opt
                const picked = answer === opt
                return (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    disabled={!!answer}
                    className={cn(
                      'flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-[15px] font-semibold uppercase tracking-wider transition-colors',
                      !answer && 'border-line bg-surface text-ink hover:border-brand-600 hover:bg-brand-50',
                      answer && isCorrect && 'border-brand bg-brand text-white',
                      answer && picked && !isCorrect && 'border-danger/40 bg-red-50 text-danger',
                      answer && !picked && !isCorrect && 'border-line text-ink-subtle',
                    )}
                  >
                    {answer && isCorrect && <Check className="size-5" />}
                    {answer && picked && !isCorrect && <X className="size-5" />}
                    {opt}
                  </button>
                )
              })}
            </div>

            {answer && (
              <div className="mt-6 animate-fade-in" aria-live="polite">
                <p className={cn('font-semibold', answer === MYTHS[index].answer ? 'text-brand' : 'text-danger')}>
                  {answer === MYTHS[index].answer ? 'Você acertou!' : 'Não foi dessa vez.'}{' '}
                  <span className="text-ink">É {MYTHS[index].answer === 'mito' ? 'mito' : 'verdade'}.</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{MYTHS[index].explanation}</p>
                <Button className="mt-6 w-full" onClick={next}>
                  {index === MYTHS.length - 1 ? 'Ver resultado' : 'Próxima'} <ArrowRight />
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
