<script setup lang="ts">
import logoOrange from '@/assets/brand/logos/pralis-logo-primary-orange.png'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__card">
      <img :src="logoOrange" alt="Padaria Pralís" class="auth-layout__logo" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pralis-space-4);
  background-color: var(--pralis-accent-dark);
  background-image: radial-gradient(circle at 20% 20%, rgba(238, 116, 53, 0.35), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(179, 129, 11, 0.35), transparent 45%);
}
.auth-layout__card {
  width: 100%;
  max-width: 400px;
  background: var(--pralis-surface);
  border-radius: var(--pralis-radius-lg);
  padding: var(--pralis-space-6);
  box-shadow: var(--pralis-shadow-lg);
}
.auth-layout__logo {
  height: 40px;
  width: auto;
  margin: 0 auto var(--pralis-space-5);
  display: block;
}
</style>
