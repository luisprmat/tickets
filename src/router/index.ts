import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/tickets/List.vue'),
          meta: { title: 'List' },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/pages/About.vue'),
          meta: { title: 'About' },
        },
        {
          path: ':id/edit',
          name: 'edit',
          component: () => import('@/pages/tickets/Edit.vue'),
          meta: { title: 'Edit' },
        },
      ],
    },
    {
      path: '/',
      component: AuthLayout,
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/auth/Login.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Load the authenticated user once per session (e.g. after a page reload)
  if (auth.isAuthenticated && !auth.user) {
    await auth.getUser()
  }

  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.matched.some((r) => r.meta.guestOnly) && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
