<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    modelValue: string
    label: string
    options: { label: string; value: string }[]
    required?: boolean
    error?: string | null
  }>(),
  { required: false, error: null }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const groupName = useId()
</script>

<template>
  <fieldset class="field">
    <legend class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
      <span v-if="required" class="visually-hidden">(obrigatório)</span>
    </legend>
    <div class="radio-options" role="radiogroup">
      <label v-for="option in options" :key="option.value" class="radio-option">
        <input
          type="radio"
          :name="groupName"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="emit('update:modelValue', option.value)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.field {
  margin-bottom: var(--pralis-space-4);
}
.field__label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--pralis-text-primary);
  margin-bottom: 8px;
  display: block;
}
.field__required {
  color: var(--pralis-primary-dark);
}
.radio-options {
  display: flex;
  gap: var(--pralis-space-3);
  flex-wrap: wrap;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1.5px solid var(--pralis-border-strong);
  border-radius: var(--pralis-radius-pill);
  cursor: pointer;
  font-size: 0.95rem;
  min-height: 44px;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.radio-option:has(input:checked) {
  border-color: var(--pralis-primary);
  background-color: var(--pralis-primary-tint);
  font-weight: 700;
  color: var(--pralis-primary-dark);
}
.radio-option input {
  accent-color: var(--pralis-primary);
  width: 18px;
  height: 18px;
}
.field__error {
  margin: 8px 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pralis-danger);
}
</style>
