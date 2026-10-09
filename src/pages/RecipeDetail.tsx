import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Gauge, Users, ShoppingCart, Check, AlertTriangle, Repeat } from 'lucide-react'
import { getRecipe, CATEGORY_LABEL } from '@/data/recipes'
import { RecipeCover } from '@/components/RecipeCover'
import { NutritionCard } from '@/components/NutritionCard'
import { FavoriteButton } from '@/components/FavoriteButton'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, EmptyState } from '@/components/ui/misc'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RecipeDetail() {
  const { slug = '' } = useParams()
  const recipe = getRecipe(slug)
  const { backend, user, markViewed } = useSession()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [done, setDone] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (recipe) markViewed('recipe', recipe.slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.slug])

  if (!recipe) {
    return (
      <EmptyState
        icon={ChefHat}
        title="Receita não encontrada"
        text="Ela pode ter sido removida ou o link está incorreto."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/receitas">Ver receitas</Link>
          </Button>
        }
      />
    )
  }

  async function addToList() {
    if (!recipe) return
    setAdding(true)
    try {
      await backend.addShopping(user.id, recipe.ingredients, recipe.slug)
      setAdded(true)
      toast.show(`${recipe.ingredients.length} itens adicionados à lista`)
    } catch {
      toast.show('Não foi possível adicionar. Tente novamente.', 'error')
    } finally {
      setAdding(false)
    }
  }

  const toggleStep = (i: number) =>
    setDone((s) => {
      const n = new Set(s)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  return (
    <article className="animate-fade-in">
      <PageHeader title="" back="/receitas" />
      <div className="-mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[16/8]">
            <RecipeCover recipe={recipe} size="lg" />
          </div>
          <p className="mt-5 text-sm font-medium text-brand-600">{CATEGORY_LABEL[recipe.category]}</p>
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-ink lg:text-3xl">{recipe.title}</h1>
          <p className="mt-2 text-[15px] text-ink-muted">{recipe.description}</p>

          <div className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface py-3 text-center">
            {[
              { icon: Clock, label: 'Tempo', value: `${recipe.minutes} min` },
              { icon: Gauge, label: 'Dificuldade', value: recipe.difficulty },
              { icon: Users, label: 'Rende', value: recipe.servings.replace(/\s*\(.*\)/, '') },
            ].map((m) => (
              <div key={m.label} className="px-2">
                <m.icon className="mx-auto size-[18px] text-brand-600" strokeWidth={1.75} />
                <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-subtle">{m.label}</p>
                <p className="text-sm font-semibold text-ink">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <FavoriteButton kind="recipe" slug={recipe.slug} withLabel className="flex-1 sm:flex-none" />
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink">Modo de preparo</h2>
            <p className="mt-1 text-sm text-ink-muted">Toque em um passo para marcar como feito.</p>
            <ol className="mt-4 space-y-3">
              {recipe.steps.map((s, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleStep(i)}
                    className={cn(
                      'flex w-full gap-3.5 rounded-xl p-3 text-left transition-colors hover:bg-brand-50/60',
                      done.has(i) && 'opacity-55',
                    )}
                    aria-pressed={done.has(i)}
                  >
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                        done.has(i) ? 'bg-brand text-white' : 'bg-brand-100 text-brand',
                      )}
                    >
                      {done.has(i) ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span className={cn('pt-0.5 text-[15px] leading-relaxed text-ink', done.has(i) && 'line-through')}>{s}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-4 lg:pt-0">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-ink">Ingredientes</h2>
            <p className="text-sm text-ink-muted">{recipe.servings}</p>
            <ul className="mt-4 space-y-2.5">
              {recipe.ingredients.map((ing) => (
                <li key={ing} className="flex gap-3 text-[15px] text-ink">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {ing}
                </li>
              ))}
            </ul>
            <Button variant={added ? 'secondary' : 'outline'} className="mt-5 w-full" onClick={addToList} loading={adding}>
              {added ? <Check /> : <ShoppingCart />}
              {added ? 'Adicionado à lista' : 'Adicionar à lista de compras'}
            </Button>
            {added && (
              <Link to="/ferramentas?t=compras" className="mt-2 block text-center text-sm font-medium text-brand-600 hover:underline">
                Ver lista de compras
              </Link>
            )}
          </Card>

          <NutritionCard slug={recipe.slug} />

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-semibold text-ink">
              <Repeat className="size-4 text-brand-600" /> Substituições
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {recipe.substitutions.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-semibold text-ink">
              <AlertTriangle className="size-4 text-gold" /> Alergênicos
            </h2>
            {recipe.allergens.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.allergens.map((a) => (
                  <span key={a} className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-[#7A6438]">
                    {a}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Nenhum alergênico principal na receita base.</p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
              Sempre confira os rótulos dos produtos: marcas diferentes podem conter traços de alergênicos.
            </p>
          </Card>
        </aside>
      </div>
    </article>
  )
}
