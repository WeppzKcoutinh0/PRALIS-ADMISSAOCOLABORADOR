<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import wheatIcon from '@/assets/brand/icons/pralis-wheat-orange.png'
</script>

<template>
  <PublicLayout>
    <BaseCard class="home-card">
      <img :src="wheatIcon" alt="" class="home-card__icon" />
      <h1>Bem-vindo(a) à Pralís</h1>
      <p class="home-card__lead">
        Preencha seus dados com atenção e envie os documentos solicitados para iniciarmos
        seu processo de admissão.
      </p>

      <BaseAlert tone="info">
        Antes de começar, separe seus documentos pessoais (RG, CPF e comprovante de residência).
        Isso deixa o preenchimento mais rápido.
      </BaseAlert>

      <BaseAlert tone="warning">
        Seus dados pessoais serão usados exclusivamente para o processo de admissão na
        Padaria Pralís, em conformidade com a LGPD. Você poderá revisar tudo antes de enviar.
      </BaseAlert>

      <RouterLink :to="{ name: 'start-registration' }" class="home-card__cta">
        <BaseButton full-width>Iniciar cadastro</BaseButton>
      </RouterLink>
    </BaseCard>
  </PublicLayout>
</template>

<style scoped>
.home-card {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}
.home-card__icon {
  width: 64px;
  margin: 0 auto var(--pralis-space-4);
}
.home-card__lead {
  font-size: 1.05rem;
}
.home-card__cta {
  display: block;
  margin-top: var(--pralis-space-5);
  text-decoration: none;
}
</style>
