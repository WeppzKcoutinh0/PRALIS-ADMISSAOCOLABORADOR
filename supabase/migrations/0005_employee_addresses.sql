create table public.employee_addresses (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique
    references public.employee_applications(id) on delete cascade,
  postal_code text not null default '',
  street text not null default '',
  address_number text not null default '',
  complement text,
  district text,
  city text,
  state char(2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.employee_addresses is 'Endereco do colaborador, 1:1 com employee_applications.';
