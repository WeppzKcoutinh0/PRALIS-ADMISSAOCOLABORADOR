-- Bucket privado para os documentos dos colaboradores.
-- Estrutura de caminho: {application_id}/{document_type}/{uuid}.{extensao}
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'employee-documents',
  'employee-documents',
  false,
  15728640, -- 15MB
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

-- Leitura: apenas usuarios internos autenticados (DP/admin/viewer) podem
-- gerar URLs assinadas para visualizar os documentos.
create policy employee_documents_storage_select_staff
  on storage.objects for select
  to authenticated
  using (bucket_id = 'employee-documents' and public.is_staff());

-- Exclusao: somente admin, para casos excepcionais de limpeza.
create policy employee_documents_storage_delete_admin
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'employee-documents' and public.current_profile_role() = 'admin');

-- Nao existe policy de INSERT/UPDATE para 'anon' ou 'authenticated'.
-- O upload publico e feito por meio de uma Signed Upload URL gerada pela
-- Edge Function "public-application" com a service_role — o token assinado
-- e a propria autorizacao da escrita, sem precisar de policy adicional.
