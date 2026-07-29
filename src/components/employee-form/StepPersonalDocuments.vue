<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import type { EmployeeApplicationDraft } from '@/types/employee'
import { maskCpfInput, maskDateInput, brDateToIso, isoDateToBr } from '@/utils/masks'
import { computed, ref, watch } from 'vue'

const props = defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()

const cpfDisplay = computed({
  get: () => maskCpfInput(props.draft.cpf),
  set: (value: string) => {
    props.draft.cpf = value.replace(/\D/g, '')
  }
})

const birthDateDisplay = ref(isoDateToBr(props.draft.birthDate))
watch(birthDateDisplay, (value) => {
  const masked = maskDateInput(value)
  if (value !== masked) {
    birthDateDisplay.value = masked
    return
  }
  props.draft.birthDate = brDateToIso(masked) ?? ''
})

const rgIssueDateDisplay = ref(isoDateToBr(props.draft.rgIssueDate))
watch(rgIssueDateDisplay, (value) => {
  const masked = maskDateInput(value)
  if (value !== masked) {
    rgIssueDateDisplay.value = masked
    return
  }
  props.draft.rgIssueDate = brDateToIso(masked)
})
</script>

<template>
  <div>
    <BaseInput
      v-model="cpfDisplay"
      label="CPF"
      required
      inputmode="numeric"
      placeholder="000.000.000-00"
      :error="errors.cpf"
    />
    <BaseInput
      v-model="birthDateDisplay"
      label="Data de nascimento"
      required
      inputmode="numeric"
      placeholder="DD/MM/AAAA"
      :error="errors.birthDate"
    />
    <BaseInput
      v-model="rgIssueDateDisplay"
      label="Data de emissão do RG"
      inputmode="numeric"
      placeholder="DD/MM/AAAA"
      help-text="Opcional. Preencha se tiver essa informação em mãos."
      :error="errors.rgIssueDate"
    />
  </div>
</template>
