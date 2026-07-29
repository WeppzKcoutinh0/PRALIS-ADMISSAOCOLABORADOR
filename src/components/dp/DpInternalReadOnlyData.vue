<script setup lang="ts">
import { contractTypeOptions, findOptionLabel } from '@/config/options'
import { formatDateBr } from '@/utils/formatters'
import type { DpInternalData } from '@/types/dp'

const props = defineProps<{ data: DpInternalData }>()

function yesNo(value: boolean | null): string | null {
  if (value === null) return null
  return value ? 'Sim' : 'Não'
}

const rows = [
  { label: 'Função', value: () => props.data.jobFunction },
  { label: 'Tipo de contrato', value: () => findOptionLabel(contractTypeOptions, props.data.contractType) },
  { label: 'Escala de trabalho', value: () => props.data.workSchedule },
  { label: 'Escala de VT', value: () => props.data.transportVoucherSchedule },
  { label: 'Data de admissão', value: () => formatDateBr(props.data.admissionDate) },
  { label: 'Dias do 1º período', value: () => props.data.firstPeriodDays?.toString() ?? null },
  { label: 'Dias do 2º período', value: () => props.data.secondPeriodDays?.toString() ?? null },
  { label: 'Cargo de confiança?', value: () => yesNo(props.data.isTrustPosition) },
  { label: 'Primeiro emprego?', value: () => yesNo(props.data.isFirstJob) }
]
</script>

<template>
  <div class="readonly-data">
    <dl class="readonly-data__list">
      <div v-for="row in rows" :key="row.label" class="readonly-data__row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value() || '—' }}</dd>
      </div>
    </dl>

    <div v-if="data.notes" class="readonly-data__notes">
      <p class="readonly-data__notes-label">Observações</p>
      <p class="readonly-data__notes-text">{{ data.notes }}</p>
    </div>
  </div>
</template>

<style scoped>
.readonly-data__list {
  margin: 0;
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
.readonly-data__notes {
  margin-top: var(--pralis-space-4);
}
.readonly-data__notes-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--pralis-text-muted);
  margin: 0 0 4px;
}
.readonly-data__notes-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--pralis-text-primary);
  white-space: pre-wrap;
}
</style>
