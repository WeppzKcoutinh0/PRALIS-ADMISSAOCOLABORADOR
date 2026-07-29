<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import DpLayout from '@/layouts/DpLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import AccountingSheet from '@/components/accounting/AccountingSheet.vue'
import CopyButton from '@/components/accounting/CopyButton.vue'
import { getApplicationById } from '@/services/applications/applicationsService'
import { useAccountingOutput } from '@/composables/useAccountingOutput'
import { useAuth } from '@/composables/useAuth'
import type { EmployeeApplication } from '@/types/employee'
import type { DpInternalData } from '@/types/dp'

const props = defineProps<{ id: string }>()
const { userId } = useAuth()

const application = ref<EmployeeApplication | null>(null)
const dpData = ref<DpInternalData | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const copiedMessage = ref<string | null>(null)

let output: ReturnType<typeof useAccountingOutput> | null = null

async function load() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const result = await getApplicationById(props.id)
    application.value = result.application
    dpData.value = result.dpData
    output = useAccountingOutput(result.application, result.dpData)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Não foi possível carregar o cadastro.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

async function handleCopyAll() {
  if (!output || !userId.value) return
  await navigator.clipboard.writeText(output.formattedText.value)
  await output.markCopied(userId.value)
  copiedMessage.value = 'Ficha completa copiada e registrada com sucesso.'
}
</script>

<template>
  <DpLayout>
    <RouterLink :to="{ name: 'dp-application-detail', params: { id } }" class="back-link">
      ← Voltar para o cadastro
    </RouterLink>

    <BaseSpinner v-if="isLoading" />
    <BaseAlert v-else-if="errorMessage" tone="danger">{{ errorMessage }}</BaseAlert>

    <template v-else-if="application && output">
      <h1>Saída para o Questor X-Zen</h1>
      <p>
        Ficha consolidada com os dados do colaborador e do Departamento Pessoal, pronta para
        copiar e colar no Questor X-Zen.
      </p>

      <BaseAlert v-if="!output.isComplete.value" tone="warning">
        Existem campos obrigatórios pendentes. Complete o preenchimento interno do DP antes de
        copiar a ficha para a contabilidade.
      </BaseAlert>
      <BaseAlert v-if="copiedMessage" tone="success">{{ copiedMessage }}</BaseAlert>

      <BaseCard>
        <div class="questor-actions">
          <CopyButton :text="output.formattedText.value" label="Copiar tudo" size="md" @copied="handleCopyAll" />
        </div>
        <AccountingSheet :rows="output.rows.value" />
      </BaseCard>
    </template>
  </DpLayout>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: var(--pralis-space-4);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pralis-text-secondary);
}
.questor-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--pralis-space-4);
}
</style>
