<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import FormWizard from '@/components/employee-form/FormWizard.vue'
import { useApplicationForm } from '@/composables/useApplicationForm'
import { useDocumentUpload } from '@/composables/useDocumentUpload'

const props = defineProps<{ token: string }>()
const router = useRouter()
const route = useRoute()

const form = useApplicationForm(props.token)
const upload = useDocumentUpload(props.token, form.documents.value)

onMounted(async () => {
  await form.loadDraft()
  if (form.status.value && form.status.value !== 'draft') {
    router.replace({ name: 'employee-success', params: { token: props.token } })
    return
  }
  // recria o estado de upload agora que os documentos ja carregados chegaram
  upload.syncDocuments(form.documents.value)

  const requestedStep = route.query.step
  if (typeof requestedStep === 'string') {
    const index = form.steps.findIndex((s) => s.id === requestedStep)
    if (index >= 0) form.goToStep(index)
  }
})

watch(
  () => form.status.value,
  (status) => {
    if (status && status !== 'draft') {
      router.replace({ name: 'employee-success', params: { token: props.token } })
    }
  }
)

function goToReview() {
  router.push({ name: 'employee-review', params: { token: props.token } })
}
</script>

<template>
  <PublicLayout>
    <BaseCard class="form-card">
      <BaseSpinner v-if="form.isLoading.value" label="Carregando seu cadastro..." />
      <BaseAlert v-else-if="form.loadError.value" tone="danger">{{ form.loadError.value }}</BaseAlert>
      <FormWizard v-else :form="form" :upload="upload" @go-to-review="goToReview" />
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.form-card {
  max-width: 560px;
  margin: 0 auto;
}
</style>
