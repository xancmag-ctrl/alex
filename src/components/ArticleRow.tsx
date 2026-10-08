import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { ARTICLE_CATEGORIES, type Article } from '@/data/articles'

export function articleHref(a: Article) {
  return a.interactive === 'mitos' ? '/aprenda/mitos-e-verdades' : `/aprenda/${a.slug}`
}

export function ArticleRow({ article, showCategory }: { article: Article; showCategory?: boolean }) {
  const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category)!
  const Icon = article.interactive ? Sparkles : cat.icon
  return (
    <Link
      to={articleHref(article)}
      className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-brand-50/60 focus-visible:bg-brand-50 focus-visible:outline-none"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug text-ink">{article.title}</p>
        <p className="mt-0.5 truncate text-[13px] text-ink-muted">
          {showCategory ? `${cat.label} · ` : ''}
          {article.interactive ? 'Interativo' : `${article.minutes} min de leitura`}
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-ink-subtle" />
    </Link>
  )
}
