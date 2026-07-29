<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import StepReview from '@/components/employee-form/StepReview.vue'
import { useApplicationForm } from '@/composables/useApplicationForm'
import { useDocumentUpload } from '@/composables/useDocumentUpload'

const props = defineProps<{ token: string }>()
const router = useRouter()

const form = useApplicationForm(props.token)
const upload = useDocumentUpload(props.token, [])

onMounted(async () => {
  await form.loadDraft()
  if (form.status.value && form.status.value !== 'draft') {
    router.replace({ name: 'employee-success', params: { token: props.token } })
    return
  }
  upload.syncDocuments(form.documents.value)
})

function handleEditStep(stepId: string) {
  router.push({ name: 'employee-form', params: { token: props.token }, query: { step: stepId } })
}

async function handleSubmit() {
  const success = await form.finalSubmit()
  if (success) {
    router.replace({ name: 'employee-success', params: { token: props.token } })
  }
}
</script>

<template>
  <PublicLayout>
    <BaseCard class="review-card">
      <BaseSpinner v-if="form.isLoading.value" label="Carregando revisão..." />
      <BaseAlert v-else-if="form.loadError.value" tone="danger">{{ form.loadError.value }}</BaseAlert>
      <template v-else>
        <h1>Revisão e confirmação</h1>
        <p>Confira tudo com calma antes de enviar para o Departamento Pessoal.</p>

        <BaseAlert v-if="form.submitError.value" tone="danger">{{ form.submitError.value }}</BaseAlert>

        <StepReview :draft="form.draft" :document-state="upload.state" @edit-step="handleEditStep" />

        <BaseButton full-width :loading="form.isSaving.value" @click="handleSubmit">
          Enviar cadastro para o Departamento Pessoal
        </BaseButton>
      </template>
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.review-card {
  max-width: 560px;
  margin: 0 auto;
}
</style>
