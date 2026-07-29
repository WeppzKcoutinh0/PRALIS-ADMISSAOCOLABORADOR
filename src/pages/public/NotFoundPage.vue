<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <PublicLayout>
    <BaseCard class="not-found">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe ou não está mais disponível.</p>
      <RouterLink :to="{ name: 'home' }">
        <BaseButton>Voltar para o início</BaseButton>
      </RouterLink>
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.not-found {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}
</style>
