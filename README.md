# Jejum Inteligente

Web app (PWA instalável) entregue como produto digital de R$ 27,90 sobre jejum intermitente.
É simples de propósito: receitas, ferramentas práticas e conteúdos curtos, com visual cuidado.

> Conteúdo educativo para adultos. Não substitui avaliação ou acompanhamento de profissionais de saúde.

---

## O que tem no app

| Área | O que faz |
|---|---|
| **Início** | Saudação, “Continue de onde parou”, “Para hoje”, receita do dia, dica do dia e atalhos |
| **Meu Plano** | Meta de peso opcional (peso inicial, atual e meta, com progresso). O usuário define os próprios horários (acordar, primeira e última refeição, dormir). Mostra a barra do dia e a rotina: Manhã → Período de alimentação → Período sem alimentação → Próxima refeição → Noite |
| **Receitas** | 26 receitas com busca e categorias (Café da manhã, Almoço, Jantar, Lanches, Rápidas, Poucos ingredientes). Cada uma tem tempo, dificuldade, calorias e macros estimados por porção, ingredientes, preparo (passos marcáveis), substituições, alergênicos, favoritar e “adicionar à lista de compras” |
| **Ferramentas** | Checklist diário (4 hábitos + últimos 7 dias), Lista de compras (manual ou a partir de receitas), Temporizador (continua contando se o app for fechado) e Diário (refeição, fome 1–5, como se sentia) |
| **Aprenda** | 18 conteúdos em 5 categorias, Mitos e verdades interativo (15 afirmações), 10 dicas práticas e **Central de Segurança** |
| **Favoritos** | Receitas e Conteúdos |
| **Perfil** | Nome, e-mail, alterar nome, alterar senha, suporte, termos, privacidade, sair |

Também: cadastro/login, recuperação de senha, onboarding de 3 telas, estados vazios, loading, mensagens de erro em português, navegação inferior no celular e sidebar no desktop.

**Fora do escopo, de propósito:** IA, comunidade, chat, ranking, gamificação, gráficos, notificações e diário de calorias.

---

## Como a entrega pela Kirvano funciona (sem cadastro manual)

```
Anúncio → Página de vendas → Checkout Kirvano → Pagamento aprovado
→ Área de membros Kirvano → módulo “Seu aplicativo está aqui”
→ botão “ACESSAR MEU APLICATIVO” → Web App → Criar conta / Entrar
```

**O que está implementado:** cadastro aberto com Supabase Auth. Quem comprou clica no botão dentro da área de membros, cria a conta e já entra no app. **Você não precisa criar nem liberar contas.**

**A limitação, para você decidir com clareza:** como o app não consulta a Kirvano, qualquer pessoa que tenha o link consegue criar uma conta. Na prática, o link fica dentro da área de membros (que só compradores acessam). Para um produto de R$ 27,90 costuma ser uma troca aceitável: zero manutenção e zero integração para quebrar.

**Se depois você quiser validar a compra automaticamente** (opcional, *não implementado*): verifique no painel da Kirvano se existe **webhook** de “compra aprovada” (normalmente em Integrações/Webhooks). Se existir, o caminho seria:

1. Criar uma Supabase Edge Function que recebe esse webhook, confere o token/assinatura que a Kirvano enviar e grava o e-mail do comprador numa tabela `buyers`.
2. Bloquear o cadastro de e-mails que não estão em `buyers` (via *Auth Hook* “before user created” do Supabase).
3. Pedir ao comprador que use o mesmo e-mail da compra.

Isso depende do formato real do webhook da Kirvano (campos, assinatura), por isso não foi inventado aqui. Com a documentação do webhook em mãos, a implementação leva poucas horas.

### Texto sugerido para o módulo na área de membros

> **Seu aplicativo está aqui**
> Entre no aplicativo para acessar suas receitas, ferramentas e conteúdos.
> **[ ACESSAR MEU APLICATIVO ]** → link para `https://SEU-DOMINIO/cadastro`
>
> Já criou sua conta? Use o mesmo botão e toque em “Entrar”.

Use o link `/cadastro` no botão (quem já tem conta toca em “Entrar” na mesma tela).

---

## Rodando localmente

```bash
npm install
npm run dev
```

Sem variáveis de ambiente, o app abre em **modo demonstração**: tudo funciona, mas os dados ficam só no navegador (um aviso aparece na tela de login). Útil para revisar o app sem servidor. Em produção, configure o Supabase.

## Configurando o Supabase (≈10 minutos)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor** → rode, nesta ordem, os arquivos de `supabase/migrations/` (`20261008000000_init.sql` e depois `20261009000000_weight_goal.sql`).
3. **Authentication → Sign In / Providers → Email**:
   - Desative **Confirm email** para o comprador entrar direto após o cadastro (recomendado para este produto). Se deixar ativado, o app mostra “Confirme seu e-mail” e funciona do mesmo jeito, só que com um passo a mais.
4. **Authentication → URL Configuration**:
   - **Site URL**: `https://SEU-DOMINIO`
   - **Redirect URLs**: adicione `https://SEU-DOMINIO/redefinir-senha` (e `http://localhost:5173/redefinir-senha` para testes).
5. (Recomendado) **Authentication → Emails → SMTP**: configure um SMTP próprio (Resend, Brevo etc.). O SMTP padrão do Supabase tem limite baixo de envios, o que afeta e-mails de recuperação de senha.
6. Em **Authentication → Emails → Templates**, traduza os e-mails para português (opcional, mas melhora a experiência).
7. **Project Settings → API**: copie `Project URL` e a chave **anon/publishable**.

> Nunca use a `service_role` key no frontend. O app usa apenas a chave pública; a segurança dos dados vem do Row Level Security, já configurado na migração (cada usuário só lê e altera os próprios dados).

## Deploy na Vercel

1. Suba este repositório no GitHub e importe na Vercel (framework detectado: Vite).
2. Em **Settings → Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPPORT_CONTACT` (e-mail ou link de WhatsApp para a tela de Suporte)
3. Deploy. O `vercel.json` já cuida das rotas do app e do cache dos arquivos.
4. Atualize **Site URL** e **Redirect URLs** no Supabase com o domínio final.
5. Coloque o link `https://SEU-DOMINIO/cadastro` no botão da área de membros da Kirvano.

---

## Personalizando

- **Nome do app**: `APP_NAME` em `src/components/layout/Logo.tsx`, `index.html` e `public/manifest.webmanifest`.
- **Calorias e macros**: `src/data/nutrition.ts` (tabela por 100 g + gramas de cada ingrediente por receita). Ao criar uma receita nova, adicione a entrada dela ali; um teste avisa se faltar.
- **Receitas**: `src/data/recipes.ts`. Para usar fotos reais, coloque as imagens em `public/fotos/` (de preferência `.webp`, ~1200px de largura) e adicione `image: '/fotos/nome.webp'` na receita. Sem foto, o app mostra uma capa ilustrada.
- **Conteúdos**: `src/data/articles.ts`; **Mitos e verdades**: `src/data/myths.ts`; **Dicas**: `src/data/tips.ts`.
- **Termos e privacidade**: `src/pages/Legal.tsx`. São textos-base: revise com quem cuida da parte jurídica do seu negócio.
- **Cores**: `tailwind.config.js`.

## Qualidade

```bash
npm run lint       # checagem de tipos (TypeScript)
npm test           # testes unitários e de componentes (Vitest)
npm run build && npm run test:e2e   # teste ponta a ponta no navegador (modo demonstração) + screenshots em /screenshots
```

O teste ponta a ponta percorre, no celular (390px) e no desktop (1440px): cadastro com validação, onboarding, plano, busca/categorias/estado vazio de receitas, favoritar, adicionar à lista, lista de compras, checklist, temporizador (incluindo recarregar a página), diário, conteúdos, Central de Segurança, mitos e verdades, favoritos, alterar senha, logout, login, recuperação de senha, página 404 e ausência de rolagem horizontal.

## Estrutura

```
src/
  App.tsx                 rotas (telas carregadas sob demanda)
  contexts/AppContext.tsx sessão, perfil e favoritos
  lib/
    backend.ts            escolhe Supabase ou modo demonstração
    supabaseBackend.ts    implementação com Supabase
    localBackend.ts       implementação local (demonstração/testes)
    plan.ts               cálculos do Meu Plano
  data/                   receitas, conteúdos, mitos e dicas
  components/             UI (estilo shadcn/ui), layout, cards
  pages/                  telas
supabase/migrations/      schema + RLS
```

## Tecnologia

React 18 + TypeScript + Vite · Tailwind CSS · componentes no padrão shadcn/ui (Radix Slot + CVA) · Lucide · Supabase Auth + PostgreSQL · Vercel.
