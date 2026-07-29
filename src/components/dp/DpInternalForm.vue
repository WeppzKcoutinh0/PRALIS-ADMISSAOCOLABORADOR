<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseRadioGroup from '@/components/base/BaseRadioGroup.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { contractTypeOptions } from '@/config/options'
import { maskDateInput, brDateToIso, isoDateToBr } from '@/utils/masks'
import { formatDateTimeBr } from '@/utils/formatters'
import type { useDpInternalForm } from '@/composables/useDpInternalForm'

const props = defineProps<{
  form: ReturnType<typeof useDpInternalForm>
  completedByName?: string | null
}>()

const emit = defineEmits<{ 'save-draft': []; finalize: [] }>()

const admissionDateProxy = ref(isoDateToBr(props.form.data.admissionDate))
watch(admissionDateProxy, (value) => {
  const masked = maskDateInput(value)
  if (value !== masked) {
    admissionDateProxy.value = masked
    return
  }
  props.form.data.admissionDate = brDateToIso(masked) ?? ''
})

function numberProxy(key: 'firstPeriodDays' | 'secondPeriodDays') {
  return computed({
    get: () => (props.form.data[key] === null ? '' : String(props.form.data[key])),
    set: (value: string) => {
      const digitsOnly = value.replace(/\D/g, '')
      props.form.data[key] = digitsOnly === '' ? null : Number(digitsOnly)
    }
  })
}
const firstPeriodProxy = numberProxy('firstPeriodDays')
const secondPeriodProxy = numberProxy('secondPeriodDays')

function boolRadioProxy(key: 'isTrustPosition' | 'isFirstJob') {
  return computed({
    get: () => (props.form.data[key] === null ? '' : String(props.form.data[key])),
    set: (value: string) => {
      props.form.data[key] = value === 'true'
    }
  })
}
const isTrustPositionProxy = boolRadioProxy('isTrustPosition')
const isFirstJobProxy = boolRadioProxy('isFirstJob')

const yesNoOptions = [
  { label: 'Sim', value: 'true' },
  { label: 'Não', value: 'false' }
]
</script>

<template>
  <div class="dp-form">
    <BaseAlert v-if="form.errors.value.length" tone="danger">
      <strong>Campos obrigatórios pendentes:</strong>
      <ul class="dp-form__error-list">
        <li v-for="err in form.errors.value" :key="err">{{ err }}</li>
      </ul>
    </BaseAlert>
    <BaseAlert v-if="form.saveError.value" tone="danger">{{ form.saveError.value }}</BaseAlert>

    <BaseInput v-model="form.data.jobFunction" label="Função" required placeholder="Ex: Padeiro, Atendente" />
    <BaseSelect v-model="form.data.contractType" label="Tipo de contrato" required :options="contractTypeOptions" />
    <BaseInput v-model="form.data.workSchedule" label="Escala de trabalho" required placeholder="Ex: 6x1, 5x2, 12x36" />
    <BaseInput
      v-model="form.data.transportVoucherSchedule"
      label="Escala de VT"
      required
      help-text="Escala usada para cálculo/concessão do vale-transporte."
    />
    <BaseInput v-model="admissionDateProxy" label="Data de admissão" required inputmode="numeric" placeholder="DD/MM/AAAA" />

    <div class="dp-form__row">
      <BaseInput
        v-model="firstPeriodProxy"
        label="Dias do 1º período"
        required
        inputmode="numeric"
        help-text="Primeiro período contratual ou de experiência."
      />
      <BaseInput
        v-model="secondPeriodProxy"
        label="Dias do 2º período"
        required
        inputmode="numeric"
        help-text="Segundo período contratual ou de experiência."
      />
    </div>

    <BaseRadioGroup v-model="isTrustPositionProxy" label="Cargo de confiança?" required :options="yesNoOptions" />
    <BaseRadioGroup v-model="isFirstJobProxy" label="Primeiro emprego?" required :options="yesNoOptions" />

    <p v-if="form.lastSavedAt.value || completedByName" class="dp-form__meta">
      <span v-if="completedByName">Responsável: {{ completedByName }} · </span>
      <span v-if="form.lastSavedAt.value">Último salvamento: {{ formatDateTimeBr(form.lastSavedAt.value) }}</span>
    </p>

    <div class="dp-form__actions">
      <BaseButton variant="secondary" :loading="form.isSaving.value" @click="emit('save-draft')">
        Salvar rascunho
      </BaseButton>
      <BaseButton :loading="form.isSaving.value" @click="emit('finalize')">
        Finalizar preenchimento do DP
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.dp-form__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0 var(--pralis-space-3);
}
@media (min-width: 560px) {
  .dp-form__row {
    grid-template-columns: 1fr 1fr;
  }
}
.dp-form__error-list {
  margin: 6px 0 0;
  padding-left: 18px;
}
.dp-form__meta {
  font-size: 0.78rem;
  color: var(--pralis-text-muted);
  margin: var(--pralis-space-2) 0;
}
.dp-form__actions {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: var(--pralis-space-3);
  margin-top: var(--pralis-space-4);
}
@media (min-width: 560px) {
  .dp-form__actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  .dp-form__actions :deep(.base-button) {
    white-space: normal;
  }
}
</style>
