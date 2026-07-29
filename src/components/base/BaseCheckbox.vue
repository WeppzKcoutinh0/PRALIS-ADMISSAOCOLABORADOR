<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  modelValue: boolean
  required?: boolean
  error?: string | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const checkboxId = useId()
</script>

<template>
  <div class="checkbox-field">
    <label class="checkbox-option" :for="checkboxId">
      <input
        :id="checkboxId"
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="checkbox-option__text"><slot /></span>
    </label>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
}
.checkbox-option input {
  margin-top: 3px;
  width: 20px;
  height: 20px;
  min-width: 20px;
  accent-color: var(--pralis-primary);
}
.checkbox-option__text {
  font-size: 0.9rem;
  color: var(--pralis-text-primary);
  line-height: 1.4;
}
.field__error {
  margin: 6px 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pralis-danger);
}
</style>
