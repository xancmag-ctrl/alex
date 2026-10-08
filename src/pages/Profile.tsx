import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, KeyRound, LogOut, FileText, Lock, LifeBuoy, UserRound, ShieldCheck, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, SectionTitle } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Field, Input } from '@/components/ui/input'
import { PasswordInput } from './auth/PasswordInput'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { friendlyError } from '@/lib/errors'
import { SUPPORT_CONTACT } from '@/lib/backend'

function Row({ icon: Icon, label, onClick, to, href, danger, trailing }: {
  icon: LucideIcon
  label: string
  onClick?: () => void
  to?: string
  href?: string
  danger?: boolean
  trailing?: ReactNode
}) {
  const cls = `flex min-h-14 w-full items-center gap-3.5 px-4 text-left transition-colors hover:bg-brand-50/60 ${danger ? 'text-danger' : 'text-ink'}`
  const inner = (
    <>
      <Icon className={`size-[18px] shrink-0 ${danger ? '' : 'text-brand-600'}`} strokeWidth={1.8} />
      <span className="flex-1 text-[15px] font-medium">{label}</span>
      {trailing ?? (!danger && <ChevronRight className="size-4 text-ink-subtle" />)}
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  return <button onClick={onClick} className={cls}>{inner}</button>
}

function supportHref(contact: string) {
  if (!contact) return undefined
  if (/^https?:\/\//.test(contact)) return contact
  if (contact.includes('@')) return `mailto:${contact}`
  return undefined
}

export default function Profile() {
  const { profile, backend, updateProfile, signOut } = useSession()
  const navigate = useNavigate()
  const toast = useToast()
  const [dialog, setDialog] = useState<'name' | 'password' | 'support' | null>(null)
  const [name, setName] = useState(profile.name)
  const [pwd, setPwd] = useState({ password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const close = () => {
    setDialog(null)
    setError(null)
  }

  async function saveName(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Digite seu nome.')
    setSaving(true)
    try {
      await updateProfile({ name: name.trim() })
      toast.show('Nome atualizado')
      close()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault()
    if (pwd.password.length < 6) return setError('Use pelo menos 6 caracteres.')
    if (pwd.password !== pwd.confirm) return setError('As senhas não coincidem.')
    setSaving(true)
    try {
      await backend.updatePassword(pwd.password)
      toast.show('Senha alterada')
      setPwd({ password: '', confirm: '' })
      close()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    setLeaving(true)
    await signOut()
    navigate('/entrar', { replace: true })
  }

  const support = supportHref(SUPPORT_CONTACT)

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader title="Perfil" />

      <Card className="mb-6 flex items-center gap-4 p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-semibold text-white">
          {(profile.name.trim()[0] ?? 'U').toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-ink">{profile.name || 'Sem nome'}</p>
          <p className="truncate text-sm text-ink-muted">{profile.email}</p>
        </div>
      </Card>

      <SectionTitle>Configurações</SectionTitle>
      <Card className="mb-6 divide-y divide-line overflow-hidden">
        <Row icon={UserRound} label="Alterar nome" onClick={() => { setName(profile.name); setDialog('name') }} />
        <Row icon={KeyRound} label="Alterar senha" onClick={() => setDialog('password')} />
      </Card>

      <SectionTitle>Ajuda e informações</SectionTitle>
      <Card className="mb-6 divide-y divide-line overflow-hidden">
        <Row icon={LifeBuoy} label="Suporte" href={support} onClick={support ? undefined : () => setDialog('support')} />
        <Row icon={ShieldCheck} label="Central de Segurança" to="/aprenda/categoria/seguranca" />
        <Row icon={FileText} label="Termos de uso" to="/termos" />
        <Row icon={Lock} label="Política de privacidade" to="/privacidade" />
      </Card>

      <Card className="overflow-hidden">
        <Row icon={LogOut} label={leaving ? 'Saindo…' : 'Sair da conta'} onClick={logout} danger />
      </Card>

      <p className="mt-8 text-center text-xs leading-relaxed text-ink-subtle">
        Conteúdo educativo. Não substitui avaliação ou acompanhamento de profissionais de saúde.
        {backend.mode === 'demo' && <><br />Modo demonstração — dados salvos apenas neste navegador.</>}
      </p>

      <Dialog open={dialog === 'name'} onClose={close} title="Alterar nome">
        <form onSubmit={saveName} className="space-y-4">
          <Field id="new-name" label="Nome" error={error ?? undefined}>
            <Input id="new-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Button type="submit" className="w-full" loading={saving}>Salvar</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === 'password'} onClose={close} title="Alterar senha">
        <form onSubmit={savePassword} className="space-y-4">
          <Field id="new-password" label="Nova senha">
            <PasswordInput id="new-password" autoComplete="new-password" value={pwd.password} onChange={(e) => setPwd({ ...pwd, password: e.target.value })} />
          </Field>
          <Field id="confirm-password" label="Confirmar nova senha">
            <PasswordInput id="confirm-password" autoComplete="new-password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
          </Field>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" loading={saving}>Salvar nova senha</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === 'support'} onClose={close} title="Suporte">
        <p className="text-[15px] leading-relaxed text-ink-muted">
          Para dúvidas sobre acesso ou sua compra, use o canal de suporte informado na área de membros onde você adquiriu o
          produto.
        </p>
        <Button className="mt-5 w-full" variant="outline" onClick={close}>Entendi</Button>
      </Dialog>
    </div>
  )
}
