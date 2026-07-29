<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Carregando...' })
</script>

<template>
  <div class="base-spinner" role="status">
    <span class="base-spinner__circle" aria-hidden="true" />
    <span class="visually-hidden">{{ label }}</span>
  </div>
</template>

<style scoped>
.base-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pralis-space-6) 0;
}
.base-spinner__circle {
  width: 32px;
  height: 32px;
  border: 3px solid var(--pralis-border);
  border-top-color: var(--pralis-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
