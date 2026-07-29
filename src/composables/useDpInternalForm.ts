import { reactive, ref } from 'vue'
import { validateDpInternalData, createEmptyDpInternalData } from '@/types/dp'
import type { DpInternalData } from '@/types/dp'
import { saveDpInternalData, markDpDataCompleted } from '@/services/applications/applicationsService'

export function useDpInternalForm(applicationId: string, initial?: DpInternalData) {
  const data = reactive<DpInternalData>(initial ? { ...initial } : createEmptyDpInternalData())
  const errors = ref<string[]>([])
  const isSaving = ref(false)
  const lastSavedAt = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  function validate(): boolean {
    errors.value = validateDpInternalData(data)
    return errors.value.length === 0
  }

  async function saveDraft(userId: string) {
    isSaving.value = true
    saveError.value = null
    try {
      await saveDpInternalData(applicationId, { ...data }, userId)
      lastSavedAt.value = new Date().toISOString()
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Não foi possível salvar o rascunho.'
    } finally {
      isSaving.value = false
    }
  }

  async function finalizeCompletion(userId: string): Promise<boolean> {
    if (!validate()) return false
    await saveDraft(userId)
    await markDpDataCompleted(applicationId, userId)
    return true
  }

  return { data, errors, isSaving, lastSavedAt, saveError, validate, saveDraft, finalizeCompletion }
}
