import type { ApplicationStatus } from '@/types/status'

export const statusLabels: Record<ApplicationStatus, string> = {
  draft: 'Rascunho',
  dp_review: 'Em análise pelo DP',
  completed: 'Concluído',
  cancelled: 'Cancelado'
}

// tom visual de cada status (usa os tokens de cor da marca / estado)
export const statusTone: Record<ApplicationStatus, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
  draft: 'neutral',
  dp_review: 'info',
  completed: 'success',
  cancelled: 'danger'
}

export const statusTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ['dp_review'],
  dp_review: ['cancelled'],
  completed: ['cancelled'],
  cancelled: []
}

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return statusTransitions[from]?.includes(to) ?? false
}

export const dashboardStatusGroups: { id: string; title: string; statuses: ApplicationStatus[] }[] = [
  { id: 'in_review', title: 'Cadastros (Análise DP)', statuses: ['dp_review'] },
  { id: 'done', title: 'Concluídos', statuses: ['completed'] },
  { id: 'cancelled', title: 'Contratos cancelados', statuses: ['cancelled'] }
]
