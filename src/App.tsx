import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { ToastProvider } from '@/components/ui/toast'
import { AppShell } from '@/components/layout/AppShell'
import { LogoMark } from '@/components/layout/Logo'
import { Spinner } from '@/components/ui/misc'
import Home from '@/pages/Home'

// Telas carregadas sob demanda: o primeiro carregamento fica leve.
const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Plan = lazy(() => import('@/pages/Plan'))
const Recipes = lazy(() => import('@/pages/Recipes'))
const RecipeDetail = lazy(() => import('@/pages/RecipeDetail'))
const Tools = lazy(() => import('@/pages/Tools'))
const Learn = lazy(() => import('@/pages/Learn'))
const LearnCategory = lazy(() => import('@/pages/Learn').then((m) => ({ default: m.LearnCategory })))
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'))
const MythsGame = lazy(() => import('@/pages/MythsGame'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const Profile = lazy(() => import('@/pages/Profile'))
const Terms = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Terms })))
const Privacy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Privacy })))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg" role="status" aria-label="Carregando">
      <LogoMark className="size-12 animate-pulse" />
    </div>
  )
}

/** Exige login. Também envia quem ainda não viu a introdução para o onboarding. */
function RequireAuth({ children }: { children?: ReactNode }) {
  const { ready, user, profile, recovering } = useApp()
  const location = useLocation()
  if (!ready) return <Splash />
  if (!user || !profile) return <Navigate to="/entrar" replace state={{ from: location.pathname + location.search }} />
  if (recovering) return <Navigate to="/redefinir-senha" replace />
  if (!profile.onboarded && location.pathname !== '/boas-vindas') return <Navigate to="/boas-vindas" replace />
  return children ? <>{children}</> : <Outlet />
}

/** Telas de login/cadastro: quem já está logado vai direto para o app. */
function GuestOnly() {
  const { ready, user } = useApp()
  if (!ready) return <Splash />
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}

function PublicPage() {
  return (
    <div className="min-h-dvh bg-bg px-4 py-6 sm:px-6 lg:py-12">
      <Outlet />
    </div>
  )
}

function PageSuspense() {
  return (
    <Suspense fallback={<Spinner className="py-24" />}>
      <Outlet />
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AppProvider>
          <Suspense fallback={<Splash />}>
            <Routes>
              <Route element={<GuestOnly />}>
                <Route path="/entrar" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/esqueci-senha" element={<ForgotPassword />} />
              </Route>
              <Route path="/redefinir-senha" element={<ResetPassword />} />
              <Route element={<PublicPage />}>
                <Route path="/termos" element={<Terms />} />
                <Route path="/privacidade" element={<Privacy />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="/boas-vindas" element={<Onboarding />} />
                <Route element={<AppShell />}>
                  <Route element={<PageSuspense />}>
                    <Route index element={<Home />} />
                    <Route path="plano" element={<Plan />} />
                    <Route path="receitas" element={<Recipes />} />
                    <Route path="receitas/:slug" element={<RecipeDetail />} />
                    <Route path="ferramentas" element={<Tools />} />
                    <Route path="aprenda" element={<Learn />} />
                    <Route path="aprenda/mitos-e-verdades" element={<MythsGame />} />
                    <Route path="aprenda/categoria/:id" element={<LearnCategory />} />
                    <Route path="aprenda/:slug" element={<ArticleDetail />} />
                    <Route path="favoritos" element={<Favorites />} />
                    <Route path="perfil" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
