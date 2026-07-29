<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import logoOnBordo from '@/assets/brand/logos/pralis-logo-on-bordo.png'
import wheatIcon from '@/assets/brand/icons/pralis-wheat-gold.png'

const router = useRouter()
const { profile, signOut } = useAuth()
const menuOpen = ref(false)

async function handleSignOut() {
  await signOut()
  router.push({ name: 'login' })
}

const navItems: { to: { name: string }; label: string; icon: 'grid' | 'list' }[] = [
  { to: { name: 'dp-dashboard' }, label: 'Painel', icon: 'grid' },
  { to: { name: 'dp-applications' }, label: 'Cadastros', icon: 'list' }
]
</script>

<template>
  <div class="dp-layout">
    <header class="dp-topbar">
      <div class="dp-topbar__inner">
        <button class="dp-topbar__menu-btn" type="button" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
          ☰
        </button>
        <img :src="logoOnBordo" alt="Padaria Pralís" class="dp-topbar__logo" />
        <span class="dp-topbar__title">Departamento Pessoal</span>
        <div class="dp-topbar__spacer" />
        <div v-if="profile" class="dp-topbar__user">
          <span class="dp-topbar__user-name">{{ profile.fullName }}</span>
          <span class="dp-topbar__user-role">{{ profile.role.toUpperCase() }}</span>
        </div>
        <button class="dp-topbar__logout" type="button" @click="handleSignOut">Sair</button>
      </div>
    </header>

    <div class="dp-body">
      <nav class="dp-sidebar" :class="{ 'dp-sidebar--open': menuOpen }" aria-label="Navegação principal">
        <span class="dp-sidebar__label">Menu</span>

        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="dp-sidebar__link"
          @click="menuOpen = false"
        >
          <svg class="dp-sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="item.icon === 'grid'">
              <rect x="4" y="4" width="7" height="7" rx="1.5" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" />
              <rect x="13" y="13" width="7" height="7" rx="1.5" />
            </template>
            <template v-else>
              <line x1="8" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="8" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
              <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
            </template>
          </svg>
          {{ item.label }}
        </RouterLink>

        <div class="dp-sidebar__footer">
          <img :src="wheatIcon" alt="" class="dp-sidebar__footer-icon" />
          <span class="dp-sidebar__footer-text">Portal de<br />Admissão Pralís</span>
        </div>
      </nav>

      <main class="dp-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dp-layout {
  min-height: 100vh;
  background-color: var(--pralis-background);
}

.dp-topbar {
  background: var(--pralis-accent-dark);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 20;
}

.dp-topbar__inner {
  height: var(--pralis-header-height);
  display: flex;
  align-items: center;
  gap: var(--pralis-space-3);
  padding: 0 var(--pralis-space-4);
}

.dp-topbar__menu-btn {
  display: inline-flex;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.dp-topbar__logo {
  height: 26px;
  width: auto;
}

.dp-topbar__title {
  font-weight: 700;
  font-size: 0.9rem;
  display: none;
}

.dp-topbar__spacer {
  flex: 1;
}

.dp-topbar__user {
  display: none;
  flex-direction: column;
  text-align: right;
  line-height: 1.2;
  margin-right: var(--pralis-space-3);
}
.dp-topbar__user-name {
  font-size: 0.85rem;
  font-weight: 700;
}
.dp-topbar__user-role {
  font-size: 0.65rem;
  color: var(--pralis-primary-light);
  letter-spacing: 0.05em;
}

.dp-topbar__logout {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: var(--pralis-radius-pill);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  min-height: 38px;
}
.dp-topbar__logout:hover {
  background: rgba(255, 255, 255, 0.22);
}

.dp-body {
  display: flex;
}

.dp-sidebar {
  display: none;
  flex-direction: column;
  gap: 2px;
  width: 240px;
  padding: var(--pralis-space-4) var(--pralis-space-3);
  border-right: 1px solid var(--pralis-border);
  background: var(--pralis-surface);
  min-height: calc(100vh - var(--pralis-header-height));
}

.dp-sidebar--open {
  display: flex;
  position: fixed;
  top: var(--pralis-header-height);
  left: 0;
  bottom: 0;
  z-index: 15;
  box-shadow: var(--pralis-shadow-lg);
}

.dp-sidebar__label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pralis-text-muted);
  padding: 0 12px;
  margin-bottom: var(--pralis-space-2);
}

.dp-sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--pralis-radius-sm);
  color: var(--pralis-text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.dp-sidebar__link:hover {
  background: var(--pralis-surface-alt);
  color: var(--pralis-text-primary);
}
.dp-sidebar__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.dp-sidebar__link.router-link-active {
  background: var(--pralis-primary-tint);
  color: var(--pralis-primary-dark);
  border-left-color: var(--pralis-primary);
}
@media (prefers-reduced-motion: reduce) {
  .dp-sidebar__link {
    transition: none;
  }
}

.dp-sidebar__footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--pralis-space-4) 12px 4px;
  border-top: 1px solid var(--pralis-border);
}
.dp-sidebar__footer-icon {
  width: 22px;
  height: auto;
  opacity: 0.85;
  flex-shrink: 0;
}
.dp-sidebar__footer-text {
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--pralis-text-muted);
}

.dp-content {
  flex: 1;
  min-width: 0;
  padding: var(--pralis-space-4);
}

@media (min-width: 900px) {
  .dp-topbar__menu-btn { display: none; }
  .dp-topbar__title { display: inline; }
  .dp-topbar__user { display: flex; }
  .dp-sidebar { display: flex; }
  .dp-content { padding: var(--pralis-space-6); }
}
</style>
