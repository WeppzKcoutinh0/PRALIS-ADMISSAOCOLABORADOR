create table public.employee_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.employee_applications(id) on delete cascade,
  document_type text not null,
  original_file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  file_size bigint not null check (file_size > 0),
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index employee_documents_application_id_idx on public.employee_documents (application_id);

comment on table public.employee_documents is 'Metadados dos documentos enviados. Os arquivos ficam no bucket privado employee-documents.';
