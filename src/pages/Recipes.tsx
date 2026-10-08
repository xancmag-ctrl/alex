import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { RecipeCard } from '@/components/RecipeCard'
import { Chip, EmptyState } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { RECIPE_FILTERS } from '@/data/recipes'
import { filterRecipes, type RecipeFilter } from '@/data/recipeFilter'

export default function Recipes() {
  const [params, setParams] = useSearchParams()
  const filter = (params.get('c') as RecipeFilter) || 'todas'
  const [query, setQuery] = useState(params.get('q') ?? '')

  const results = useMemo(() => filterRecipes(query, filter), [query, filter])

  const setFilter = (c: RecipeFilter) => {
    const next = new URLSearchParams(params)
    if (c === 'todas') next.delete('c')
    else next.set('c', c)
    setParams(next, { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Receitas" subtitle="Opções simples e práticas para o seu dia." />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou ingrediente"
          aria-label="Buscar receitas"
          className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-11 text-[16px] placeholder:text-ink-subtle focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-subtle hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {RECIPE_FILTERS.map((f) => (
          <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </Chip>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nenhuma receita encontrada"
          text="Tente outra palavra ou escolha outra categoria."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('')
                setFilter('todas')
              }}
            >
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-ink-muted">
            {results.length} {results.length === 1 ? 'receita' : 'receitas'}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {results.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
