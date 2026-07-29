<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()
const { signIn, isLoading, error } = useAuth()

async function handleSubmit() {
  const ok = await signIn(email.value.trim().toLowerCase(), password.value)
  if (ok) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'dp-dashboard' }
    router.push(redirect as never)
  }
}
</script>

<template>
  <AuthLayout>
    <h1 class="login-title">Acesso do Departamento Pessoal</h1>
    <p class="login-subtitle">Entre com sua conta cadastrada para acessar o portal.</p>

    <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>

    <form @submit.prevent="handleSubmit">
      <BaseInput v-model="email" label="E-mail" type="email" required autocomplete="email" />
      <BaseInput v-model="password" label="Senha" type="password" required autocomplete="current-password" />
      <BaseButton type="submit" full-width :loading="isLoading">Entrar</BaseButton>
    </form>
  </AuthLayout>
</template>

<style scoped>
.login-title {
  text-align: center;
  font-size: 1.3rem;
}
.login-subtitle {
  text-align: center;
  margin-bottom: var(--pralis-space-5);
  font-size: 0.9rem;
}
</style>
