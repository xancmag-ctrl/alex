/** Traduz erros comuns (Supabase/rede) para mensagens claras em português. */
export function friendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : typeof err === 'string' ? err : ''
  const msg = raw.toLowerCase()
  if (!raw) return 'Algo deu errado. Tente novamente.'
  if (msg.includes('invalid login credentials') || msg.includes('credenciais'))
    return 'E-mail ou senha incorretos.'
  if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('já cadastrado'))
    return 'Este e-mail já tem uma conta. Tente entrar.'
  if (msg.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.'
  if (msg.includes('password should be at least') || msg.includes('weak password'))
    return 'A senha precisa ter pelo menos 6 caracteres.'
  if (msg.includes('same password') || msg.includes('different from the old'))
    return 'A nova senha precisa ser diferente da atual.'
  if (msg.includes('rate limit') || msg.includes('too many'))
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'
  if (msg.includes('invalid email') || msg.includes('unable to validate email'))
    return 'Digite um e-mail válido.'
  if (msg.includes('failed to fetch') || msg.includes('network'))
    return 'Sem conexão no momento. Verifique sua internet e tente novamente.'
  if (msg.includes('session') && msg.includes('missing'))
    return 'Sua sessão expirou. Entre novamente.'
  // Mensagens já em português (geradas pelo próprio app) passam direto.
  if (/[ãçéêíóú]/i.test(raw)) return raw
  return 'Algo deu errado. Tente novamente.'
}
