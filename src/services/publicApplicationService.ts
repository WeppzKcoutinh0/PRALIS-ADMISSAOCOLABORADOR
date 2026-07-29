import type { EmployeeApplicationDraft } from '@/types/employee'
import type { EmployeeDocument } from '@/types/documents'

// Todo o fluxo publico (sem autenticacao) fala com uma Edge Function do
// Supabase em vez de acessar as tabelas diretamente. Isso evita expor o
// schema publico e permite validar o token de cadastro no servidor,
// mantendo a service_role fora do frontend.
const FUNCTION_URL = (import.meta.env.VITE_PUBLIC_APPLICATION_FUNCTION_URL as string | undefined) ?? ''

function assertConfigured() {
  if (!FUNCTION_URL) {
    throw new Error(
      'VITE_PUBLIC_APPLICATION_FUNCTION_URL não configurada. Verifique o arquivo .env.'
    )
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  assertConfigured()
  const response = await fetch(`${FUNCTION_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.error ?? 'Não foi possível completar a solicitação. Tente novamente em instantes.'
    throw new Error(message)
  }

  return body as T
}

export async function startApplication(): Promise<{ token: string }> {
  return request('/start', { method: 'POST' })
}

export async function getApplicationByToken(token: string): Promise<{
  draft: Partial<EmployeeApplicationDraft>
  status: string
  protocolNumber: string | null
  documents: EmployeeDocument[]
}> {
  return request(`/${token}`, { method: 'GET' })
}

export async function saveApplicationDraft(
  token: string,
  data: Partial<EmployeeApplicationDraft>
): Promise<{ ok: true }> {
  return request(`/${token}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function createDocumentUploadUrl(
  token: string,
  payload: { documentType: string; fileName: string; mimeType: string; fileSize: number }
): Promise<{ signedUrl: string; path: string; storageToken: string }> {
  return request(`/${token}/documents/upload-url`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function registerUploadedDocument(
  token: string,
  payload: { documentType: string; originalFileName: string; storagePath: string; mimeType: string; fileSize: number }
): Promise<{ document: EmployeeDocument }> {
  return request(`/${token}/documents`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function removeDocument(token: string, documentId: string): Promise<{ ok: true }> {
  return request(`/${token}/documents/${documentId}`, { method: 'DELETE' })
}

export async function submitApplication(token: string): Promise<{ protocolNumber: string }> {
  return request(`/${token}/submit`, { method: 'POST' })
}
