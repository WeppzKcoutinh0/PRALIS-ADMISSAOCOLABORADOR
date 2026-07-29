-- Ativa Row Level Security em todas as tabelas.
-- Padrao: nada e permitido por padrao. So as policies abaixo liberam acesso.
-- O fluxo publico (colaborador) NUNCA acessa estas tabelas diretamente: ele
-- passa pela Edge Function "public-application", que usa a service_role
-- (que ignora RLS) rodando apenas no servidor.

alter table public.profiles enable row level security;
alter table public.employee_applications enable row level security;
alter table public.employee_addresses enable row level security;
alter table public.dp_internal_data enable row level security;
alter table public.employee_documents enable row level security;
alter table public.accounting_outputs enable row level security;
alter table public.application_status_history enable row level security;
alter table public.audit_logs enable row level security;

-- ============ profiles ============
create policy profiles_select_self_or_admin
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.current_profile_role() = 'admin');

create policy profiles_insert_admin
  on public.profiles for insert
  to authenticated
  with check (public.current_profile_role() = 'admin');

create policy profiles_update_admin_or_self
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.current_profile_role() = 'admin')
  with check (id = auth.uid() or public.current_profile_role() = 'admin');

-- ============ employee_applications ============
-- viewer: somente leitura. dp/admin: leitura e atualizacao (status, assigned_to).
-- Nao ha policy de INSERT/DELETE: criacao e exclusao publica passam pela
-- Edge Function com service_role.
create policy employee_applications_select_staff
  on public.employee_applications for select
  to authenticated
  using (public.is_staff());

create policy employee_applications_update_dp_admin
  on public.employee_applications for update
  to authenticated
  using (public.can_edit())
  with check (public.can_edit());

-- ============ employee_addresses ============
create policy employee_addresses_select_staff
  on public.employee_addresses for select
  to authenticated
  using (public.is_staff());

create policy employee_addresses_update_dp_admin
  on public.employee_addresses for update
  to authenticated
  using (public.can_edit())
  with check (public.can_edit());

-- ============ dp_internal_data ============
create policy dp_internal_data_select_staff
  on public.dp_internal_data for select
  to authenticated
  using (public.is_staff());

create policy dp_internal_data_insert_dp_admin
  on public.dp_internal_data for insert
  to authenticated
  with check (public.can_edit());

create policy dp_internal_data_update_dp_admin
  on public.dp_internal_data for update
  to authenticated
  using (public.can_edit())
  with check (public.can_edit());

-- ============ employee_documents ============
create policy employee_documents_select_staff
  on public.employee_documents for select
  to authenticated
  using (public.is_staff());

create policy employee_documents_delete_admin
  on public.employee_documents for delete
  to authenticated
  using (public.current_profile_role() = 'admin');

-- ============ accounting_outputs ============
create policy accounting_outputs_select_staff
  on public.accounting_outputs for select
  to authenticated
  using (public.is_staff());

create policy accounting_outputs_insert_dp_admin
  on public.accounting_outputs for insert
  to authenticated
  with check (public.can_edit());

create policy accounting_outputs_update_dp_admin
  on public.accounting_outputs for update
  to authenticated
  using (public.can_edit())
  with check (public.can_edit());

-- ============ application_status_history ============
create policy application_status_history_select_staff
  on public.application_status_history for select
  to authenticated
  using (public.is_staff());

create policy application_status_history_insert_dp_admin
  on public.application_status_history for insert
  to authenticated
  with check (public.can_edit());

-- ============ audit_logs ============
create policy audit_logs_select_admin
  on public.audit_logs for select
  to authenticated
  using (public.current_profile_role() = 'admin');

create policy audit_logs_insert_staff
  on public.audit_logs for insert
  to authenticated
  with check (public.is_staff());
