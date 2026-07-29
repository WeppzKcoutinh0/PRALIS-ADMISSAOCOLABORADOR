<script setup lang="ts">
defineProps<{
  percent: number
  currentStep: number
  totalSteps: number
  stepTitle: string
}>()
</script>

<template>
  <div class="progress" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
    <div class="progress__meta">
      <span class="progress__step">Etapa {{ currentStep }} de {{ totalSteps }}</span>
      <span class="progress__title">{{ stepTitle }}</span>
    </div>
    <div class="progress__track">
      <div class="progress__fill" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>

<style scoped>
.progress {
  margin-bottom: var(--pralis-space-5);
}
.progress__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 8px;
}
.progress__step {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pralis-secondary-dark);
}
.progress__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--pralis-text-primary);
  text-align: right;
}
.progress__track {
  height: 8px;
  background: var(--pralis-border);
  border-radius: var(--pralis-radius-pill);
  overflow: hidden;
}
.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pralis-secondary), var(--pralis-primary));
  border-radius: var(--pralis-radius-pill);
  transition: width 0.3s ease;
}
</style>
