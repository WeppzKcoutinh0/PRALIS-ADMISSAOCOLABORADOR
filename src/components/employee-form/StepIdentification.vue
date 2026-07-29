<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import type { EmployeeApplicationDraft } from '@/types/employee'

defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()
</script>

<template>
  <div>
    <BaseInput
      v-model="draft.fullName"
      label="Nome completo"
      required
      autocomplete="name"
      placeholder="Digite seu nome completo"
      :error="errors.fullName"
    />
  </div>
</template>
