<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { startApplication } from '@/services/publicApplicationService'

const router = useRouter()
const errorMessage = ref<string | null>(null)

async function begin() {
  errorMessage.value = null
  try {
    const { token } = await startApplication()
    router.replace({ name: 'employee-form', params: { token } })
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : 'Não foi possível iniciar seu cadastro agora. Tente novamente.'
  }
}

onMounted(begin)
</script>

<template>
  <PublicLayout>
    <BaseCard class="start-card">
      <template v-if="errorMessage">
        <BaseAlert tone="danger">{{ errorMessage }}</BaseAlert>
        <BaseButton full-width @click="begin">Tentar novamente</BaseButton>
      </template>
      <template v-else>
        <BaseSpinner label="Preparando seu cadastro..." />
        <p class="start-card__text">Preparando seu cadastro…</p>
      </template>
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.start-card {
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}
.start-card__text {
  color: var(--pralis-text-secondary);
}
</style>
