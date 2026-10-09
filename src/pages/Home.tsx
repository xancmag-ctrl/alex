import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarClock, ChefHat, Clock, Lightbulb, Wrench, PlayCircle } from 'lucide-react'
import { useSession } from '@/contexts/AppContext'
import { RECIPES, getRecipe, CATEGORY_LABEL } from '@/data/recipes'
import { ARTICLES, getArticle } from '@/data/articles'
import { TIPS } from '@/data/tips'
import { RecipeCover } from '@/components/RecipeCover'
import { articleHref } from '@/components/ArticleRow'
import { Card, SectionTitle } from '@/components/ui/misc'
import { dayIndex, firstName } from '@/lib/utils'
import { planStatus, formatDuration } from '@/lib/plan'
import { formatKg, weightProgress } from '@/lib/weight'
import { Target } from 'lucide-react'

const SHORTCUTS = [
  { to: '/receitas', label: 'Receitas', icon: ChefHat },
  { to: '/plano', label: 'Meu Plano', icon: CalendarClock },
  { to: '/ferramentas', label: 'Ferramentas', icon: Wrench },
  { to: '/aprenda', label: 'Aprenda', icon: BookOpen },
]

function ContinueCard() {
  const { profile } = useSession()
  const lv = profile.lastViewed
  const recipe = lv?.kind === 'recipe' ? getRecipe(lv.slug) : undefined
  const article = lv?.kind === 'article' ? getArticle(lv.slug) : undefined
  const fallback = ARTICLES[0]

  const item = recipe
    ? { to: `/receitas/${recipe.slug}`, eyebrow: 'Receita', title: recipe.title, meta: `${recipe.minutes} min` }
    : article
      ? { to: articleHref(article), eyebrow: 'Conteúdo', title: article.title, meta: `${article.minutes} min de leitura` }
      : { to: articleHref(fallback), eyebrow: 'Comece por aqui', title: fallback.title, meta: `${fallback.minutes} min de leitura` }

  return (
    <Link
      to={item.to}
      className="group flex items-center gap-4 rounded-2xl bg-brand p-5 text-white transition-colors hover:bg-[#21402F]"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
        <PlayCircle className="size-6 text-gold" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-white/60">
          {lv ? 'Continue de onde parou' : item.eyebrow}
        </p>
        <p className="mt-0.5 truncate text-[17px] font-semibold">{item.title}</p>
        <p className="text-sm text-white/70">{lv ? `${item.eyebrow} · ${item.meta}` : item.meta}</p>
      </div>
      <ArrowRight className="size-5 shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function PlanPill() {
  const { profile } = useSession()
  if (!profile.plan) {
    return (
      <Link to="/plano" className="flex items-center gap-3 rounded-2xl border border-dashed border-brand-600/30 bg-surface p-4 hover:bg-brand-50/50">
        <CalendarClock className="size-5 text-brand-600" />
        <span className="flex-1 text-sm text-ink">
          <strong className="font-semibold">Organize seus horários</strong>
          <span className="text-ink-muted"> — leva 1 minuto.</span>
        </span>
        <ArrowRight className="size-4 text-ink-subtle" />
      </Link>
    )
  }
  const s = planStatus(profile.plan)
  return (
    <Link to="/plano" className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-brand-50/50">
      <span className={`size-2.5 rounded-full ${s.eating ? 'bg-brand-600' : 'bg-gold'}`} />
      <span className="flex-1 text-sm text-ink">
        <strong className="font-semibold">{s.eating ? 'Período de alimentação' : 'Período sem alimentação'}</strong>
        <span className="text-ink-muted">
          {' '}
          · {s.eating ? 'termina' : 'próxima refeição'} em {formatDuration(s.minutesToChange)}
        </span>
      </span>
      <ArrowRight className="size-4 text-ink-subtle" />
    </Link>
  )
}

function WeightPill() {
  const { profile } = useSession()
  const w = profile.weight
  if (!w) return null
  const p = weightProgress(w)
  return (
    <Link to="/plano" className="-mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-brand-50/50">
      <Target className="size-5 text-brand-600" />
      <span className="flex-1 text-sm text-ink">
        <strong className="font-semibold">Minha meta</strong>
        <span className="text-ink-muted"> · {p.reached ? 'alcançada' : p.direction === 'manter' ? 'manter o peso' : `faltam ${formatKg(p.remaining)}`}</span>
      </span>
      <ArrowRight className="size-4 text-ink-subtle" />
    </Link>
  )
}

export default function Home() {
  const { profile } = useSession()
  const recipe = RECIPES[dayIndex(RECIPES.length)]
  const readable = ARTICLES.filter((a) => !a.interactive)
  const today = readable[dayIndex(readable.length)]
  const tip = TIPS[dayIndex(TIPS.length)]
  const name = firstName(profile.name)

  return (
    <div className="animate-fade-in">
      <header className="mb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink lg:text-[32px]">Olá{name ? `, ${name}` : ''}</h1>
        <p className="mt-1 text-[15px] text-ink-muted">Vamos cuidar da sua rotina hoje.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="space-y-7">
          <ContinueCard />
          <PlanPill />
          <WeightPill />

          <section>
            <SectionTitle>Para hoje</SectionTitle>
            <Link to={articleHref(today)} className="block">
              <Card className="flex items-center gap-4 p-4 transition-colors hover:bg-brand-50/50">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <BookOpen className="size-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-muted">Leia</p>
                  <p className="font-semibold leading-snug text-ink">{today.title}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-muted">{today.minutes} min</span>
              </Card>
            </Link>
          </section>

          <section>
            <SectionTitle
              action={
                <Link to="/receitas" className="text-sm font-medium text-brand-600 hover:text-brand">
                  Ver todas
                </Link>
              }
            >
              Receita do dia
            </SectionTitle>
            <Link to={`/receitas/${recipe.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-surface hover:shadow-soft">
              <div className="aspect-[16/8] sm:aspect-[16/6]">
                <RecipeCover recipe={recipe} size="lg" />
              </div>
              <div className="flex items-end justify-between gap-4 p-4">
                <div>
                  <p className="text-xs font-medium text-brand-600">{CATEGORY_LABEL[recipe.category]}</p>
                  <p className="mt-0.5 text-lg font-semibold leading-snug text-ink">{recipe.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{recipe.description}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm text-ink-muted">
                  <Clock className="size-4" /> {recipe.minutes} min
                </span>
              </div>
            </Link>
          </section>
        </div>

        <aside className="space-y-7">
          <section>
            <SectionTitle>Atalhos</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {SHORTCUTS.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-brand-50/50"
                >
                  <s.icon className="size-5 text-brand-600" strokeWidth={1.75} />
                  <span className="text-[15px] font-medium text-ink">{s.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-gold-50 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7442]">
              <Lightbulb className="size-4" /> Dica do dia
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{tip}</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
