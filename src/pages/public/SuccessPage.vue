<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import wheatIcon from '@/assets/brand/icons/pralis-wheat-orange.png'
import { getApplicationByToken } from '@/services/publicApplicationService'

const props = defineProps<{ token: string }>()
const protocolNumber = ref<string | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    const result = await getApplicationByToken(props.token)
    protocolNumber.value = result.protocolNumber
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Não foi possível carregar a confirmação.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <PublicLayout>
    <BaseCard class="success-card">
      <BaseSpinner v-if="isLoading" />
      <BaseAlert v-else-if="errorMessage" tone="danger">{{ errorMessage }}</BaseAlert>
      <template v-else>
        <img :src="wheatIcon" alt="" class="success-card__icon" />
        <h1>Cadastro enviado com sucesso!</h1>
        <p>
          Obrigado por preencher seus dados. O Departamento Pessoal da Pralís já recebeu seu
          cadastro e vai dar continuidade ao seu processo de admissão.
        </p>
        <p v-if="protocolNumber" class="success-card__protocol">
          Número de protocolo: <strong>{{ protocolNumber }}</strong>
        </p>
        <BaseAlert tone="info">
          Guarde este número de protocolo. Se precisar entrar em contato com o Departamento
          Pessoal, ele ajuda a localizar seu cadastro mais rápido.
        </BaseAlert>
      </template>
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.success-card {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}
.success-card__icon {
  width: 56px;
  margin: 0 auto var(--pralis-space-4);
}
.success-card__protocol {
  font-size: 1.1rem;
  color: var(--pralis-text-primary);
}
</style>
