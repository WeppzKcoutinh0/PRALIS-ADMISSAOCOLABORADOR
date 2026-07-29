create table public.dp_internal_data (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique
    references public.employee_applications(id) on delete cascade,
  job_function text,
  contract_type text,
  work_schedule text,
  transport_voucher_schedule text,
  admission_date date,
  first_period_days integer,
  second_period_days integer,
  is_trust_position boolean,
  is_first_job boolean,
  notes text,
  completed_by uuid references public.profiles(id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint first_period_days_non_negative
    check (first_period_days is null or first_period_days >= 0),
  constraint second_period_days_non_negative
    check (second_period_days is null or second_period_days >= 0)
);

comment on table public.dp_internal_data is 'Campos internos preenchidos pelo Departamento Pessoal. Podem ficar nulos como rascunho; a obrigatoriedade e validada na aplicacao antes de status = ready_for_accounting.';
