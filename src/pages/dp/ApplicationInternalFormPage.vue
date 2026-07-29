<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DpLayout from '@/layouts/DpLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import EmployeeReadOnlyData from '@/components/dp/EmployeeReadOnlyData.vue'
import DpInternalForm from '@/components/dp/DpInternalForm.vue'
import { getApplicationById, changeApplicationStatus } from '@/services/applications/applicationsService'
import { listDocumentsForApplication } from '@/services/documents/documentsService'
import { useDpInternalForm } from '@/composables/useDpInternalForm'
import { useAuth } from '@/composables/useAuth'
import type { EmployeeApplication } from '@/types/employee'
import type { EmployeeDocument } from '@/types/documents'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { userId } = useAuth()

const application = ref<EmployeeApplication | null>(null)
const documents = ref<EmployeeDocument[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const showConfirmModal = ref(false)
const saveSuccessMessage = ref<string | null>(null)

let internalForm: ReturnType<typeof useDpInternalForm> | null = null

async function load() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const result = await getApplicationById(props.id)
    application.value = result.application
    documents.value = await listDocumentsForApplication(props.id)
    internalForm = useDpInternalForm(props.id, result.dpData)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Não foi possível carregar o cadastro.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

async function handleSaveDraft() {
  if (!internalForm || !userId.value) return
  saveSuccessMessage.value = null
  await internalForm.saveDraft(userId.value)
  if (!internalForm.saveError.value) {
    saveSuccessMessage.value = 'Rascunho salvo com sucesso.'
  }
}

function handleFinalizeClick() {
  if (!internalForm) return
  if (!internalForm.validate()) return
  showConfirmModal.value = true
}

async function handleConfirmFinalize() {
  if (!internalForm || !userId.value || !application.value) return
  showConfirmModal.value = false
  const ok = await internalForm.finalizeCompletion(userId.value)
  if (ok) {
    const currentStatus = application.value.status
    if (currentStatus === 'dp_review') {
      await changeApplicationStatus(props.id, 'completed', currentStatus, userId.value)
    }
    router.push({ name: 'dp-application-detail', params: { id: props.id } })
  }
}
</script>

<template>
  <DpLayout>
    <RouterLink :to="{ name: 'dp-application-detail', params: { id } }" class="back-link">
      ← Voltar para o cadastro
    </RouterLink>

    <BaseSpinner v-if="isLoading" />
    <BaseAlert v-else-if="errorMessage" tone="danger">{{ errorMessage }}</BaseAlert>

    <template v-else-if="application && internalForm">
      <h1>Preenchimento interno — {{ application.fullName }}</h1>
      <p>Complete os dados internos. Assim que finalizar, o cadastro é marcado como concluído automaticamente.</p>

      <BaseAlert v-if="saveSuccessMessage" tone="success">{{ saveSuccessMessage }}</BaseAlert>

      <div class="internal-columns">
        <BaseCard>
          <h2>Dados enviados pelo colaborador</h2>
          <EmployeeReadOnlyData :application="application" :documents="documents" />
        </BaseCard>

        <BaseCard>
          <h2>Dados internos do DP</h2>
          <DpInternalForm :form="internalForm" @save-draft="handleSaveDraft" @finalize="handleFinalizeClick" />
        </BaseCard>
      </div>

      <BaseModal :open="showConfirmModal" title="Finalizar preenchimento do DP" @close="showConfirmModal = false">
        <p>
          Confirma que todos os dados internos foram revisados e estão corretos? Após finalizar,
          este cadastro será marcado como concluído automaticamente.
        </p>
        <template #footer>
          <BaseButton variant="secondary" @click="showConfirmModal = false">Cancelar</BaseButton>
          <BaseButton @click="handleConfirmFinalize">Confirmar finalização</BaseButton>
        </template>
      </BaseModal>
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
.internal-columns {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--pralis-space-4);
  margin-top: var(--pralis-space-4);
}
.internal-columns > * {
  min-width: 0;
}
@media (min-width: 1000px) {
  .internal-columns {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
</style>
