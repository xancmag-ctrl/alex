import type { Recipe } from '@/data/recipes'
import { cn } from '@/lib/utils'

const TONES: Record<Recipe['tone'], { bg: string; fg: string; dot: string }> = {
  sage: { bg: '#E3ECE2', fg: '#3E6150', dot: '#CBDCCB' },
  oat: { bg: '#F1EBDD', fg: '#7A6438', dot: '#E5DAC2' },
  clay: { bg: '#F2E4DC', fg: '#8A5A44', dot: '#E7D0C3' },
  mist: { bg: '#E3E9EC', fg: '#4A6470', dot: '#CDD8DD' },
}

/** Capa da receita: usa a foto quando existir; caso contrário, uma ilustração leve e consistente. */
export function RecipeCover({ recipe, className, size = 'md' }: { recipe: Recipe; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  if (recipe.image) {
    return (
      <img
        src={recipe.image}
        alt={recipe.title}
        loading="lazy"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }
  const t = TONES[recipe.tone]
  const Icon = recipe.icon
  const iconSize = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-20' : 'size-11'
  return (
    <div
      role="img"
      aria-label={recipe.title}
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
      style={{ backgroundColor: t.bg }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 120">
        <circle cx="170" cy="18" r="46" fill={t.dot} opacity="0.7" />
        <circle cx="22" cy="112" r="34" fill={t.dot} opacity="0.55" />
      </svg>
      <Icon className={cn('relative', iconSize)} style={{ color: t.fg }} strokeWidth={1.25} />
    </div>
  )
}
