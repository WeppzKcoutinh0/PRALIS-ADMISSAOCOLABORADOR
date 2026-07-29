-- Perfis dos usuarios internos (DP, admin, viewer).
-- Contas sao criadas manualmente via Supabase Auth (painel ou CLI) e depois
-- recebem uma linha em profiles. Nao ha cadastro publico de contas internas.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'dp', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Usuarios internos com acesso ao portal (DP, admin, viewer).';
