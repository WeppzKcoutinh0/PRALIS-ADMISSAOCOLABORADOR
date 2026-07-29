<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { maskPhoneInput, onlyDigits } from '@/utils/masks'
import type { EmployeeApplicationDraft } from '@/types/employee'

const props = defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()

const phoneProxy = computed({
  get: () => maskPhoneInput(props.draft.mobilePhone ?? ''),
  set: (value: string) => {
    props.draft.mobilePhone = onlyDigits(value) || null
  }
})

const emailProxy = computed({
  get: () => props.draft.email ?? '',
  set: (value: string) => {
    props.draft.email = value || null
  }
})
</script>

<template>
  <div>
    <BaseInput
      v-model="phoneProxy"
      label="Celular"
      type="tel"
      inputmode="numeric"
      autocomplete="tel"
      placeholder="(00) 00000-0000"
      :error="errors.mobilePhone"
    />
    <BaseInput
      v-model="emailProxy"
      label="E-mail"
      type="email"
      autocomplete="email"
      placeholder="nome@exemplo.com"
      :error="errors.email"
    />
  </div>
</template>
