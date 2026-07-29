<script setup lang="ts">
withDefaults(
  defineProps<{ tone?: 'neutral' | 'info' | 'warning' | 'success' | 'danger' }>(),
  { tone: 'neutral' }
)
</script>

<template>
  <span class="base-badge" :class="`base-badge--${tone}`"><slot /></span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--pralis-radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.base-badge--neutral { background: #EFE7DD; color: var(--pralis-text-secondary); }
.base-badge--info { background: var(--pralis-primary-tint); color: var(--pralis-primary-dark); }
.base-badge--warning { background: var(--pralis-warning-tint); color: #6b3f00; }
.base-badge--success { background: var(--pralis-success-tint); color: #054a2c; }
.base-badge--danger { background: var(--pralis-danger-tint); color: #7a1810; }
</style>
