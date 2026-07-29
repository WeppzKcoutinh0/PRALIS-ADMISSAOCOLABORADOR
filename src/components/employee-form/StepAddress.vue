<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import { useAddressLookup } from '@/composables/useAddressLookup'
import { stateOptions } from '@/config/options'
import { maskCepInput, onlyDigits } from '@/utils/masks'
import type { EmployeeApplicationDraft } from '@/types/employee'

const props = defineProps<{ draft: EmployeeApplicationDraft; errors: Record<string, string> }>()
const { isLoading, notFound, errorMessage, lookup } = useAddressLookup()

const cepDisplay = computed({
  get: () => maskCepInput(props.draft.postalCode),
  set: async (value: string) => {
    props.draft.postalCode = onlyDigits(value)
    if (onlyDigits(value).length === 8) {
      const result = await lookup(value)
      if (result) {
        props.draft.street = result.street || props.draft.street
        props.draft.district = result.district || props.draft.district
        props.draft.city = result.city || props.draft.city
        props.draft.state = result.state || props.draft.state
      }
    }
  }
})

function nullableStringProxy(key: 'addressComplement' | 'district' | 'city') {
  return computed({
    get: () => props.draft[key] ?? '',
    set: (value: string) => {
      props.draft[key] = value
    }
  })
}

const addressComplementProxy = nullableStringProxy('addressComplement')
const districtProxy = nullableStringProxy('district')
const cityProxy = nullableStringProxy('city')
</script>

<template>
  <div>
    <BaseInput
      v-model="cepDisplay"
      label="CEP"
      required
      inputmode="numeric"
      placeholder="00000-000"
      help-text="Digite o CEP para preenchermos o endereço automaticamente."
      :error="errors.postalCode"
    />
    <BaseAlert v-if="isLoading" tone="info">Buscando endereço pelo CEP…</BaseAlert>
    <BaseAlert v-if="notFound" tone="warning">
      Não encontramos esse CEP. Você pode preencher o endereço manualmente abaixo.
    </BaseAlert>
    <BaseAlert v-if="errorMessage" tone="warning">{{ errorMessage }}</BaseAlert>

    <BaseInput v-model="draft.street" label="Endereço" required :error="errors.street" />

    <div class="row">
      <BaseInput v-model="draft.addressNumber" label="Número" required placeholder="Ex: 123 ou S/N" :error="errors.addressNumber" />
      <BaseInput v-model="addressComplementProxy" label="Complemento" placeholder="Apto, bloco..." :error="errors.addressComplement" />
    </div>

    <div class="row">
      <BaseInput v-model="districtProxy" label="Bairro" :error="errors.district" />
      <BaseInput v-model="cityProxy" label="Cidade" :error="errors.city" />
    </div>

    <BaseSelect v-model="draft.state" label="Estado" required :options="stateOptions" :error="errors.state" />
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 var(--pralis-space-3);
}
@media (min-width: 560px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
