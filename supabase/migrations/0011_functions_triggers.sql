-- updated_at automatico
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at_employee_applications
  before update on public.employee_applications
  for each row execute function public.set_updated_at();

create trigger set_updated_at_employee_addresses
  before update on public.employee_addresses
  for each row execute function public.set_updated_at();

create trigger set_updated_at_dp_internal_data
  before update on public.dp_internal_data
  for each row execute function public.set_updated_at();


-- Numero de protocolo sequencial e legivel, ex: PRALIS-2026-000123
create sequence if not exists public.protocol_number_seq;

create or replace function public.generate_protocol_number()
returns text
language sql
as $$
  select 'PRALIS-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.protocol_number_seq')::text, 6, '0');
$$;

create or replace function public.set_protocol_number()
returns trigger
language plpgsql
as $$
begin
  if new.protocol_number is null or new.protocol_number = '' then
    new.protocol_number := public.generate_protocol_number();
  end if;
  return new;
end;
$$;

create trigger set_protocol_number_employee_applications
  before insert on public.employee_applications
  for each row execute function public.set_protocol_number();


-- OBS: o historico de status (application_status_history) e escrito de forma
-- explicita pela aplicacao (ver applicationsService.changeApplicationStatus)
-- em vez de por trigger, para permitir registrar o motivo da mudanca
-- (change_reason) informado pelo usuario do DP.


-- Funcao auxiliar (SECURITY DEFINER) para checar o papel do usuario logado
-- sem cair em recursao de RLS na propria tabela profiles.
create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() in ('admin', 'dp', 'viewer');
$$;

create or replace function public.can_edit()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() in ('admin', 'dp');
$$;
