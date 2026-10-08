import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout, FormError } from './AuthLayout'
import { PasswordInput } from './PasswordInput'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { useApp } from '@/contexts/AppContext'
import { friendlyError } from '@/lib/errors'

export default function Login() {
  const { backend } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!backend) return
    setError(null)
    if (!email.trim() || !password) return setError('Preencha e-mail e senha.')
    setLoading(true)
    try {
      await backend.signIn(email.trim(), password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== '/entrar' ? from : '/', { replace: true })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre para acessar suas receitas, ferramentas e conteúdos.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <FormError message={error} />
        <Field id="email" label="E-mail">
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field
          id="password"
          label="Senha"
          hint={
            <Link to="/esqueci-senha" className="text-sm font-medium text-brand-600 hover:text-brand">
              Esqueci minha senha
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-ink-muted">
        Primeiro acesso?{' '}
        <Link to="/cadastro" className="font-semibold text-brand hover:underline">
          Crie sua conta
        </Link>
      </p>
    </AuthLayout>
  )
}
