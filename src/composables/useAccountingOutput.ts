import { computed, ref } from 'vue'
import {
  buildAccountingRows,
  buildFormattedText,
  hasMissingRequiredFields,
  saveAccountingOutput,
  registerCopy
} from '@/services/accounting/accountingService'
import type { EmployeeApplication } from '@/types/employee'
import type { DpInternalData } from '@/types/dp'

export function useAccountingOutput(employee: EmployeeApplication, dp: DpInternalData) {
  const rows = computed(() => buildAccountingRows(employee, dp))
  const formattedText = computed(() => buildFormattedText(rows.value))
  const isComplete = computed(() => !hasMissingRequiredFields(rows.value))
  const outputId = ref<string | null>(null)
  const isSaving = ref(false)
  const saveError = ref<string | null>(null)

  async function generateAndSave(userId: string) {
    isSaving.value = true
    saveError.value = null
    try {
      outputId.value = await saveAccountingOutput(employee.id, rows.value, formattedText.value, userId)
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Não foi possível salvar a ficha.'
    } finally {
      isSaving.value = false
    }
  }

  async function markCopied(userId: string) {
    if (!outputId.value) {
      await generateAndSave(userId)
    }
    if (outputId.value) {
      await registerCopy(outputId.value, userId)
    }
  }

  return { rows, formattedText, isComplete, outputId, isSaving, saveError, generateAndSave, markCopied }
}
