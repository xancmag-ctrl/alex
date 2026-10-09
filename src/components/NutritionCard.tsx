import { Flame } from 'lucide-react'
import { recipeNutrition } from '@/data/nutrition'
import { Card } from '@/components/ui/misc'

const MACROS = [
  { key: 'protein', label: 'Proteínas', color: '#294C3A', kcalPerG: 4 },
  { key: 'carbs', label: 'Carboidratos', color: '#C6A76A', kcalPerG: 4 },
  { key: 'fat', label: 'Gorduras', color: '#8FAE96', kcalPerG: 9 },
] as const

export function NutritionCard({ slug }: { slug: string }) {
  const n = recipeNutrition(slug)
  if (!n) return null
  const totalFromMacros = MACROS.reduce((s, m) => s + n[m.key] * m.kcalPerG, 0) || 1
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-ink">Informação nutricional</h2>
        <span className="text-xs text-ink-subtle">por {n.unit}</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-gold-50 text-gold">
          <Flame className="size-5" strokeWidth={1.75} />
        </div>
        <p>
          <span className="text-2xl font-semibold tabular-nums text-ink">{n.kcal}</span>
          <span className="ml-1 text-sm text-ink-muted">kcal</span>
        </p>
      </div>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full" aria-hidden>
        {MACROS.map((m) => (
          <div key={m.key} style={{ width: `${((n[m.key] * m.kcalPerG) / totalFromMacros) * 100}%`, backgroundColor: m.color }} />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {MACROS.map((m) => (
          <div key={m.key}>
            <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-ink">{n[m.key]} g</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
        Valores estimados a partir das quantidades da receita. Marcas, tamanhos e preparo podem alterar os números.
      </p>
    </Card>
  )
}
