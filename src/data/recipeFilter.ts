import { RECIPES, type Recipe, type RecipeCategory, type RecipeTag } from './recipes'
import { normalize } from '@/lib/utils'

export type RecipeFilter = 'todas' | RecipeCategory | RecipeTag

export function filterRecipes(query: string, filter: RecipeFilter, list: Recipe[] = RECIPES) {
  const q = normalize(query.trim())
  return list.filter((r) => {
    if (filter !== 'todas' && r.category !== filter && !r.tags.includes(filter as RecipeTag)) return false
    if (!q) return true
    return normalize(`${r.title} ${r.description} ${r.ingredients.join(' ')}`).includes(q)
  })
}
