<script setup lang="ts">
import logoOrange from '@/assets/brand/logos/pralis-logo-primary-orange.png'
</script>

<template>
  <div class="public-layout">
    <header class="public-header">
      <div class="container public-header__inner">
        <img :src="logoOrange" alt="Padaria Pralís" class="public-header__logo" />
      </div>
    </header>

    <main class="public-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="public-footer">
      <div class="container public-footer__inner">
        <p>Padaria Pralís</p>
        <p>Seus dados são usados exclusivamente para o processo de admissão.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--pralis-background);
  background-image: radial-gradient(circle at top right, var(--pralis-primary-tint) 0%, transparent 55%);
}

.public-header {
  background-color: var(--pralis-surface);
  border-bottom: 1px solid var(--pralis-border);
}

.public-header__inner {
  height: var(--pralis-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.public-header__logo {
  height: 34px;
  width: auto;
}

.public-main {
  flex: 1;
  padding: var(--pralis-space-6) 0 var(--pralis-space-8);
}

.public-footer {
  border-top: 1px solid var(--pralis-border);
  padding: var(--pralis-space-5) 0;
}

.public-footer__inner p {
  margin: 0;
  font-size: 0.78rem;
  color: var(--pralis-text-muted);
  text-align: center;
}
</style>
