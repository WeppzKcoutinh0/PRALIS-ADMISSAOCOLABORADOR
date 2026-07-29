<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { formatFileSize } from '@/utils/formatters'
import type { DocumentTypeConfig } from '@/config/documentTypes'
import type { DocumentUploadState } from '@/types/documents'

defineProps<{ config: DocumentTypeConfig; state: DocumentUploadState }>()
const emit = defineEmits<{ upload: [file: File]; remove: [documentId: string] }>()

const inputRef = ref<HTMLInputElement | null>(null)

function openPicker() {
  inputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('upload', file)
  input.value = ''
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('upload', file)
}
</script>

<template>
  <div class="doc-item" :class="{ 'doc-item--success': state.uploads.length > 0, 'doc-item--error': state.status === 'error' }">
    <div class="doc-item__header">
      <div>
        <p class="doc-item__label">
          {{ config.label }}
          <span v-if="config.required" class="doc-item__required" aria-hidden="true">*</span>
        </p>
        <p v-if="config.helpText" class="doc-item__help">{{ config.helpText }}</p>
      </div>
      <BaseBadge v-if="state.uploads.length > 0" tone="success">
        {{ state.uploads.length > 1 ? `${state.uploads.length} enviados` : 'Enviado' }}
      </BaseBadge>
      <BaseBadge v-else-if="config.required" tone="warning">Obrigatório</BaseBadge>
      <BaseBadge v-else tone="neutral">Opcional</BaseBadge>
    </div>

    <ul v-if="state.uploads.length" class="doc-item__files">
      <li v-for="doc in state.uploads" :key="doc.id" class="doc-item__file">
        <span class="doc-item__file-name">{{ doc.originalFileName }} · {{ formatFileSize(doc.fileSize) }}</span>
        <BaseButton variant="ghost" size="sm" type="button" @click="emit('remove', doc.id)">Remover</BaseButton>
      </li>
    </ul>

    <div
      v-if="state.uploads.length === 0"
      class="doc-item__dropzone"
      @dragover.prevent
      @drop="onDrop"
      @click="openPicker"
    >
      <p v-if="state.status === 'uploading'">Enviando… {{ state.progress }}%</p>
      <p v-else>Toque para escolher um arquivo ou arraste aqui<br /><small>PDF, JPG ou PNG · até {{ config.maxSizeMb }}MB</small></p>
    </div>
    <BaseButton
      v-else
      variant="secondary"
      size="sm"
      type="button"
      class="doc-item__add-more"
      :loading="state.status === 'uploading'"
      @click="openPicker"
    >
      + Adicionar mais um arquivo
    </BaseButton>

    <input
      ref="inputRef"
      type="file"
      class="visually-hidden"
      :accept="config.acceptedMimeTypes.join(',')"
      @change="onFileChange"
    />

    <p v-if="state.errorMessage" class="doc-item__error" role="alert">{{ state.errorMessage }}</p>
  </div>
</template>

<style scoped>
.doc-item {
  border: 1.5px solid var(--pralis-border-strong);
  border-radius: var(--pralis-radius-md);
  padding: var(--pralis-space-4);
  margin-bottom: var(--pralis-space-3);
}
.doc-item--success {
  border-color: var(--pralis-success);
  background: var(--pralis-success-tint);
}
.doc-item--error {
  border-color: var(--pralis-danger);
}
.doc-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--pralis-space-2);
  margin-bottom: var(--pralis-space-2);
}
.doc-item__label {
  margin: 0;
  font-weight: 700;
  color: var(--pralis-text-primary);
}
.doc-item__required {
  color: var(--pralis-primary-dark);
}
.doc-item__help {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--pralis-text-muted);
}
.doc-item__files {
  list-style: none;
  margin: 0 0 var(--pralis-space-2);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.doc-item__file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pralis-space-2);
  padding: 8px 12px;
  border-radius: var(--pralis-radius-sm);
  background: var(--pralis-surface);
  border: 1px solid var(--pralis-border);
  font-size: 0.85rem;
}
.doc-item__file-name {
  overflow-wrap: anywhere;
}
.doc-item__dropzone {
  border: 2px dashed var(--pralis-border-strong);
  border-radius: var(--pralis-radius-sm);
  padding: var(--pralis-space-4);
  text-align: center;
  cursor: pointer;
  color: var(--pralis-text-secondary);
  font-size: 0.9rem;
  background: var(--pralis-surface-alt);
}
.doc-item__dropzone:hover {
  border-color: var(--pralis-primary);
}
.doc-item__add-more {
  width: 100%;
}
.doc-item__error {
  margin: 8px 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pralis-danger);
}
</style>
