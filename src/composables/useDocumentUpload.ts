import { reactive } from 'vue'
import { supabase } from '@/services/supabase/client'
import {
  createDocumentUploadUrl,
  registerUploadedDocument,
  removeDocument as removeDocumentRequest
} from '@/services/publicApplicationService'
import { documentTypes } from '@/config/documentTypes'
import type { EmployeeDocument, DocumentUploadState } from '@/types/documents'

const BUCKET = 'employee-documents'

function initialStateFor(documentType: string): DocumentUploadState {
  return {
    documentType,
    uploads: [],
    status: 'idle',
    progress: 0,
    errorMessage: null
  }
}

export function useDocumentUpload(token: string, initialDocuments: EmployeeDocument[] = []) {
  const state = reactive<Record<string, DocumentUploadState>>({})

  for (const docType of documentTypes) {
    state[docType.value] = initialStateFor(docType.value)
  }

  function syncDocuments(documents: EmployeeDocument[]) {
    for (const docType of documentTypes) {
      state[docType.value].uploads = documents.filter((d) => d.documentType === docType.value)
    }
  }

  syncDocuments(initialDocuments)

  function validateFile(documentType: string, file: File): string | null {
    const config = documentTypes.find((d) => d.value === documentType)
    if (!config) return 'Tipo de documento desconhecido.'

    if (!config.acceptedMimeTypes.includes(file.type)) {
      return 'Formato de arquivo não permitido. Envie PDF, JPG ou PNG.'
    }
    const maxBytes = config.maxSizeMb * 1024 * 1024
    if (file.size > maxBytes) {
      return `Arquivo muito grande. O limite é ${config.maxSizeMb}MB.`
    }
    return null
  }

  async function uploadDocument(documentType: string, file: File) {
    const entry = state[documentType]
    const validationError = validateFile(documentType, file)
    if (validationError) {
      entry.status = 'error'
      entry.errorMessage = validationError
      return
    }

    entry.status = 'uploading'
    entry.progress = 10
    entry.errorMessage = null

    try {
      const { signedUrl, path, storageToken } = await createDocumentUploadUrl(token, {
        documentType,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size
      })
      entry.progress = 40
      void signedUrl // a URL assinada e usada via uploadToSignedUrl abaixo

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(path, storageToken, file)

      if (uploadError) throw uploadError
      entry.progress = 80

      const { document } = await registerUploadedDocument(token, {
        documentType,
        originalFileName: file.name,
        storagePath: path,
        mimeType: file.type,
        fileSize: file.size
      })

      entry.uploads.push(document)
      entry.status = 'idle'
      entry.progress = 0
    } catch (err) {
      entry.status = 'error'
      entry.errorMessage =
        err instanceof Error ? err.message : 'Falha no envio do documento. Tente novamente.'
      entry.progress = 0
    }
  }

  async function removeDocument(documentType: string, documentId: string) {
    const entry = state[documentType]
    try {
      await removeDocumentRequest(token, documentId)
      entry.uploads = entry.uploads.filter((d) => d.id !== documentId)
    } catch (err) {
      entry.errorMessage = err instanceof Error ? err.message : 'Não foi possível remover o documento.'
    }
  }

  function requiredDocumentsMissing(): string[] {
    return documentTypes
      .filter((doc) => doc.required && (state[doc.value]?.uploads.length ?? 0) === 0)
      .map((doc) => doc.label)
  }

  return { state, documentTypes, uploadDocument, removeDocument, requiredDocumentsMissing, syncDocuments }
}
