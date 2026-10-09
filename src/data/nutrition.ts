/**
 * Cálculo ESTIMADO de calorias e macronutrientes das receitas.
 *
 * Cada receita lista seus ingredientes em gramas; os valores por 100 g vêm de
 * médias de tabelas de composição de alimentos de referência. O resultado é uma
 * estimativa: marcas, tamanhos e modo de preparo mudam os números.
 */
import { RECIPES } from './recipes'

export interface Macros {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

/** Valores por 100 g (kcal, proteína g, carboidrato g, gordura g). */
const FOODS = {
  ovo: [143, 12.6, 0.7, 9.5],
  espinafre: [23, 2.9, 3.6, 0.4],
  queijoMinas: [264, 17.4, 3.2, 20.2],
  queijoRalado: [431, 38, 4, 29],
  ricota: [140, 12.6, 3.8, 8.1],
  azeite: [884, 0, 0, 100],
  oleo: [884, 0, 0, 100],
  aveia: [389, 16.9, 66.3, 6.9],
  iogurte: [61, 3.5, 4.7, 3.3],
  leite: [61, 3.2, 4.8, 3.3],
  chia: [486, 16.5, 42.1, 30.7],
  frutasVermelhas: [40, 0.8, 9, 0.3],
  frutasMix: [50, 0.8, 12, 0.3],
  mel: [304, 0.3, 82.4, 0],
  tapioca: [358, 0.2, 88.7, 0],
  tomate: [18, 0.9, 3.9, 0.2],
  banana: [89, 1.1, 22.8, 0.3],
  maca: [52, 0.3, 13.8, 0.2],
  paoIntegral: [247, 13, 41, 3.4],
  tortilhaIntegral: [300, 9, 50, 7],
  abacate: [160, 2, 8.5, 14.7],
  pastaAmendoim: [588, 25, 20, 50],
  frango: [120, 22.5, 0, 2.6],
  frangoCozido: [165, 31, 0, 3.6],
  carneMoida: [150, 21, 0, 7],
  peixeBranco: [96, 20, 0, 1.7],
  atum: [116, 26, 0, 0.8],
  tofu: [144, 15.7, 2.8, 8.7],
  graoDeBico: [164, 8.9, 27.4, 2.6],
  abobrinha: [17, 1.2, 3.1, 0.3],
  cenoura: [41, 0.9, 9.6, 0.2],
  brocolis: [34, 2.8, 6.6, 0.4],
  cebola: [40, 1.1, 9.3, 0.1],
  pimentao: [26, 1, 6, 0.3],
  folhas: [15, 1.4, 2.9, 0.2],
  pepino: [15, 0.7, 3.6, 0.1],
  milho: [86, 3.3, 19, 1.4],
  chuchu: [19, 0.8, 4.5, 0.1],
  batata: [77, 2, 17, 0.1],
  batataDoce: [86, 1.6, 20.1, 0.1],
  abobora: [40, 1.4, 9, 0.1],
  shoyu: [53, 8, 4.9, 0.6],
  gergelim: [573, 17.7, 23.4, 49.7],
  tahine: [595, 17, 21, 54],
  milhoPipoca: [387, 12.9, 77.8, 4.5],
  castanhas: [600, 16, 20, 55],
  cacau: [228, 19.6, 57.9, 13.7],
} satisfies Record<string, [number, number, number, number]>

type Food = keyof typeof FOODS

/** Porções que a receita rende + ingredientes relevantes em gramas (temperos e água têm valor desprezível). */
const RECIPE_FOODS: Record<string, { servings: number; unit?: string; items: [Food, number][] }> = {
  'omelete-espinafre-queijo': { servings: 1, items: [['ovo', 100], ['espinafre', 30], ['queijoMinas', 30], ['azeite', 4.5]] },
  'aveia-de-geladeira-frutas-vermelhas': {
    servings: 1,
    items: [['aveia', 40], ['iogurte', 170], ['chia', 12], ['frutasVermelhas', 70], ['mel', 7]],
  },
  'crepioca-queijo-tomate': { servings: 1, items: [['ovo', 50], ['tapioca', 20], ['queijoMinas', 30], ['tomate', 50]] },
  'panqueca-banana-aveia': { servings: 1, items: [['banana', 100], ['ovo', 50], ['aveia', 20]] },
  'torrada-abacate-ovo': { servings: 1, items: [['paoIntegral', 30], ['abacate', 50], ['ovo', 50]] },
  'mingau-aveia-maca-canela': { servings: 1, items: [['aveia', 30], ['leite', 240], ['maca', 75]] },
  'iogurte-banana-pasta-amendoim': { servings: 1, items: [['iogurte', 170], ['banana', 50], ['pastaAmendoim', 15]] },
  'frango-grelhado-legumes': {
    servings: 2,
    items: [['frango', 300], ['abobrinha', 150], ['cenoura', 70], ['brocolis', 80], ['azeite', 26]],
  },
  'carne-moida-abobrinha': {
    servings: 3,
    items: [['carneMoida', 400], ['abobrinha', 300], ['cebola', 80], ['tomate', 200], ['azeite', 13]],
  },
  'peixe-assado-batata-doce': {
    servings: 2,
    items: [['peixeBranco', 300], ['batataDoce', 250], ['brocolis', 160], ['azeite', 26]],
  },
  'bowl-grao-de-bico': {
    servings: 2,
    items: [['graoDeBico', 165], ['abobrinha', 150], ['pimentao', 100], ['cebola', 50], ['folhas', 60], ['azeite', 26], ['iogurte', 40]],
  },
  'escondidinho-abobora-frango': {
    servings: 4,
    items: [['abobora', 600], ['frangoCozido', 400], ['cebola', 80], ['tomate', 200], ['queijoRalado', 50], ['azeite', 13]],
  },
  'salada-completa-atum-ovo': {
    servings: 1,
    items: [['folhas', 60], ['atum', 120], ['ovo', 50], ['tomate', 60], ['pepino', 50], ['milho', 30], ['azeite', 10]],
  },
  'sopa-legumes-frango': {
    servings: 4,
    items: [['frango', 300], ['cenoura', 120], ['chuchu', 200], ['batata', 150], ['cebola', 80], ['azeite', 5]],
  },
  'frittata-legumes': {
    servings: 3,
    items: [['ovo', 250], ['abobrinha', 200], ['pimentao', 60], ['tomate', 100], ['queijoRalado', 15]],
  },
  'creme-abobora-gengibre': { servings: 3, items: [['abobora', 500], ['cebola', 80], ['azeite', 10]] },
  'tilapia-papelote': {
    servings: 2,
    items: [['peixeBranco', 300], ['tomate', 100], ['cebola', 50], ['pimentao', 60], ['azeite', 13]],
  },
  'wrap-frango-folhas': {
    servings: 1,
    items: [['tortilhaIntegral', 40], ['frangoCozido', 100], ['folhas', 30], ['tomate', 50], ['iogurte', 15]],
  },
  'tofu-salteado-legumes': {
    servings: 2,
    items: [['tofu', 250], ['brocolis', 80], ['cenoura', 70], ['pimentao', 60], ['shoyu', 30], ['gergelim', 9], ['oleo', 13]],
  },
  'abobrinha-recheada': {
    servings: 2,
    items: [['abobrinha', 400], ['carneMoida', 200], ['tomate', 100], ['cebola', 40], ['queijoRalado', 15]],
  },
  'homus-palitos-legumes': {
    servings: 4,
    items: [['graoDeBico', 250], ['tahine', 30], ['azeite', 10], ['cenoura', 150], ['pepino', 150]],
  },
  'ovos-cozidos-temperados': { servings: 2, items: [['ovo', 200], ['azeite', 5]] },
  'muffin-banana-aveia': {
    servings: 6,
    unit: 'unidade',
    items: [['banana', 200], ['ovo', 100], ['aveia', 80], ['oleo', 26]],
  },
  'pipoca-panela-ervas': { servings: 2, items: [['milhoPipoca', 40], ['azeite', 13]] },
  'pasta-ricota-ervas': { servings: 4, items: [['ricota', 200], ['iogurte', 30]] },
  'frutas-castanhas-cacau': { servings: 1, items: [['frutasMix', 150], ['castanhas', 10], ['cacau', 5]] },
}

const round = (n: number) => Math.round(n)

export function recipeNutrition(slug: string): (Macros & { unit: string }) | null {
  const data = RECIPE_FOODS[slug]
  if (!data) return null
  const total = data.items.reduce<Macros>(
    (acc, [food, grams]) => {
      const [kcal, p, c, f] = FOODS[food]
      const k = grams / 100
      return { kcal: acc.kcal + kcal * k, protein: acc.protein + p * k, carbs: acc.carbs + c * k, fat: acc.fat + f * k }
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )
  const s = data.servings
  return {
    kcal: round(total.kcal / s),
    protein: round(total.protein / s),
    carbs: round(total.carbs / s),
    fat: round(total.fat / s),
    unit: data.unit ?? 'porção',
  }
}

/** Slugs sem dados nutricionais (usado nos testes). */
export const missingNutrition = () => RECIPES.filter((r) => !RECIPE_FOODS[r.slug]).map((r) => r.slug)
