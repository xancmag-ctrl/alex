-- Jejum Inteligente — schema inicial
-- Rode este arquivo no Supabase: Dashboard → SQL Editor → New query → colar → Run.
--
-- Receitas e conteúdos educativos ficam no próprio código do app (src/data),
-- então não precisam de tabelas: carregam instantaneamente e não geram custo de banco.
-- O banco guarda apenas os dados PESSOAIS de cada usuário, todos protegidos por RLS.

-- ───────────── PERFIS ─────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  onboarded   boolean not null default false,
  plan        jsonb,             -- { wake, firstMeal, lastMeal, sleep } — horários "HH:MM"
  last_viewed jsonb,             -- { kind: 'recipe'|'article', slug, at }
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: ler o próprio"      on public.profiles for select using (auth.uid() = id);
create policy "profiles: criar o próprio"    on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: alterar o próprio"  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── FAVORITOS ─────────────
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('recipe', 'article')),
  slug       text not null check (char_length(slug) <= 120),
  created_at timestamptz not null default now(),
  unique (user_id, kind, slug)
);

-- ───────────── CHECKLIST DIÁRIO (habit logs) ─────────────
create table if not exists public.daily_checks (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day        date not null,
  items      text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- ───────────── LISTA DE COMPRAS ─────────────
create table if not exists public.shopping_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  checked     boolean not null default false,
  recipe_slug text,
  created_at  timestamptz not null default now()
);
create index if not exists shopping_items_user_idx on public.shopping_items (user_id, created_at);

-- ───────────── DIÁRIO ─────────────
create table if not exists public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  meal       text not null check (char_length(meal) between 1 and 200),
  hunger     smallint not null check (hunger between 1 and 5),
  feeling    text not null check (char_length(feeling) <= 60),
  note       text not null default '' check (char_length(note) <= 1000),
  created_at timestamptz not null default now()
);
create index if not exists journal_entries_user_idx on public.journal_entries (user_id, created_at desc);

-- ───────────── RLS: cada usuário acessa somente os próprios dados ─────────────
do $$
declare t text;
begin
  foreach t in array array['favorites', 'daily_checks', 'shopping_items', 'journal_entries'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%1$s: dono" on public.%1$I', t);
    execute format(
      'create policy "%1$s: dono" on public.%1$I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end $$;
