<script setup lang="ts">
import { useId } from 'vue'
import type { FormFieldOption } from '@/types/form'

withDefaults(
  defineProps<{
    modelValue: string
    label: string
    options: FormFieldOption[]
    required?: boolean
    error?: string | null
    placeholder?: string
    helpText?: string
    autocomplete?: string
  }>(),
  { required: false, error: null, placeholder: 'Selecione...' }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const selectId = useId()
</script>

<template>
  <div class="field">
    <label :for="selectId" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
      <span v-if="required" class="visually-hidden">(obrigatório)</span>
    </label>
    <select
      :id="selectId"
      class="field__select"
      :class="{ 'field__select--error': error }"
      :value="modelValue"
      :autocomplete="autocomplete"
      :aria-invalid="Boolean(error)"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="emit('blur')"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="helpText && !error" class="field__help">{{ helpText }}</p>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--pralis-space-4);
}

.field__label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--pralis-text-primary);
}

.field__required {
  color: var(--pralis-primary-dark);
}

.field__select {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  font-size: 1rem;
  font-family: var(--pralis-font-primary);
  border: 1.5px solid var(--pralis-border-strong);
  border-radius: var(--pralis-radius-sm);
  background-color: var(--pralis-surface);
  color: var(--pralis-text-primary);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2375625C'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 18px;
}

.field__select:focus-visible {
  border-color: var(--pralis-primary);
  box-shadow: 0 0 0 3px var(--pralis-primary-tint);
  outline: none;
}

.field__select--error {
  border-color: var(--pralis-danger);
}

.field__help {
  margin: 0;
  font-size: 0.8rem;
  color: var(--pralis-text-muted);
}

.field__error {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pralis-danger);
}
</style>
