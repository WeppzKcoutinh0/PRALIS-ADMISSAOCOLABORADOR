create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  application_id uuid
    references public.employee_applications(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_application_id_idx on public.audit_logs (application_id);
create index audit_logs_created_at_idx on public.audit_logs (created_at);

comment on table public.audit_logs is 'Trilha de auditoria tecnica. Nunca deve conter dados pessoais sensiveis em texto livre no campo metadata.';
