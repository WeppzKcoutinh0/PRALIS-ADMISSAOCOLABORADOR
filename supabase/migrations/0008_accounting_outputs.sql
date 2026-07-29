create table public.accounting_outputs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.employee_applications(id) on delete cascade,
  output_version integer not null default 1,
  formatted_content text not null,
  structured_data jsonb not null default '{}'::jsonb,
  generated_by uuid not null references public.profiles(id),
  generated_at timestamptz not null default now(),
  copied_by uuid references public.profiles(id),
  copied_at timestamptz
);

create index accounting_outputs_application_id_idx on public.accounting_outputs (application_id);

comment on table public.accounting_outputs is 'Versoes da ficha consolidada gerada para copiar/colar no Questor X-Zen.';
