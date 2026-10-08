import { filterRecipes } from './recipeFilter'
import { RECIPES } from './recipes'

describe('filterRecipes', () => {
  it('tem entre 20 e 30 receitas com dados completos', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(20)
    expect(RECIPES.length).toBeLessThanOrEqual(30)
    const slugs = new Set(RECIPES.map((r) => r.slug))
    expect(slugs.size).toBe(RECIPES.length)
    for (const r of RECIPES) {
      expect(r.ingredients.length).toBeGreaterThan(0)
      expect(r.steps.length).toBeGreaterThan(0)
      expect(r.substitutions.length).toBeGreaterThan(0)
    }
  })

  it('filtra por categoria e por etiqueta', () => {
    expect(filterRecipes('', 'cafe').every((r) => r.category === 'cafe')).toBe(true)
    expect(filterRecipes('', 'rapida').every((r) => r.tags.includes('rapida'))).toBe(true)
    expect(filterRecipes('', 'todas')).toHaveLength(RECIPES.length)
  })

  it('busca ignorando acentos e maiúsculas, inclusive em ingredientes', () => {
    expect(filterRecipes('ABOBORA', 'todas').length).toBeGreaterThan(0)
    expect(filterRecipes('grão-de-bico', 'almoco').map((r) => r.slug)).toContain('bowl-grao-de-bico')
    expect(filterRecipes('xyz123', 'todas')).toHaveLength(0)
  })
})
