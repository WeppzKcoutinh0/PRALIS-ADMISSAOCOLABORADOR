<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{ page: number; pageSize: number; total: number }>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
</script>

<template>
  <div class="pagination" v-if="total > 0">
    <span class="pagination__info">
      Página {{ page }} de {{ totalPages }} · {{ total }} {{ total === 1 ? 'cadastro' : 'cadastros' }}
    </span>
    <div class="pagination__controls">
      <BaseButton size="sm" variant="secondary" :disabled="page <= 1" @click="emit('update:page', page - 1)">
        Anterior
      </BaseButton>
      <BaseButton size="sm" variant="secondary" :disabled="page >= totalPages" @click="emit('update:page', page + 1)">
        Próxima
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  gap: var(--pralis-space-3);
  align-items: center;
  justify-content: space-between;
  padding: var(--pralis-space-4) 0;
}
.pagination__info {
  font-size: 0.85rem;
  color: var(--pralis-text-secondary);
}
.pagination__controls {
  display: flex;
  gap: var(--pralis-space-2);
}
@media (min-width: 640px) {
  .pagination { flex-direction: row; }
}
</style>
