import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/public/HomePage.vue')
    },
    {
      path: '/cadastro/iniciar',
      name: 'start-registration',
      component: () => import('@/pages/public/StartRegistrationPage.vue')
    },
    {
      path: '/cadastro/:token',
      name: 'employee-form',
      component: () => import('@/pages/public/EmployeeFormPage.vue'),
      props: true
    },
    {
      path: '/cadastro/:token/revisao',
      name: 'employee-review',
      component: () => import('@/pages/public/ReviewPage.vue'),
      props: true
    },
    {
      path: '/cadastro/:token/sucesso',
      name: 'employee-success',
      component: () => import('@/pages/public/SuccessPage.vue'),
      props: true
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue')
    },

    {
      path: '/dp',
      name: 'dp-dashboard',
      component: () => import('@/pages/dp/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dp/cadastros',
      name: 'dp-applications',
      component: () => import('@/pages/dp/ApplicationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dp/cadastros/:id',
      name: 'dp-application-detail',
      component: () => import('@/pages/dp/ApplicationDetailPage.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/dp/cadastros/:id/interno',
      name: 'dp-application-internal',
      component: () => import('@/pages/dp/ApplicationInternalFormPage.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/dp/cadastros/:id/questor',
      name: 'dp-application-questor',
      component: () => import('@/pages/dp/QuestorOutputPage.vue'),
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/public/NotFoundPage.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authStore = useAuthStore()
  if (!authStore.isInitialized) {
    await authStore.init()
  }

  if (!authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
