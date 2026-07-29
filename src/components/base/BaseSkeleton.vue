<script setup lang="ts">
withDefaults(defineProps<{ height?: string; width?: string; rounded?: boolean }>(), {
  height: '16px',
  width: '100%',
  rounded: false
})
</script>

<template>
  <span
    class="base-skeleton"
    :class="{ 'base-skeleton--rounded': rounded }"
    :style="{ height, width }"
    aria-hidden="true"
  />
</template>

<style scoped>
.base-skeleton {
  display: block;
  background: linear-gradient(90deg, var(--pralis-surface-alt) 25%, #f3e9db 37%, var(--pralis-surface-alt) 63%);
  background-size: 400% 100%;
  border-radius: var(--pralis-radius-sm);
  animation: skeleton-loading 1.4s ease infinite;
}
.base-skeleton--rounded {
  border-radius: var(--pralis-radius-pill);
}
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
