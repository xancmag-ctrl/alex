import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, BookX } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleRow } from '@/components/ArticleRow'
import { Card, EmptyState, SectionTitle } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { ARTICLES, ARTICLE_CATEGORIES, SAFETY_DISCLAIMER } from '@/data/articles'
import { TIPS } from '@/data/tips'

export default function Learn() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Aprenda" subtitle="Conteúdos curtos e diretos, para ler em poucos minutos." />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="space-y-6">
          <Link
            to="/aprenda/mitos-e-verdades"
            className="group flex items-center gap-4 rounded-2xl bg-brand p-5 text-white hover:bg-[#21402F]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="size-6 text-gold" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="text-[17px] font-semibold">Mitos e verdades</p>
              <p className="text-sm text-white/70">15 afirmações para testar o que você sabe</p>
            </div>
            <ArrowRight className="size-5 text-white/60 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {ARTICLE_CATEGORIES.map((cat) => {
            const list = ARTICLES.filter((a) => a.category === cat.id && !a.interactive)
            return (
              <section key={cat.id} id={cat.id}>
                <SectionTitle
                  action={
                    cat.id === 'seguranca' ? (
                      <span className="flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-[#7A6438]">
                        <ShieldCheck className="size-3.5" /> Importante
                      </span>
                    ) : undefined
                  }
                >
                  {cat.label}
                </SectionTitle>
                <Card className="divide-y divide-line overflow-hidden">
                  {list.map((a) => (
                    <ArticleRow key={a.slug} article={a} />
                  ))}
                </Card>
              </section>
            )
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-10 lg:h-fit">
          <Link to="/aprenda/categoria/seguranca" className="block rounded-2xl border border-gold/40 bg-gold-50 p-5 hover:border-gold">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <ShieldCheck className="size-5 text-gold" /> Central de Segurança
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              O jejum intermitente não é adequado para todas as pessoas. Veja quem deve conversar com um profissional antes de
              começar.
            </p>
          </Link>
          <Card className="p-5">
            <p className="font-semibold text-ink">Dicas práticas</p>
            <ul className="mt-3 space-y-3">
              {TIPS.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>
          <p className="px-1 text-xs leading-relaxed text-ink-subtle">{SAFETY_DISCLAIMER}</p>
        </aside>
      </div>
    </div>
  )
}

/** Página de uma categoria (usada principalmente para a Central de Segurança). */
export function LearnCategory() {
  const { id } = useParams()
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === id)
  if (!cat) {
    return (
      <EmptyState
        icon={BookX}
        title="Categoria não encontrada"
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/aprenda">Voltar para Aprenda</Link>
          </Button>
        }
      />
    )
  }
  const list = ARTICLES.filter((a) => a.category === cat.id)
  const isSafety = cat.id === 'seguranca'
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader back="/aprenda" title={isSafety ? 'Central de Segurança' : cat.label} subtitle={cat.description} />
      {isSafety && (
        <Card className="mb-6 border-gold/40 bg-gold-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="size-5 text-gold" /> Antes de tudo
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">
            O jejum intermitente <strong>não é adequado para todas as pessoas</strong>. Pessoas com condições de saúde,
            gestantes, lactantes, quem usa determinados medicamentos ou tem histórico de transtornos alimentares devem
            conversar com um profissional de saúde antes de fazer mudanças na alimentação.
          </p>
          <p className="mt-3 text-sm font-medium text-[#7A6438]">{SAFETY_DISCLAIMER}</p>
        </Card>
      )}
      <Card className="divide-y divide-line overflow-hidden">
        {list.map((a) => (
          <ArticleRow key={a.slug} article={a} />
        ))}
      </Card>
    </div>
  )
}
