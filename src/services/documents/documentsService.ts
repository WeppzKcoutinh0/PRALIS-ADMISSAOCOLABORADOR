import { supabase } from '@/services/supabase/client'
import type { EmployeeDocument } from '@/types/documents'

const BUCKET = 'employee-documents'

function mapDoc(row: {
  id: string
  application_id: string
  document_type: string
  original_file_name: string
  storage_path: string
  mime_type: string
  file_size: number
  uploaded_at: string
}): EmployeeDocument {
  return {
    id: row.id,
    applicationId: row.application_id,
    documentType: row.document_type,
    originalFileName: row.original_file_name,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    uploadedAt: row.uploaded_at
  }
}

export async function listDocumentsForApplication(applicationId: string): Promise<EmployeeDocument[]> {
  const { data, error } = await supabase
    .from('employee_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('uploaded_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapDoc)
}

// Gera uma URL assinada e temporaria (padrao: 5 minutos) para o DP visualizar
// um documento privado. Nunca expomos URLs publicas permanentes.
export async function getSignedDocumentUrl(storagePath: string, expiresInSeconds = 300): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}
