import { isoDateToBr } from './masks'

export function formatDateBr(isoDate: string | null | undefined): string {
  return isoDateToBr(isoDate)
}

export function formatDateTimeBr(isoDateTime: string | null | undefined): string {
  if (!isoDateTime) return ''
  const date = new Date(isoDateTime)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function generateProtocolPreviewHint(): string {
  const now = new Date()
  return `PRALIS-${now.getFullYear()}`
}
