<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="empty-state">
    <img src="@/assets/brand/icons/pralis-wheat-gold.png" alt="" class="empty-state__icon" />
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--pralis-space-7) var(--pralis-space-4);
}
.empty-state__icon {
  width: 56px;
  height: auto;
  margin: 0 auto var(--pralis-space-3);
  opacity: 0.6;
}
.empty-state__title {
  font-family: var(--pralis-font-primary);
  font-weight: 800;
  font-size: 1.05rem;
  margin-bottom: 4px;
}
.empty-state__description {
  color: var(--pralis-text-secondary);
  font-size: 0.9rem;
  max-width: 420px;
  margin: 0 auto;
}
</style>
