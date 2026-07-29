<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import StepIdentification from './StepIdentification.vue'
import StepPersonalDocuments from './StepPersonalDocuments.vue'
import StepAddress from './StepAddress.vue'
import StepPersonalInfo from './StepPersonalInfo.vue'
import StepParents from './StepParents.vue'
import StepContact from './StepContact.vue'
import StepDocumentsUpload from './StepDocumentsUpload.vue'
import type { useApplicationForm } from '@/composables/useApplicationForm'
import type { useDocumentUpload } from '@/composables/useDocumentUpload'

// O wizard cobre as 7 primeiras etapas (dados + documentos). A 8ª etapa
// ("Revisão e confirmação") vive em sua própria rota/página
// (/cadastro/:token/revisao), conforme o fluxo oficial do portal.
const LAST_WIZARD_STEP_ID = 'documents-upload'

const props = defineProps<{
  form: ReturnType<typeof useApplicationForm>
  upload: ReturnType<typeof useDocumentUpload>
}>()

const emit = defineEmits<{ 'go-to-review': [] }>()

const stepComponents: Record<string, unknown> = {
  identification: StepIdentification,
  'personal-documents': StepPersonalDocuments,
  address: StepAddress,
  'personal-info': StepPersonalInfo,
  parents: StepParents,
  contact: StepContact,
  'documents-upload': StepDocumentsUpload
}

const currentComponent = computed(() => stepComponents[props.form.currentStep.value.id])
const isLastWizardStep = computed(() => props.form.currentStep.value.id === LAST_WIZARD_STEP_ID)

async function handleContinue() {
  if (isLastWizardStep.value) {
    const missing = props.upload.requiredDocumentsMissing()
    if (missing.length > 0) {
      props.form.submitError.value = `Envie os documentos obrigatórios: ${missing.join(', ')}.`
      return
    }
    props.form.submitError.value = null
    props.form.isSaving.value = true
    try {
      await props.form.persistDraft()
      emit('go-to-review')
    } finally {
      props.form.isSaving.value = false
    }
    return
  }

  await props.form.goNext()
}
</script>

<template>
  <div class="wizard">
    <ProgressBar
      :percent="form.progressPercent.value"
      :current-step="form.currentStepIndex.value + 1"
      :total-steps="form.steps.length"
      :step-title="form.currentStep.value.shortTitle"
    />

    <h2>{{ form.currentStep.value.title }}</h2>
    <p class="wizard__description">{{ form.currentStep.value.description }}</p>

    <BaseAlert v-if="form.submitError.value" tone="danger">{{ form.submitError.value }}</BaseAlert>

    <form class="wizard__form" @submit.prevent="handleContinue">
      <component
        :is="currentComponent"
        v-if="form.currentStep.value.id !== 'documents-upload'"
        :draft="form.draft"
        :errors="form.errors"
      />
      <StepDocumentsUpload v-else :upload="upload" />

      <div class="wizard__actions">
        <BaseButton
          v-if="!form.isFirstStep.value"
          type="button"
          variant="secondary"
          @click="form.goBack()"
        >
          Voltar
        </BaseButton>
        <BaseButton type="submit" variant="primary" :loading="form.isSaving.value" full-width>
          {{ isLastWizardStep ? 'Ir para a revisão' : 'Continuar' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.wizard__description {
  margin-top: -8px;
}
.wizard__actions {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--pralis-space-3);
  margin-top: var(--pralis-space-5);
}
@media (min-width: 560px) {
  .wizard__actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  .wizard__actions > :last-child {
    width: auto;
    min-width: 260px;
  }
}
</style>
