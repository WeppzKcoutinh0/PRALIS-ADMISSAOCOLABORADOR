<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
        <div class="modal__header">
          <h2 class="modal__title">{{ title }}</h2>
          <button class="modal__close" type="button" aria-label="Fechar" @click="emit('close')">✕</button>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(52, 33, 28, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  padding: 0;
}
.modal {
  background: var(--pralis-surface);
  border-radius: var(--pralis-radius-lg) var(--pralis-radius-lg) 0 0;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--pralis-space-5);
  box-shadow: var(--pralis-shadow-lg);
}
@media (min-width: 640px) {
  .modal-overlay { align-items: center; padding: var(--pralis-space-5); }
  .modal { border-radius: var(--pralis-radius-lg); }
}
.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--pralis-space-4);
}
.modal__title {
  margin: 0;
  font-family: var(--pralis-font-primary);
  font-weight: 800;
  font-size: 1.1rem;
}
.modal__close {
  background: var(--pralis-surface-alt);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
}
.modal__footer {
  display: flex;
  gap: var(--pralis-space-3);
  margin-top: var(--pralis-space-5);
  flex-wrap: wrap;
}
</style>
