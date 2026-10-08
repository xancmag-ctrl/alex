import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { validateSignup } from './Signup'

describe('validateSignup', () => {
  it('valida campos obrigatórios e confirmação de senha', () => {
    expect(validateSignup({ name: '', email: 'x', password: '1', confirm: '2' })).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      confirm: expect.any(String),
    })
    expect(validateSignup({ name: 'Ana', email: 'a@a.com', password: '123456', confirm: '123456' })).toEqual({})
  })
})

describe('fluxo de autenticação (modo demonstração)', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('redireciona para o login e mostra erro com credenciais inválidas', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('E-mail'), 'nao@existe.com')
    await userEvent.type(screen.getByLabelText('Senha'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.')
  })

  it('cadastra e entra automaticamente no onboarding', async () => {
    window.history.pushState({}, '', '/cadastro')
    render(<App />)
    await screen.findByRole('heading', { name: 'Crie sua conta' })
    await userEvent.type(screen.getByLabelText('Nome'), 'Marina')
    await userEvent.type(screen.getByLabelText('E-mail'), 'marina@email.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'segredo1')
    await userEvent.type(screen.getByLabelText('Confirmar senha'), 'segredo1')
    await userEvent.click(screen.getByRole('button', { name: 'Criar minha conta' }))
    await waitFor(() => expect(window.location.pathname).toBe('/boas-vindas'))
    expect(await screen.findByText(/Bem-vindo ao Jejum Inteligente, Marina/)).toBeInTheDocument()
  })
})
