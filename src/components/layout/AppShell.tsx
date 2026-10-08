import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Home, CalendarClock, ChefHat, Wrench, BookOpen, Heart, UserRound, type LucideIcon } from 'lucide-react'
import { Logo } from './Logo'
import { useApp } from '@/contexts/AppContext'
import { cn, firstName } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const MAIN: NavItem[] = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/plano', label: 'Meu Plano', icon: CalendarClock },
  { to: '/receitas', label: 'Receitas', icon: ChefHat },
  { to: '/ferramentas', label: 'Ferramentas', icon: Wrench },
  { to: '/aprenda', label: 'Aprenda', icon: BookOpen },
]
const SECONDARY: NavItem[] = [
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

function SideLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors',
          isActive ? 'bg-brand-100/70 text-brand' : 'text-ink-muted hover:bg-brand-50 hover:text-ink',
        )
      }
    >
      <item.icon className="size-[18px]" strokeWidth={1.9} />
      {item.label}
    </NavLink>
  )
}

export function AppShell() {
  const { profile } = useApp()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  const initial = firstName(profile?.name).charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-dvh bg-bg">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface/60 px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 px-2">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {MAIN.map((i) => (
            <SideLink key={i.to} item={i} />
          ))}
        </nav>
        <div className="my-5 h-px bg-line" />
        <nav aria-label="Conta" className="flex flex-col gap-1">
          {SECONDARY.map((i) => (
            <SideLink key={i.to} item={i} />
          ))}
        </nav>
        <p className="mt-auto px-3 text-xs leading-relaxed text-ink-subtle">
          Conteúdo educativo. Não substitui acompanhamento profissional.
        </p>
      </aside>

      {/* Topo — mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line/70 bg-bg/90 px-4 backdrop-blur lg:hidden">
        <Link to="/" aria-label="Início">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <NavLink
            to="/favoritos"
            aria-label="Favoritos"
            className={({ isActive }) =>
              cn('flex size-10 items-center justify-center rounded-full', isActive ? 'text-brand' : 'text-ink-muted')
            }
          >
            <Heart className="size-5" />
          </NavLink>
          <NavLink
            to="/perfil"
            aria-label="Perfil"
            className={({ isActive }) =>
              cn(
                'ml-1 flex size-9 items-center justify-center rounded-full text-sm font-semibold',
                isActive ? 'bg-brand text-white' : 'bg-brand-100 text-brand',
              )
            }
          >
            {initial}
          </NavLink>
        </div>
      </header>

      <main className="pb-[calc(84px+env(safe-area-inset-bottom))] lg:pb-12 lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 pt-5 sm:px-6 lg:px-10 lg:pt-10">
          <Outlet />
        </div>
      </main>

      {/* Navegação inferior — mobile */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {MAIN.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                    isActive ? 'text-brand' : 'text-ink-subtle',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
                        isActive && 'bg-brand-100',
                      )}
                    >
                      <item.icon className="size-[20px]" strokeWidth={isActive ? 2.1 : 1.8} />
                    </span>
                    {item.label === 'Meu Plano' ? 'Plano' : item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
