<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    error?: string | null
    helpText?: string
    autocomplete?: string
    inputmode?: string
    maxlength?: number
  }>(),
  { type: 'text', required: false, error: null }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputId = useId()
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.error) ids.push(`${inputId}-error`)
  if (props.helpText) ids.push(`${inputId}-help`)
  return ids.join(' ') || undefined
})
</script>

<template>
  <div class="field">
    <label :for="inputId" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
      <span v-if="required" class="visually-hidden">(obrigatório)</span>
    </label>
    <input
      :id="inputId"
      class="field__input"
      :class="{ 'field__input--error': error }"
      :type="type"
      :inputmode="(inputmode as 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url' | 'none' | undefined)"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="(autocomplete as unknown as 'on')"
      :maxlength="maxlength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <p v-if="helpText && !error" :id="`${inputId}-help`" class="field__help">{{ helpText }}</p>
    <p v-if="error" :id="`${inputId}-error`" class="field__error" role="alert">{{ error }}</p>
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

.field__input {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  font-size: 1rem;
  font-family: var(--pralis-font-primary);
  border: 1.5px solid var(--pralis-border-strong);
  border-radius: var(--pralis-radius-sm);
  background-color: var(--pralis-surface);
  color: var(--pralis-text-primary);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field__input:focus-visible {
  border-color: var(--pralis-primary);
  box-shadow: 0 0 0 3px var(--pralis-primary-tint);
  outline: none;
}

.field__input--error {
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
