<script setup lang="ts">
import BaseBadge from '@/components/base/BaseBadge.vue'
import CopyButton from './CopyButton.vue'
import { accountingSectionBreaks } from '@/config/accountingMapping'
import type { AccountingRow } from '@/services/accounting/accountingService'

defineProps<{ rows: AccountingRow[] }>()

function sectionFor(index: number): string | null {
  const order = index + 1
  const brk = [...accountingSectionBreaks].reverse().find((b) => order === b.afterOrder + 1)
  return brk ? brk.heading : null
}
</script>

<template>
  <div class="sheet">
    <template v-for="(row, index) in rows" :key="row.key">
      <h3 v-if="sectionFor(index)" class="sheet__section-title">{{ sectionFor(index) }}</h3>
      <div class="sheet__row" :class="{ 'sheet__row--missing': row.missing }">
        <div class="sheet__row-main">
          <span class="sheet__label">{{ row.label }}</span>
          <span class="sheet__value">
            {{ row.value || '—' }}
            <BaseBadge v-if="row.missing" tone="danger">Pendente</BaseBadge>
          </span>
        </div>
        <CopyButton :text="`${row.label}: ${row.value}`" label="Copiar" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.sheet__section-title {
  margin-top: var(--pralis-space-4);
  font-family: var(--pralis-font-primary);
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pralis-secondary-dark);
  border-bottom: 2px solid var(--pralis-border);
  padding-bottom: 6px;
}
.sheet__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--pralis-space-3);
  padding: 10px 0;
  border-bottom: 1px dashed var(--pralis-border);
  flex-wrap: wrap;
}
.sheet__row--missing {
  background: var(--pralis-danger-tint);
  border-radius: var(--pralis-radius-sm);
  padding-left: 8px;
}
.sheet__row-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.sheet__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--pralis-text-muted);
  font-weight: 700;
}
.sheet__value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pralis-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
