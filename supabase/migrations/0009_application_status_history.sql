create table public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.employee_applications(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id),
  change_reason text,
  created_at timestamptz not null default now()
);

create index application_status_history_application_id_idx on public.application_status_history (application_id);

comment on table public.application_status_history is 'Historico de todas as mudancas de status de um cadastro.';
