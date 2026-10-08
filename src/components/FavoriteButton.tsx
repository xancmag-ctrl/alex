import { Heart } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import type { FavoriteKind } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FavoriteButton({
  kind,
  slug,
  className,
  withLabel,
}: {
  kind: FavoriteKind
  slug: string
  className?: string
  withLabel?: boolean
}) {
  const { isFavorite, toggleFavorite } = useApp()
  const on = isFavorite(kind, slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void toggleFavorite(kind, slug)
      }}
      aria-pressed={on}
      aria-label={on ? 'Remover dos favoritos' : 'Favoritar'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        withLabel
          ? cn('h-12 border px-5 text-[15px] font-medium', on ? 'border-brand bg-brand-50 text-brand' : 'border-line bg-surface text-ink hover:bg-brand-50')
          : 'size-10 bg-surface/90 text-ink backdrop-blur hover:bg-surface',
        className,
      )}
    >
      <Heart className={cn('size-[18px] transition-transform', on && 'scale-110 fill-gold text-gold')} />
      {withLabel && (on ? 'Favoritado' : 'Favoritar')}
    </button>
  )
}
