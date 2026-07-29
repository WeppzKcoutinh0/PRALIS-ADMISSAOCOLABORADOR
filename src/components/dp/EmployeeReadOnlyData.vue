<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { findOptionLabel, sexOptions, raceColorOptions, maritalStatusOptions, educationLevelOptions, stateOptions } from '@/config/options'
import { formatCpfDisplay, formatCepDisplay, formatPhoneDisplay } from '@/utils/masks'
import { formatDateBr, formatFileSize } from '@/utils/formatters'
import { getSignedDocumentUrl } from '@/services/documents/documentsService'
import { documentTypes } from '@/config/documentTypes'
import type { EmployeeApplication } from '@/types/employee'
import type { EmployeeDocument } from '@/types/documents'

const props = defineProps<{ application: EmployeeApplication; documents: EmployeeDocument[] }>()

const openingDocId = ref<string | null>(null)
const openError = ref<string | null>(null)

async function openDocument(doc: EmployeeDocument) {
  openError.value = null
  openingDocId.value = doc.id
  try {
    const url = await getSignedDocumentUrl(doc.storagePath)
    window.open(url, '_blank', 'noopener')
  } catch (err) {
    openError.value = 'Não foi possível abrir o documento agora.'
  } finally {
    openingDocId.value = null
  }
}

const rows = [
  { label: 'Nome', value: () => props.application.fullName },
  { label: 'CPF', value: () => formatCpfDisplay(props.application.cpf) },
  { label: 'Data de nascimento', value: () => formatDateBr(props.application.birthDate) },
  { label: 'Data de emissão do RG', value: () => formatDateBr(props.application.rgIssueDate) },
  { label: 'CEP', value: () => formatCepDisplay(props.application.postalCode) },
  { label: 'Endereço', value: () => props.application.street },
  { label: 'Número', value: () => props.application.addressNumber },
  { label: 'Complemento', value: () => props.application.addressComplement },
  { label: 'Bairro', value: () => props.application.district },
  { label: 'Cidade', value: () => props.application.city },
  { label: 'Estado', value: () => props.application.state },
  { label: 'Sexo', value: () => findOptionLabel(sexOptions, props.application.sex) },
  { label: 'Raça/Cor', value: () => findOptionLabel(raceColorOptions, props.application.raceColor) },
  { label: 'Estado civil', value: () => findOptionLabel(maritalStatusOptions, props.application.maritalStatus) },
  { label: 'Grau de instrução', value: () => findOptionLabel(educationLevelOptions, props.application.educationLevel) },
  { label: 'Naturalidade', value: () => findOptionLabel(stateOptions, props.application.birthplace) },
  { label: 'Nacionalidade', value: () => props.application.nationality },
  { label: 'Celular', value: () => (props.application.mobilePhone ? formatPhoneDisplay(props.application.mobilePhone) : null) },
  { label: 'E-mail', value: () => props.application.email },
  { label: 'Nome da mãe', value: () => props.application.motherName },
  { label: 'Nome do pai', value: () => props.application.fatherName }
]

function docLabel(type: string) {
  return documentTypes.find((d) => d.value === type)?.label ?? type
}
</script>

<template>
  <div class="readonly-data">
    <dl class="readonly-data__list">
      <div v-for="row in rows" :key="row.label" class="readonly-data__row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value() || '—' }}</dd>
      </div>
    </dl>

    <h3 class="readonly-data__docs-title">Documentos enviados</h3>
    <p v-if="openError" class="readonly-data__error">{{ openError }}</p>
    <ul v-if="documents.length" class="readonly-data__docs">
      <li v-for="doc in documents" :key="doc.id">
        <div>
          <p class="readonly-data__doc-name">{{ docLabel(doc.documentType) }}</p>
          <p class="readonly-data__doc-meta">{{ doc.originalFileName }} · {{ formatFileSize(doc.fileSize) }}</p>
        </div>
        <BaseButton
          size="sm"
          variant="secondary"
          :loading="openingDocId === doc.id"
          @click="openDocument(doc)"
        >
          Visualizar
        </BaseButton>
      </li>
    </ul>
    <p v-else class="readonly-data__doc-meta">Nenhum documento enviado ainda.</p>
  </div>
</template>

<style scoped>
.readonly-data__list {
  margin: 0 0 var(--pralis-space-5);
  display: grid;
  gap: 4px;
}
.readonly-data__row {
  display: flex;
  justify-content: space-between;
  gap: var(--pralis-space-3);
  padding: 8px 0;
  border-bottom: 1px dashed var(--pralis-border);
  font-size: 0.88rem;
}
.readonly-data__row dt {
  color: var(--pralis-text-muted);
  min-width: 40%;
  flex-shrink: 0;
}
.readonly-data__row dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
  min-width: 0;
  overflow-wrap: anywhere;
}
.readonly-data__docs-title {
  margin-bottom: var(--pralis-space-2);
}
.readonly-data__docs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--pralis-space-2);
}
.readonly-data__docs li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--pralis-space-2);
  padding: var(--pralis-space-3);
  border: 1px solid var(--pralis-border);
  border-radius: var(--pralis-radius-sm);
}
.readonly-data__doc-name {
  margin: 0;
  font-weight: 700;
  font-size: 0.88rem;
}
.readonly-data__doc-meta {
  margin: 2px 0 0;
  font-size: 0.78rem;
  color: var(--pralis-text-muted);
}
.readonly-data__error {
  color: var(--pralis-danger);
  font-size: 0.85rem;
}
</style>
