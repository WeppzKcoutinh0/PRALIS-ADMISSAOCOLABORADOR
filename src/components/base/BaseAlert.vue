<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'info' | 'success' | 'warning' | 'danger' }>(), { tone: 'info' })
</script>

<template>
  <div class="base-alert" :class="`base-alert--${tone}`" role="status">
    <span class="base-alert__icon" aria-hidden="true">
      <template v-if="tone === 'success'">✓</template>
      <template v-else-if="tone === 'warning'">!</template>
      <template v-else-if="tone === 'danger'">✕</template>
      <template v-else>i</template>
    </span>
    <div class="base-alert__content"><slot /></div>
  </div>
</template>

<style scoped>
.base-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--pralis-radius-md);
  font-size: 0.9rem;
  line-height: 1.5;
}
.base-alert__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 50%;
  font-weight: 800;
  font-size: 0.75rem;
}
.base-alert--info {
  background-color: var(--pralis-primary-tint);
  color: var(--pralis-accent-dark);
}
.base-alert--info .base-alert__icon { background: var(--pralis-primary); color: #fff; }

.base-alert--success {
  background-color: var(--pralis-success-tint);
  color: #054a2c;
}
.base-alert--success .base-alert__icon { background: var(--pralis-success); color: #fff; }

.base-alert--warning {
  background-color: var(--pralis-warning-tint);
  color: #6b3f00;
}
.base-alert--warning .base-alert__icon { background: var(--pralis-warning); color: #fff; }

.base-alert--danger {
  background-color: var(--pralis-danger-tint);
  color: #7a1810;
}
.base-alert--danger .base-alert__icon { background: var(--pralis-danger); color: #fff; }
</style>
