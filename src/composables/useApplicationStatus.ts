import { computed } from 'vue'
import type { ApplicationStatus } from '@/types/status'
import { statusLabels, statusTone, statusTransitions } from '@/config/status'

export function useApplicationStatus(status: () => ApplicationStatus) {
  const label = computed(() => statusLabels[status()])
  const tone = computed(() => statusTone[status()])
  const nextStatuses = computed(() => statusTransitions[status()] ?? [])

  return { label, tone, nextStatuses }
}
