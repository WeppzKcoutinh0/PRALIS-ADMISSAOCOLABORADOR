<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean }>(), { padded: true })
</script>

<template>
  <div class="base-card" :class="{ 'base-card--padded': padded }">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background-color: var(--pralis-surface);
  border-radius: var(--pralis-radius-lg);
  box-shadow: var(--pralis-shadow-md);
  border: 1px solid var(--pralis-border);
}
.base-card--padded {
  padding: var(--pralis-space-5);
}
@media (min-width: 768px) {
  .base-card--padded {
    padding: var(--pralis-space-6);
  }
}
</style>
