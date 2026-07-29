import { ref, reactive } from 'vue'
import { listApplications } from '@/services/applications/applicationsService'
import type { ApplicationListFilters, ApplicationListItem } from '@/services/applications/applicationsService'

export function useDpApplications() {
  const items = ref<ApplicationListItem[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const filters = reactive<ApplicationListFilters>({
    search: '',
    status: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    page: 1,
    pageSize: 10,
    sortBy: 'created_at',
    sortDirection: 'desc'
  })

  async function fetchApplications() {
    isLoading.value = true
    errorMessage.value = null
    try {
      const result = await listApplications({ ...filters })
      items.value = result.items
      total.value = result.total
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Não foi possível carregar os cadastros.'
    } finally {
      isLoading.value = false
    }
  }

  function setPage(page: number) {
    filters.page = page
    void fetchApplications()
  }

  function applyFilters(partial: Partial<ApplicationListFilters>) {
    Object.assign(filters, partial, { page: 1 })
    void fetchApplications()
  }

  return { items, total, isLoading, errorMessage, filters, fetchApplications, setPage, applyFilters }
}
