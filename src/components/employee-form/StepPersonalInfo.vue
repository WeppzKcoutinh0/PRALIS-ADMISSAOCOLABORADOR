<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { sexOptions, raceColorOptions, maritalStatusOptions, educationLevelOptions, stateOptions } from '@/config/options'
import type { EmployeeApplicationDraft } from '@/types/employee'

defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()
</script>

<template>
  <div>
    <BaseSelect v-model="draft.sex" label="Sexo" required :options="sexOptions" :error="errors.sex" />
    <BaseSelect v-model="draft.raceColor" label="Raça/Cor" required :options="raceColorOptions" :error="errors.raceColor" />
    <BaseSelect v-model="draft.maritalStatus" label="Estado civil" required :options="maritalStatusOptions" :error="errors.maritalStatus" />
    <BaseSelect v-model="draft.educationLevel" label="Grau de instrução" required :options="educationLevelOptions" :error="errors.educationLevel" />
    <BaseSelect
      v-model="draft.birthplace"
      label="Naturalidade"
      required
      help-text="Estado onde você nasceu."
      :options="stateOptions"
      :error="errors.birthplace"
    />
    <BaseInput v-model="draft.nationality" label="Nacionalidade" required placeholder="Brasileira" :error="errors.nationality" />
  </div>
</template>
