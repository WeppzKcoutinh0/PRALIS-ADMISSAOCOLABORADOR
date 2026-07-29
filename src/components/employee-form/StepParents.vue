<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { EmployeeApplicationDraft } from '@/types/employee'

const props = defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()

const fatherNameProxy = computed({
  get: () => props.draft.fatherName ?? '',
  set: (value: string) => {
    props.draft.fatherName = value || null
  }
})
</script>

<template>
  <div>
    <BaseInput v-model="draft.motherName" label="Nome da mãe" required :error="errors.motherName" />
    <BaseInput v-model="fatherNameProxy" label="Nome do pai" :error="errors.fatherName" help-text="Deixe em branco se não aplicável." />
  </div>
</template>
