import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { AuthLayout, FormError } from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { useApp } from '@/contexts/AppContext'
import { friendlyError } from '@/lib/errors'

export default function ForgotPassword() {
  const { backend } = useApp()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!backend) return
    setError(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Digite um e-mail válido.')
    setLoading(true)
    try {
      await backend.requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle={sent ? undefined : 'Digite o e-mail da sua conta e enviaremos um link para criar uma nova senha.'}
    >
      {sent ? (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <MailCheck className="mx-auto size-10 text-brand-600" strokeWidth={1.5} />
          <p className="mt-4 font-medium text-ink">Verifique seu e-mail</p>
          <p className="mt-1.5 text-sm text-ink-muted">
            Se existir uma conta com <strong>{email}</strong>, você receberá um link em alguns minutos. Confira também a
            caixa de spam.
          </p>
        </div>
      ) : (
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
          <Button type="submit" className="w-full" loading={loading}>
            Enviar link
          </Button>
        </form>
      )}
      <p className="mt-8 text-center text-[15px]">
        <Link to="/entrar" className="font-semibold text-brand hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthLayout>
  )
}
