<script setup lang="ts">
import BaseAlert from '@/components/base/BaseAlert.vue'
import DocumentUploadItem from '@/components/documents/DocumentUploadItem.vue'
import { documentTypes } from '@/config/documentTypes'
import type { useDocumentUpload } from '@/composables/useDocumentUpload'

defineProps<{ upload: ReturnType<typeof useDocumentUpload> }>()
</script>

<template>
  <div>
    <BaseAlert tone="info">
      Envie fotos nítidas ou arquivos PDF. Você pode remover e reenviar qualquer documento antes de concluir o cadastro.
    </BaseAlert>
    <div class="doc-list">
      <DocumentUploadItem
        v-for="config in documentTypes"
        :key="config.value"
        :config="config"
        :state="upload.state[config.value]"
        @upload="(file) => upload.uploadDocument(config.value, file)"
        @remove="(documentId) => upload.removeDocument(config.value, documentId)"
      />
    </div>
  </div>
</template>

<style scoped>
.doc-list {
  margin-top: var(--pralis-space-4);
}
</style>
