-- Meta de peso opcional: { start, current, goal, updatedAt } em kg.
-- Fica no próprio perfil (já protegido por RLS: cada usuário só acessa o seu).
alter table public.profiles add column if not exists weight jsonb;
