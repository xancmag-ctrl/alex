import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, BookX, ShieldCheck } from 'lucide-react'
import { ARTICLES, ARTICLE_CATEGORIES, SAFETY_DISCLAIMER, getArticle } from '@/data/articles'
import { PageHeader } from '@/components/layout/PageHeader'
import { FavoriteButton } from '@/components/FavoriteButton'
import { articleHref } from '@/components/ArticleRow'
import { Button } from '@/components/ui/button'
import { Card, EmptyState } from '@/components/ui/misc'
import { useApp } from '@/contexts/AppContext'

export default function ArticleDetail() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  const { markViewed } = useApp()

  useEffect(() => {
    if (article && !article.interactive) markViewed('article', article.slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.slug])

  if (article?.interactive === 'mitos') return <Navigate to="/aprenda/mitos-e-verdades" replace />
  if (!article) {
    return (
      <EmptyState
        icon={BookX}
        title="Conteúdo não encontrado"
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/aprenda">Voltar para Aprenda</Link>
          </Button>
        }
      />
    )
  }

  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category)!
  const siblings = ARTICLES.filter((a) => a.category === article.category)
  const idx = siblings.findIndex((a) => a.slug === article.slug)
  const next = siblings[idx + 1] ?? ARTICLES[(ARTICLES.indexOf(article) + 1) % ARTICLES.length]

  return (
    <article className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader back="/aprenda" title="" />
      <div className="-mt-6">
        <p className="text-sm font-medium text-brand-600">
          {cat.label} · {article.minutes} min de leitura
        </p>
        <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-tight text-ink lg:text-[34px]">{article.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">{article.summary}</p>
        <div className="mt-5">
          <FavoriteButton kind="article" slug={article.slug} withLabel />
        </div>
      </div>

      <div className="mt-8 space-y-7 border-t border-line pt-8">
        {article.sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2 className="mb-3 text-lg font-semibold text-ink">{s.heading}</h2>}
            {s.text?.map((p, j) => (
              <p key={j} className="mb-3 text-[16px] leading-[1.7] text-[#2B352F] last:mb-0">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="space-y-2.5">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-3 text-[16px] leading-[1.6] text-[#2B352F]">
                    <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" />
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-10 flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-sm text-ink-muted">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" />
        <p>{SAFETY_DISCLAIMER}</p>
      </div>

      {next && next.slug !== article.slug && (
        <Link to={articleHref(next)} className="mt-4 block">
          <Card className="flex items-center gap-4 p-4 hover:bg-brand-50/50">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">Próximo</p>
              <p className="mt-0.5 font-semibold text-ink">{next.title}</p>
            </div>
            <ArrowRight className="size-5 text-ink-subtle" />
          </Card>
        </Link>
      )}
    </article>
  )
}
