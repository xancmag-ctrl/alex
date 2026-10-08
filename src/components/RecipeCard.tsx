import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { Recipe } from '@/data/recipes'
import { CATEGORY_LABEL } from '@/data/recipes'
import { RecipeCover } from './RecipeCover'
import { FavoriteButton } from './FavoriteButton'
import { cn } from '@/lib/utils'

export function RecipeCard({ recipe, className }: { recipe: Recipe; className?: string }) {
  return (
    <Link
      to={`/receitas/${recipe.slug}`}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        className,
      )}
    >
      <div className="relative aspect-[16/10]">
        <RecipeCover recipe={recipe} />
        <FavoriteButton kind="recipe" slug={recipe.slug} className="absolute right-2.5 top-2.5" />
      </div>
      <div className="p-3.5">
        <p className="text-xs font-medium text-brand-600">{CATEGORY_LABEL[recipe.category]}</p>
        <h3 className="mt-0.5 line-clamp-2 font-semibold leading-snug text-ink">{recipe.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
          <Clock className="size-3.5" />
          {recipe.minutes} min · {recipe.difficulty}
        </p>
      </div>
    </Link>
  )
}

/** Versão em linha (lista compacta). */
export function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to={`/receitas/${recipe.slug}`}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 pr-4 transition-colors hover:bg-brand-50/50"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-xl">
        <RecipeCover recipe={recipe} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{recipe.title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {CATEGORY_LABEL[recipe.category]} · {recipe.minutes} min
        </p>
      </div>
    </Link>
  )
}
