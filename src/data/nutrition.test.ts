import { recipeNutrition, missingNutrition } from './nutrition'
import { RECIPES } from './recipes'

describe('nutrição das receitas', () => {
  it('todas as receitas têm estimativa', () => {
    expect(missingNutrition()).toEqual([])
  })

  it('valores são coerentes (calorias ≈ 4P + 4C + 9G)', () => {
    for (const r of RECIPES) {
      const n = recipeNutrition(r.slug)!
      expect(n.kcal).toBeGreaterThan(30)
      expect(n.kcal).toBeLessThan(900)
      const fromMacros = n.protein * 4 + n.carbs * 4 + n.fat * 9
      expect(Math.abs(fromMacros - n.kcal) / n.kcal).toBeLessThan(0.2)
    }
  })

  it('calcula a omelete corretamente', () => {
    // 100 g ovo + 30 g espinafre + 30 g queijo minas + 4,5 g azeite
    expect(recipeNutrition('omelete-espinafre-queijo')).toEqual({ kcal: 269, protein: 19, carbs: 3, fat: 20, unit: 'porção' })
  })
})
