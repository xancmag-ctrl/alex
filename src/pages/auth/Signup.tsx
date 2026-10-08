import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { AuthLayout, FormError } from './AuthLayout'
import { PasswordInput } from './PasswordInput'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { useApp } from '@/contexts/AppContext'
import { friendlyError } from '@/lib/errors'

type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>

export function validateSignup(v: { name: string; email: string; password: string; confirm: string }): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Digite seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Digite um e-mail válido.'
  if (v.password.length < 6) e.password = 'Use pelo menos 6 caracteres.'
  if (v.confirm !== v.password) e.confirm = 'As senhas não coincidem.'
  return e
}

export default function Signup() {
  const { backend } = useApp()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!backend) return
    setError(null)
    const v = validateSignup(values)
    setErrors(v)
    if (Object.keys(v).length) return
    setLoading(true)
    try {
      const res = await backend.signUp(values.name.trim(), values.email.trim(), values.password)
      if (res.status === 'confirm_email') setConfirmSent(true)
      else navigate('/boas-vindas', { replace: true })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  if (confirmSent) {
    return (
      <AuthLayout title="Confirme seu e-mail">
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <MailCheck className="mx-auto size-10 text-brand-600" strokeWidth={1.5} />
          <p className="mt-4 text-[15px] text-ink-muted">
            Enviamos um link para <strong className="text-ink">{values.email}</strong>. Abra o e-mail e toque no link para
            ativar sua conta.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link to="/entrar">Voltar para o login</Link>
        </Button>
      </AuthLayout>
    )
  }

  const aria = (k: keyof Errors) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-error` : undefined })

  return (
    <AuthLayout title="Crie sua conta" subtitle="Leva menos de um minuto. Depois é só aproveitar.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="name" label="Nome" error={errors.name}>
          <Input id="name" autoComplete="given-name" placeholder="Como podemos te chamar?" value={values.name} onChange={set('name')} {...aria('name')} />
        </Field>
        <Field id="email" label="E-mail" error={errors.email}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={values.email}
            onChange={set('email')}
            {...aria('email')}
          />
        </Field>
        <Field id="password" label="Senha" error={errors.password}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" value={values.password} onChange={set('password')} {...aria('password')} />
        </Field>
        <Field id="confirm" label="Confirmar senha" error={errors.confirm}>
          <PasswordInput id="confirm" autoComplete="new-password" placeholder="Repita a senha" value={values.confirm} onChange={set('confirm')} {...aria('confirm')} />
        </Field>
        <Button type="submit" className="!mt-6 w-full" loading={loading}>
          Criar minha conta
        </Button>
      </form>
      <p className="mt-8 text-center text-[15px] text-ink-muted">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-semibold text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
