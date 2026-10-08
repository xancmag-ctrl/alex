import { createLocalBackend } from './localBackend'
import { friendlyError } from './errors'

describe('backend de demonstração', () => {
  beforeEach(() => localStorage.clear())

  it('cadastra, mantém sessão, sai e entra novamente', async () => {
    const b = createLocalBackend()
    const res = await b.signUp('Ana Souza', 'Ana@Email.com', 'segredo1')
    expect(res.status).toBe('signed_in')
    const u = await b.getUser()
    expect(u?.email).toBe('ana@email.com')
    const p = await b.getProfile(u!)
    expect(p).toMatchObject({ name: 'Ana Souza', onboarded: false, plan: null })

    await b.signOut()
    expect(await b.getUser()).toBeNull()

    await expect(b.signIn('ana@email.com', 'errada')).rejects.toThrow()
    await b.signIn('ana@email.com', 'segredo1')
    expect((await b.getUser())?.id).toBe(u!.id)
  })

  it('impede e-mail duplicado e senha curta', async () => {
    const b = createLocalBackend()
    await b.signUp('A', 'a@a.com', '123456')
    await expect(b.signUp('B', 'a@a.com', '123456')).rejects.toThrow(/already/)
    await expect(b.signUp('C', 'c@c.com', '123')).rejects.toThrow()
  })

  it('isola dados por usuário (favoritos, lista, diário, checklist)', async () => {
    const b = createLocalBackend()
    await b.signUp('A', 'a@a.com', '123456')
    const a = (await b.getUser())!
    await b.setFavorite(a.id, { kind: 'recipe', slug: 'x' }, true)
    await b.setFavorite(a.id, { kind: 'recipe', slug: 'x' }, true)
    expect(await b.listFavorites(a.id)).toHaveLength(1)
    const [item] = await b.addShopping(a.id, ['tomate'])
    await b.updateShopping(a.id, item.id, { checked: true })
    expect((await b.listShopping(a.id))[0].checked).toBe(true)
    await b.addJournal(a.id, { meal: 'Omelete', hunger: 3, feeling: 'Tranquilo(a)', note: '' })
    await b.setChecks(a.id, '2026-10-08', ['agua'])

    await b.signUp('B', 'b@b.com', '123456')
    const bUser = (await b.getUser())!
    expect(await b.listFavorites(bUser.id)).toHaveLength(0)
    expect(await b.listShopping(bUser.id)).toHaveLength(0)
    expect(await b.listJournal(bUser.id)).toHaveLength(0)
    expect(await b.listChecks(bUser.id, '2026-01-01')).toEqual({})

    await b.setFavorite(a.id, { kind: 'recipe', slug: 'x' }, false)
    expect(await b.listFavorites(a.id)).toHaveLength(0)
    await b.removeShopping(a.id, [item.id])
    expect(await b.listShopping(a.id)).toHaveLength(0)
  })

  it('altera senha', async () => {
    const b = createLocalBackend()
    await b.signUp('A', 'a@a.com', '123456')
    await b.updatePassword('novasenha')
    await b.signOut()
    await b.signIn('a@a.com', 'novasenha')
    expect(await b.getUser()).not.toBeNull()
  })
})

describe('friendlyError', () => {
  it('traduz mensagens comuns', () => {
    expect(friendlyError(new Error('Invalid login credentials'))).toBe('E-mail ou senha incorretos.')
    expect(friendlyError(new Error('User already registered'))).toMatch(/já tem uma conta/)
    expect(friendlyError(new Error('Failed to fetch'))).toMatch(/conexão/)
    expect(friendlyError(new Error('xpto'))).toBe('Algo deu errado. Tente novamente.')
  })
})
