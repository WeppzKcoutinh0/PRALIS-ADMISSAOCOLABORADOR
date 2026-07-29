<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import DpLayout from '@/layouts/DpLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ApplicationStatusBadge from '@/components/dp/ApplicationStatusBadge.vue'
import EmployeeReadOnlyData from '@/components/dp/EmployeeReadOnlyData.vue'
import DpInternalReadOnlyData from '@/components/dp/DpInternalReadOnlyData.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import { supabase } from '@/services/supabase/client'
import {
  getApplicationById,
  changeApplicationStatus,
  assignApplication
} from '@/services/applications/applicationsService'
import { listDocumentsForApplication } from '@/services/documents/documentsService'
import { statusLabels, statusTransitions } from '@/config/status'
import { formatDateTimeBr } from '@/utils/formatters'
import { useAuth } from '@/composables/useAuth'
import { createEmptyDpInternalData } from '@/types/dp'
import type { EmployeeApplication } from '@/types/employee'
import type { EmployeeDocument } from '@/types/documents'
import type { ApplicationStatus } from '@/types/status'
import type { DpInternalData } from '@/types/dp'

const props = defineProps<{ id: string }>()
const { userId } = useAuth()

const application = ref<EmployeeApplication | null>(null)
const documents = ref<EmployeeDocument[]>([])
const dpData = ref<DpInternalData>(createEmptyDpInternalData())
const assignedName = ref<string | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const isChangingStatus = ref(false)
const internalDataPending = ref(false)
const showCancelConfirm = ref(false)

async function load() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const result = await getApplicationById(props.id)
    application.value = result.application
    dpData.value = result.dpData
    internalDataPending.value = result.internalDataPending
    documents.value = await listDocumentsForApplication(props.id)

    if (result.application.assignedTo) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', result.application.assignedTo)
        .maybeSingle()
      assignedName.value = data?.full_name ?? null
    }
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Não foi possível carregar o cadastro.'
  } finally {
    isLoading.value = false
  }
}

onMounted(load)

const availableTransitions = computed(() => {
  if (!application.value) return []
  return statusTransitions[application.value.status] ?? []
})

async function handleAssignToMe() {
  if (!application.value || !userId.value) return
  await assignApplication(application.value.id, userId.value)
  await load()
}

async function handleChangeStatus(newStatus: ApplicationStatus) {
  if (!application.value || !userId.value) return

  isChangingStatus.value = true
  try {
    await changeApplicationStatus(application.value.id, newStatus, application.value.status, userId.value)
    await load()
  } finally {
    isChangingStatus.value = false
  }
}

function handleTransitionClick(newStatus: ApplicationStatus) {
  if (newStatus === 'cancelled') {
    showCancelConfirm.value = true
    return
  }
  handleChangeStatus(newStatus)
}

async function confirmCancel() {
  showCancelConfirm.value = false
  await handleChangeStatus('cancelled')
}
</script>

<template>
  <DpLayout>
    <RouterLink :to="{ name: 'dp-applications' }" class="back-link">← Voltar para cadastros</RouterLink>

    <BaseSpinner v-if="isLoading" />
    <BaseAlert v-else-if="errorMessage" tone="danger">{{ errorMessage }}</BaseAlert>

    <template v-else-if="application">
      <div class="detail-header">
        <div>
          <h1>{{ application.fullName }}</h1>
          <p class="detail-header__protocol">Protocolo {{ application.protocolNumber }}</p>
        </div>
        <ApplicationStatusBadge :status="application.status" />
      </div>

      <BaseAlert v-if="application.status === 'dp_review' && internalDataPending" tone="warning" class="detail-pending-alert">
        Este colaborador ainda não tem os dados internos do DP preenchidos. Clique em
        <strong>"Preencher dados internos"</strong> para dar continuidade ao processo de admissão.
      </BaseAlert>

      <BaseCard class="detail-actions">
        <div class="detail-actions__meta">
          <p><strong>Responsável:</strong> {{ assignedName ?? 'Não atribuído' }}</p>
          <p><strong>Última atualização:</strong> {{ formatDateTimeBr(application.updatedAt) }}</p>
        </div>
        <div class="detail-actions__buttons">
          <template v-if="application.status !== 'cancelled'">
            <BaseButton v-if="!application.assignedTo" variant="secondary" size="sm" @click="handleAssignToMe">
              Atribuir a mim
            </BaseButton>
            <RouterLink :to="{ name: 'dp-application-internal', params: { id: application.id } }">
              <BaseButton size="sm">Preencher dados internos</BaseButton>
            </RouterLink>
          </template>
          <RouterLink :to="{ name: 'dp-application-questor', params: { id: application.id } }">
            <BaseButton variant="secondary" size="sm">Ver saída para o Questor</BaseButton>
          </RouterLink>
        </div>
        <div v-if="availableTransitions.length" class="detail-actions__transitions">
          <span>Mudar status para:</span>
          <BaseButton
            v-for="status in availableTransitions"
            :key="status"
            :variant="status === 'cancelled' ? 'danger' : 'ghost'"
            size="sm"
            :loading="isChangingStatus"
            @click="handleTransitionClick(status)"
          >
            <svg
              v-if="status === 'cancelled'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            {{ statusLabels[status] }}
          </BaseButton>
        </div>
      </BaseCard>

      <BaseCard>
        <h2>Dados enviados pelo colaborador</h2>
        <EmployeeReadOnlyData :application="application" :documents="documents" />
      </BaseCard>

      <BaseCard class="detail-internal-card">
        <div class="detail-section-header">
          <h2>Dados internos do DP</h2>
          <RouterLink
            v-if="application.status !== 'cancelled'"
            :to="{ name: 'dp-application-internal', params: { id: application.id } }"
            class="detail-section-edit"
          >
            {{ internalDataPending ? 'Preencher' : 'Editar' }}
          </RouterLink>
        </div>
        <EmptyState
          v-if="internalDataPending"
          title="Ainda não preenchido"
          description="Clique em &quot;Preencher dados internos&quot; para adicionar a função, o contrato e as demais informações internas deste colaborador."
        />
        <DpInternalReadOnlyData v-else :data="dpData" />
      </BaseCard>

      <BaseModal :open="showCancelConfirm" title="Cancelar cadastro" @close="showCancelConfirm = false">
        <p>
          Confirma o cancelamento deste cadastro? Use esta opção quando o colaborador desistiu do
          processo de admissão, ou quando ele já foi admitido mas não está mais na empresa (saiu ou
          foi desligado).
        </p>
        <template #footer>
          <BaseButton variant="secondary" @click="showCancelConfirm = false">Voltar</BaseButton>
          <BaseButton variant="danger" :loading="isChangingStatus" @click="confirmCancel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Confirmar cancelamento
          </BaseButton>
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
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--pralis-space-3);
  margin-bottom: var(--pralis-space-4);
  flex-wrap: wrap;
}
.detail-header__protocol {
  color: var(--pralis-text-muted);
  font-size: 0.85rem;
  margin: 0;
}
.detail-pending-alert {
  margin-bottom: var(--pralis-space-4);
}
.detail-actions {
  margin-bottom: var(--pralis-space-4);
}
.detail-actions__meta p {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: var(--pralis-text-secondary);
}
.detail-actions__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pralis-space-2);
  margin-top: var(--pralis-space-3);
}
.detail-actions__transitions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pralis-space-2);
  margin-top: var(--pralis-space-3);
  padding-top: var(--pralis-space-3);
  border-top: 1px solid var(--pralis-border);
  font-size: 0.85rem;
  color: var(--pralis-text-muted);
}
.detail-internal-card {
  margin-top: var(--pralis-space-4);
}
.detail-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pralis-space-3);
}
.detail-section-header h2 {
  margin: 0;
}
.detail-section-edit {
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}
</style>
