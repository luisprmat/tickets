<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Leave protected pages as soon as the session ends (logout or 401 from the API)
watch(
  () => auth.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated && route.matched.some((r) => r.meta.requiresAuth)) {
      router.replace({ name: 'login' })
    }
  },
)
</script>

<template>
  <RouterView />
</template>
