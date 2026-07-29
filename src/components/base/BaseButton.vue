<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    fullWidth: false
  }
)
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`, { 'base-button--full': fullWidth }]"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <span class="base-button__label"><slot /></span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--pralis-space-2);
  border: 2px solid transparent;
  border-radius: var(--pralis-radius-pill);
  font-weight: 700;
  font-family: var(--pralis-font-primary);
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.base-button--md {
  padding: 14px 28px;
  font-size: 1rem;
  min-height: 48px;
}

.base-button--sm {
  padding: 8px 18px;
  font-size: 0.875rem;
  min-height: 38px;
}

.base-button--full {
  width: 100%;
  white-space: normal;
}

.base-button--primary {
  background-color: var(--pralis-primary);
  color: var(--pralis-text-on-primary);
  box-shadow: var(--pralis-shadow-sm);
}
.base-button--primary:hover:not(:disabled) {
  background-color: var(--pralis-primary-dark);
  transform: translateY(-1px);
}

.base-button--secondary {
  background-color: var(--pralis-surface);
  color: var(--pralis-accent-dark);
  border-color: var(--pralis-border-strong);
}
.base-button--secondary:hover:not(:disabled) {
  border-color: var(--pralis-primary);
  color: var(--pralis-primary-dark);
}

.base-button--ghost {
  background-color: transparent;
  color: var(--pralis-text-secondary);
}
.base-button--ghost:hover:not(:disabled) {
  background-color: var(--pralis-surface-alt);
  color: var(--pralis-text-primary);
}

.base-button--danger {
  background-color: var(--pralis-danger);
  color: #fff;
}
.base-button--danger:hover:not(:disabled) {
  opacity: 0.9;
}

.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.base-button__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.base-button__label :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.base-button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: base-button-spin 0.7s linear infinite;
}

@keyframes base-button-spin {
  to { transform: rotate(360deg); }
}
</style>
