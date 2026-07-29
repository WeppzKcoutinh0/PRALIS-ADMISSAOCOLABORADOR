create table public.employee_applications (
  id uuid primary key default gen_random_uuid(),
  protocol_number text unique not null,
  public_token_hash text unique,
  public_token_expires_at timestamptz,
  status text not null default 'draft'
    check (
      status in (
        'draft',
        'submitted',
        'dp_review',
        'pending_information',
        'ready_for_accounting',
        'copied_to_questor',
        'completed',
        'cancelled'
      )
    ),

  full_name text not null default '',
  cpf text not null default '',
  birth_date date,
  rg_issue_date date,
  sex text not null default '',
  race_color text not null default '',
  marital_status text not null default '',
  education_level text not null default '',
  birthplace text not null default '',
  nationality text not null default 'Brasileira',
  mobile_phone text,
  email text,
  mother_name text not null default '',
  father_name text,

  privacy_notice_version text,
  privacy_accepted_at timestamptz,

  submitted_at timestamptz,
  assigned_to uuid references public.profiles(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

comment on table public.employee_applications is 'Cadastro de admissao de colaborador: dados preenchidos pelo proprio colaborador.';
comment on column public.employee_applications.cpf is 'Somente digitos, sem pontuacao.';
comment on column public.employee_applications.public_token_hash is 'Hash (nao reversivel) do token publico enviado ao colaborador. O token bruto nunca e armazenado.';

-- CPF sempre com 11 digitos numericos quando preenchido
alter table public.employee_applications
  add constraint employee_applications_cpf_format
  check (cpf = '' or cpf ~ '^[0-9]{11}$');

-- Impede duplicidade de cadastro ATIVO com o mesmo CPF (cancelados nao contam)
create unique index employee_applications_active_cpf_idx
  on public.employee_applications (cpf)
  where cpf <> '' and status <> 'cancelled';

create index employee_applications_status_idx on public.employee_applications (status);
create index employee_applications_assigned_to_idx on public.employee_applications (assigned_to);
create index employee_applications_submitted_at_idx on public.employee_applications (submitted_at);
create index employee_applications_full_name_idx on public.employee_applications using gin (full_name gin_trgm_ops);
