// Teste ponta a ponta (modo demonstração) + screenshots para revisão visual.
// Uso: npm run build && npm run test:e2e
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'

const PORT = 4179
const BASE = `http://localhost:${PORT}`
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const server = spawn('node_modules/.bin/vite', ['preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' })
await new Promise((resolve, reject) => {
  server.stdout.on('data', (d) => d.toString().includes(String(PORT)) && resolve())
  server.on('exit', reject)
  setTimeout(() => reject(new Error('preview não iniciou')), 20000)
})

const executablePath = process.env.CHROMIUM_PATH || undefined
const browser = await chromium.launch(executablePath ? { executablePath } : {})
let failures = 0
const step = async (name, fn) => {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failures++
    console.log(`  ✗ ${name}\n    ${e.message.split('\n')[0]}`)
  }
}

async function run(label, viewport) {
  console.log(`\n${label} (${viewport.width}x${viewport.height})`)
  const ctx = await browser.newContext({ viewport, locale: 'pt-BR', deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.setDefaultTimeout(8000)
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  const shot = (n) => page.screenshot({ path: `${OUT}/${label}-${n}.png`, fullPage: true })
  const email = `teste-${label}@email.com`

  await step('rota protegida redireciona para login', async () => {
    await page.goto(BASE + '/receitas')
    await page.getByRole('heading', { name: 'Bem-vindo de volta' }).waitFor()
    await shot('01-login')
  })

  await step('cadastro com erros de validação', async () => {
    await page.getByRole('link', { name: 'Crie sua conta' }).click()
    await page.getByRole('button', { name: 'Criar minha conta' }).click()
    await page.getByText('Digite seu nome.').waitFor()
    await shot('02-cadastro-erros')
  })

  await step('cadastro entra automaticamente e abre onboarding', async () => {
    await page.getByLabel('Nome').fill('Marina Alves')
    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha', { exact: true }).fill('segredo1')
    await page.getByLabel('Confirmar senha').fill('segredo1')
    await page.getByRole('button', { name: 'Criar minha conta' }).click()
    await page.getByText('Bem-vindo ao Jejum Inteligente, Marina').waitFor()
    await shot('03-onboarding-1')
    await page.getByRole('button', { name: 'Continuar' }).click()
    await page.getByRole('button', { name: 'Continuar' }).click()
    await page.getByRole('heading', { name: 'Vamos começar?' }).waitFor()
    await shot('04-onboarding-3')
    await page.getByRole('button', { name: 'Começar' }).click()
    await page.getByRole('heading', { name: 'Olá, Marina' }).waitFor()
    await shot('05-inicio')
  })

  await step('meu plano: salvar horários', async () => {
    await page.goto(BASE + '/plano')
    await page.getByRole('button', { name: /16:8/ }).click()
    await page.getByRole('button', { name: 'Salvar horários' }).click()
    await page.getByRole('button', { name: 'Editar' }).waitFor()
    await page.getByText('Próxima refeição').waitFor()
    await shot('06-plano')
  })

  await step('meta de peso: definir, atualizar e ver no início', async () => {
    await page.getByRole('button', { name: 'Definir meta' }).click()
    await page.getByRole('button', { name: 'Salvar meta' }).click()
    await page.getByText('Digite um peso válido.').first().waitFor()
    await page.getByLabel('Peso atual (kg)').fill('80')
    await page.getByLabel('Meta (kg)').fill('74,5')
    await page.getByRole('button', { name: 'Salvar meta' }).click()
    await page.getByText('Faltam').waitFor()
    await page.getByRole('button', { name: 'Atualizar peso' }).click()
    await page.getByLabel('Peso de hoje (kg)').fill('78')
    await page.getByRole('button', { name: 'Salvar', exact: true }).click()
    await page.getByText('3,5 kg').waitFor()
    await shot('06b-meta')
    await page.goto(BASE + '/')
    await page.getByText(/faltam 3,5 kg/).waitFor()
  })

  await step('receitas: busca, categoria e estado vazio', async () => {
    await page.goto(BASE + '/receitas')
    await shot('07-receitas')
    await page.getByRole('button', { name: 'Jantar' }).click()
    await page.getByText(/receitas?$/).first().waitFor()
    await page.getByLabel('Buscar receitas').fill('zzzz')
    await page.getByText('Nenhuma receita encontrada').waitFor()
    await shot('08-receitas-vazio')
    await page.getByRole('button', { name: 'Limpar filtros' }).click()
    await page.getByLabel('Buscar receitas').fill('omelete')
  })

  await step('receita: favoritar e adicionar à lista', async () => {
    await page.getByRole('link', { name: /Omelete de espinafre/ }).click()
    await page.getByRole('heading', { name: 'Omelete de espinafre e queijo' }).waitFor()
    await page.getByRole('heading', { name: 'Informação nutricional' }).waitFor()
    await page.getByText('269', { exact: true }).waitFor()
    await page.getByRole('button', { name: 'Favoritar' }).last().click()
    await page.getByText('Salvo nos favoritos').waitFor()
    await page.getByRole('button', { name: 'Adicionar à lista de compras' }).click()
    await page.getByText('Adicionado à lista').waitFor()
    await shot('09-receita')
  })

  await step('lista de compras: manual, marcar e remover', async () => {
    await page.goto(BASE + '/ferramentas?t=compras')
    await page.getByText('2 ovos').waitFor()
    await page.getByLabel('Novo item').fill('Bananas')
    await page.getByRole('button', { name: 'Adicionar item' }).click()
    await page.getByText('Bananas').waitFor()
    await page.getByRole('checkbox', { name: /2 ovos/ }).click()
    await page.getByRole('button', { name: 'Limpar marcados' }).click()
    await page.getByText('2 ovos').waitFor({ state: 'detached' })
    await shot('10-compras')
  })

  await step('checklist diário', async () => {
    await page.goto(BASE + '/ferramentas')
    await page.getByRole('checkbox', { name: 'Bebi água' }).click()
    await page.getByText('1 de 4').waitFor()
    await shot('11-checklist')
  })

  await step('temporizador inicia e persiste', async () => {
    await page.goto(BASE + '/ferramentas?t=timer')
    await page.getByRole('button', { name: '14h' }).click()
    await page.getByRole('button', { name: 'Iniciar' }).click()
    await page.getByText('Decorrido').waitFor()
    await page.reload()
    await page.getByText('Decorrido').waitFor()
    await shot('12-timer')
    await page.getByRole('button', { name: 'Parar temporizador' }).click()
  })

  await step('diário: validação e registro', async () => {
    await page.goto(BASE + '/ferramentas?t=diario')
    await page.getByText('Nenhum registro ainda').waitFor()
    await page.getByRole('button', { name: 'Salvar registro' }).click()
    await page.getByText('Descreva a refeição.').waitFor()
    await page.getByLabel('Refeição').fill('Salada com atum')
    await page.getByRole('button', { name: /^3/ }).click()
    await page.getByRole('button', { name: 'Satisfeito(a)' }).click()
    await page.getByRole('button', { name: 'Salvar registro' }).click()
    await page.getByText('Fome 3/5 · Moderada').waitFor()
    await shot('13-diario')
  })

  await step('aprenda, conteúdo e favorito', async () => {
    await page.goto(BASE + '/aprenda')
    await shot('14-aprenda')
    await page.getByRole('link', { name: /Como funciona/ }).click()
    await page.getByRole('heading', { name: 'Como funciona', level: 1 }).waitFor()
    await page.getByRole('button', { name: 'Favoritar' }).click()
    await page.getByText('Salvo nos favoritos').waitFor()
    await shot('15-conteudo')
  })

  await step('central de segurança', async () => {
    await page.goto(BASE + '/aprenda/categoria/seguranca')
    await page.getByText('não é adequado para todas as pessoas').first().waitFor()
    await shot('16-seguranca')
  })

  await step('mitos e verdades', async () => {
    await page.goto(BASE + '/aprenda/mitos-e-verdades')
    await page.getByRole('button', { name: 'mito' }).click()
    await page.getByText('Você acertou!').waitFor()
    await shot('17-mitos')
    await page.getByRole('button', { name: /Próxima/ }).click()
    await page.getByText('2/15').waitFor()
  })

  await step('favoritos com duas categorias', async () => {
    await page.goto(BASE + '/favoritos')
    await page.getByRole('link', { name: /Omelete de espinafre/ }).waitFor()
    await shot('18-favoritos')
    await page.getByRole('tab', { name: /Conteúdos/ }).click()
    await page.getByRole('link', { name: /Como funciona/ }).waitFor()
  })

  await step('início mostra "continue de onde parou"', async () => {
    await page.goto(BASE + '/')
    await page.getByText('Continue de onde parou').waitFor()
  })

  await step('perfil: alterar senha e sair', async () => {
    await page.goto(BASE + '/perfil')
    await shot('19-perfil')
    await page.getByRole('button', { name: 'Alterar senha' }).click()
    await page.getByLabel('Nova senha', { exact: true }).fill('novasenha')
    await page.getByLabel('Confirmar nova senha').fill('novasenha')
    await page.getByRole('button', { name: 'Salvar nova senha' }).click()
    await page.getByText('Senha alterada').waitFor()
    await page.getByRole('button', { name: 'Sair da conta' }).click()
    await page.getByRole('heading', { name: 'Bem-vindo de volta' }).waitFor()
  })

  await step('login com nova senha mantém dados', async () => {
    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha', { exact: true }).fill('segredo1')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.getByText('E-mail ou senha incorretos.').waitFor()
    await page.getByLabel('Senha', { exact: true }).fill('novasenha')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.getByRole('heading', { name: 'Olá, Marina' }).waitFor()
    await page.goto(BASE + '/favoritos')
    await page.getByRole('link', { name: /Omelete de espinafre/ }).waitFor()
  })

  await step('recuperação de senha', async () => {
    await page.getByRole('link', { name: 'Perfil' }).first().click()
    await page.getByRole('button', { name: 'Sair da conta' }).click()
    await page.getByRole('link', { name: 'Esqueci minha senha' }).click()
    await page.getByRole('button', { name: 'Enviar link' }).click()
    await page.getByText('Digite um e-mail válido.').waitFor()
    await page.getByLabel('E-mail').fill(email)
    await page.getByRole('button', { name: 'Enviar link' }).click()
    await page.getByText('Verifique seu e-mail').waitFor()
    await shot('20-recuperar-senha')
  })

  await step('página inexistente', async () => {
    await page.goto(BASE + '/entrar')
    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha', { exact: true }).fill('novasenha')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.getByRole('heading', { name: 'Olá, Marina' }).waitFor()
    await page.goto(BASE + '/nao-existe')
    await page.getByText('Página não encontrada').waitFor()
  })

  await step('sem rolagem horizontal', async () => {
    for (const p of ['/', '/receitas', '/plano', '/ferramentas', '/aprenda', '/perfil']) {
      await page.goto(BASE + p)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      if (overflow > 1) throw new Error(`${p} tem ${overflow}px de rolagem horizontal`)
    }
  })

  if (errors.length) {
    failures++
    console.log('  ✗ erros no console:\n    ' + errors.join('\n    '))
  }
  await ctx.close()
}

try {
  await run('mobile', { width: 390, height: 844 })
  await run('desktop', { width: 1440, height: 900 })
} finally {
  await browser.close()
  server.kill()
}
console.log(failures ? `\n${failures} falha(s)` : '\nTudo certo ✓')
process.exit(failures ? 1 : 0)
