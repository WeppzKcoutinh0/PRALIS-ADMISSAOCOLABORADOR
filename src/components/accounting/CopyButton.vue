<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{ text: string; label?: string; size?: 'sm' | 'md' }>()
const emit = defineEmits<{ copied: [] }>()
const { copied, copy } = useClipboard()

async function handleClick() {
  await copy(props.text)
  emit('copied')
}
</script>

<template>
  <BaseButton :size="size ?? 'sm'" variant="secondary" type="button" @click="handleClick">
    {{ copied ? 'Copiado ✓' : (label ?? 'Copiar') }}
  </BaseButton>
</template>
