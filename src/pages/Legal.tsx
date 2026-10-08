import { PageHeader } from '@/components/layout/PageHeader'
import { APP_NAME } from '@/components/layout/Logo'
import { SAFETY_DISCLAIMER } from '@/data/articles'

const TERMS = [
  {
    h: 'Sobre o aplicativo',
    p: `O ${APP_NAME} é um aplicativo de conteúdo educativo sobre jejum intermitente, organização de rotina e alimentação. ${SAFETY_DISCLAIMER}`,
  },
  {
    h: 'Não é orientação médica',
    p: 'Nenhuma informação do aplicativo constitui diagnóstico, prescrição ou tratamento. O jejum intermitente não é adequado para todas as pessoas. Antes de mudar sua alimentação, especialmente se você tem alguma condição de saúde, usa medicamentos, está gestante ou amamentando, ou tem histórico de transtornos alimentares, procure um profissional de saúde.',
  },
  {
    h: 'Resultados',
    p: 'Não prometemos resultados específicos, como perda de peso. Cada pessoa é diferente.',
  },
  {
    h: 'Conta e acesso',
    p: 'O acesso é pessoal e intransferível. Você é responsável por manter sua senha em segurança.',
  },
  {
    h: 'Receitas',
    p: 'Confira sempre os rótulos dos ingredientes quanto a alergênicos. Adapte as receitas às suas necessidades e restrições.',
  },
]

const PRIVACY = [
  {
    h: 'Dados que coletamos',
    p: 'Nome, e-mail e senha (armazenada de forma criptografada pelo provedor de autenticação), além dos dados que você mesmo registra: horários do plano, checklist, lista de compras, diário e favoritos.',
  },
  {
    h: 'Para que usamos',
    p: 'Apenas para permitir o funcionamento do aplicativo e mostrar seus próprios dados para você. Não vendemos seus dados.',
  },
  {
    h: 'Quem pode ver',
    p: 'Seus registros são privados: o banco de dados é configurado para que cada usuário acesse apenas as próprias informações.',
  },
  {
    h: 'Seus direitos',
    p: 'Você pode solicitar a correção ou exclusão da sua conta e dos seus dados pelo canal de suporte.',
  },
]

export function Terms() {
  return <LegalPage title="Termos de uso" items={TERMS} />
}
export function Privacy() {
  return <LegalPage title="Política de privacidade" items={PRIVACY} />
}

function LegalPage({ title, items }: { title: string; items: { h: string; p: string }[] }) {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader back title={title} />
      <div className="space-y-6">
        {items.map((i) => (
          <section key={i.h}>
            <h2 className="font-semibold text-ink">{i.h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{i.p}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
