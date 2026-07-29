<script setup lang="ts">
import { computed } from 'vue'
import BaseCheckbox from '@/components/base/BaseCheckbox.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { employeeFormSteps } from '@/config/employeeFormSteps'
import { getFieldConfig } from '@/config/employeeFields'
import { documentTypes } from '@/config/documentTypes'
import { isoDateToBr } from '@/utils/masks'
import { formatCpfDisplay, formatCepDisplay, formatPhoneDisplay } from '@/utils/masks'
import type { EmployeeApplicationDraft } from '@/types/employee'
import type { DocumentUploadState } from '@/types/documents'

const props = defineProps<{
  draft: EmployeeApplicationDraft
  documentState: Record<string, DocumentUploadState>
}>()

const emit = defineEmits<{ 'edit-step': [stepId: string] }>()

const reviewableSteps = employeeFormSteps.filter((step) => step.fields.length > 0)

function displayValue(fieldName: string): string {
  const value = (props.draft as unknown as Record<string, unknown>)[fieldName]
  if (value === null || value === undefined || value === '') return '—'

  switch (fieldName) {
    case 'cpf':
      return formatCpfDisplay(String(value))
    case 'postalCode':
      return formatCepDisplay(String(value))
    case 'mobilePhone':
      return formatPhoneDisplay(String(value))
    case 'birthDate':
    case 'rgIssueDate':
      return isoDateToBr(String(value))
    default: {
      const field = getFieldConfig(fieldName)
      if (field.type === 'select' && field.options) {
        return field.options.find((o) => o.value === value)?.label ?? String(value)
      }
      return String(value)
    }
  }
}

const privacyAccepted = computed({
  get: () => props.draft.privacyAccepted,
  set: (value: boolean) => {
    props.draft.privacyAccepted = value
  }
})
</script>

<template>
  <div>
    <section v-for="step in reviewableSteps" :key="step.id" class="review-section">
      <div class="review-section__header">
        <h3>{{ step.title }}</h3>
        <button type="button" class="review-section__edit" @click="emit('edit-step', step.id)">Editar</button>
      </div>
      <dl class="review-section__list">
        <div v-for="fieldName in step.fields" :key="fieldName" class="review-section__row">
          <dt>{{ getFieldConfig(fieldName).label }}</dt>
          <dd>{{ displayValue(fieldName) }}</dd>
        </div>
      </dl>
    </section>

    <section class="review-section">
      <div class="review-section__header">
        <h3>Documentos enviados</h3>
        <button type="button" class="review-section__edit" @click="emit('edit-step', 'documents-upload')">Editar</button>
      </div>
      <ul class="review-docs">
        <li v-for="docType in documentTypes" :key="docType.value">
          <span>{{ docType.label }}</span>
          <BaseBadge v-if="(documentState[docType.value]?.uploads.length ?? 0) > 0" tone="success">
            {{ (documentState[docType.value]?.uploads.length ?? 0) > 1
              ? `${documentState[docType.value]?.uploads.length} enviados`
              : 'Enviado' }}
          </BaseBadge>
          <BaseBadge v-else-if="docType.required" tone="warning">Pendente</BaseBadge>
          <BaseBadge v-else tone="neutral">Não enviado</BaseBadge>
        </li>
      </ul>
    </section>

    <section class="review-section review-section--consent">
      <BaseCheckbox v-model="privacyAccepted" required>
        Declaro que as informações fornecidas são verdadeiras e autorizo o uso dos meus dados pessoais
        exclusivamente para fins do processo de admissão na Padaria Pralís, conforme a Lei Geral de
        Proteção de Dados (LGPD).
      </BaseCheckbox>
    </section>
  </div>
</template>

<style scoped>
.review-section {
  margin-bottom: var(--pralis-space-5);
  padding-bottom: var(--pralis-space-4);
  border-bottom: 1px solid var(--pralis-border);
}
.review-section:last-of-type {
  border-bottom: none;
}
.review-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--pralis-space-2);
}
.review-section__header h3 {
  margin: 0;
}
.review-section__edit {
  background: none;
  border: none;
  color: var(--pralis-primary-dark);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 10px;
}
.review-section__list {
  margin: 0;
  display: grid;
  gap: 8px;
}
.review-section__row {
  display: flex;
  justify-content: space-between;
  gap: var(--pralis-space-3);
  font-size: 0.9rem;
  padding: 6px 0;
  border-bottom: 1px dashed var(--pralis-border);
}
.review-section__row dt {
  color: var(--pralis-text-muted);
  flex-shrink: 0;
}
.review-section__row dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
  min-width: 0;
  overflow-wrap: anywhere;
}
.review-docs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.review-docs li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}
.review-section--consent {
  background: var(--pralis-surface-alt);
  padding: var(--pralis-space-4);
  border-radius: var(--pralis-radius-md);
  border-bottom: none;
}
</style>
