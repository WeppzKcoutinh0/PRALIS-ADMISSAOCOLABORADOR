<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { statusLabels } from '@/config/status'
import type { ApplicationStatus } from '@/types/status'

const emit = defineEmits<{
  filter: [payload: { search: string; status: ApplicationStatus | 'all'; dateFrom?: string; dateTo?: string }]
}>()

const search = ref('')
const status = ref<ApplicationStatus | 'all'>('all')
const dateFrom = ref('')
const dateTo = ref('')

const statusOptions = [
  { label: 'Todos os status', value: 'all' },
  ...Object.entries(statusLabels)
    .filter(([value]) => value !== 'draft')
    .map(([value, label]) => ({ label, value }))
]

function applyFilters() {
  emit('filter', {
    search: search.value.trim(),
    status: status.value,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined
  })
}
</script>

<template>
  <form class="filters" @submit.prevent="applyFilters">
    <BaseInput v-model="search" label="Buscar por nome ou CPF" placeholder="Digite para buscar..." />
    <BaseSelect v-model="status" label="Status" :options="statusOptions" placeholder="Todos os status" />
    <div class="filters__dates">
      <BaseInput v-model="dateFrom" label="Enviado a partir de" type="date" />
      <BaseInput v-model="dateTo" label="Enviado até" type="date" />
    </div>
    <BaseButton type="submit" size="sm">Filtrar</BaseButton>
  </form>
</template>

<style scoped>
.filters {
  display: grid;
  gap: var(--pralis-space-3);
  margin-bottom: var(--pralis-space-5);
  align-items: end;
  min-width: 0;
}
.filters > :deep(*) {
  min-width: 0;
}
.filters__dates {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--pralis-space-3);
  min-width: 0;
}
.filters__dates > :deep(*) {
  min-width: 0;
}
@media (min-width: 480px) {
  .filters__dates {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 900px) {
  .filters {
    grid-template-columns: 2fr 1.4fr 2fr auto;
  }
}
</style>
