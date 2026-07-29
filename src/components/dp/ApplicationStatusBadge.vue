<script setup lang="ts">
import BaseBadge from '@/components/base/BaseBadge.vue'
import { statusLabels, statusTone } from '@/config/status'
import type { ApplicationStatus } from '@/types/status'

const props = defineProps<{ status: ApplicationStatus }>()
</script>

<template>
  <BaseBadge :tone="statusTone[props.status]">{{ statusLabels[props.status] }}</BaseBadge>
</template>
