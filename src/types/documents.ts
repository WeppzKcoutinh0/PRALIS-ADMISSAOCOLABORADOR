export interface EmployeeDocument {
  id: string
  applicationId: string
  documentType: string
  originalFileName: string
  storagePath: string
  mimeType: string
  fileSize: number
  uploadedAt: string
}

export type UploadStatus = 'idle' | 'uploading' | 'error'

export interface DocumentUploadState {
  documentType: string
  uploads: EmployeeDocument[]
  status: UploadStatus
  progress: number
  errorMessage: string | null
}
