import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout, FormError } from './AuthLayout'
import { PasswordInput } from './PasswordInput'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/input'
import { useApp } from '@/contexts/AppContext'
import { friendlyError } from '@/lib/errors'
import { useToast } from '@/components/ui/toast'

/** Página aberta pelo link de recuperação enviado por e-mail (Supabase cria a sessão a partir do link). */
export default function ResetPassword() {
  const { backend, user, ready, clearRecovering } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!backend) return
    setError(null)
    if (password.length < 6) return setError('Use pelo menos 6 caracteres.')
    if (password !== confirm) return setError('As senhas não coincidem.')
    setLoading(true)
    try {
      await backend.updatePassword(password)
      clearRecovering()
      toast.show('Senha atualizada')
      navigate('/', { replace: true })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  if (ready && !user) {
    return (
      <AuthLayout title="Link inválido ou expirado" subtitle="Peça um novo link para redefinir sua senha.">
        <Button asChild className="w-full">
          <Link to="/esqueci-senha">Pedir novo link</Link>
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crie uma nova senha" subtitle="Escolha uma senha que você vai lembrar.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <FormError message={error} />
        <Field id="password" label="Nova senha">
          <PasswordInput id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field id="confirm" label="Confirmar nova senha">
          <PasswordInput id="confirm" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>
          Salvar nova senha
        </Button>
      </form>
    </AuthLayout>
  )
}
