<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore, ValidationError } from '@/stores/auth'
import type { LoginCredentials, ValidationErrors } from '@/types'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive<LoginCredentials>({ email: '', password: '' })
const errors = ref<ValidationErrors>({})
const generalError = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  errors.value = {}
  generalError.value = null
  loading.value = true
  try {
    await auth.login(form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch (e) {
    if (e instanceof ValidationError) {
      errors.value = e.errors
    } else {
      generalError.value = e instanceof Error ? e.message : 'Could not log in'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
    <div class="mb-6 flex flex-col gap-1 text-center">
      <h1 class="text-xl font-semibold">Log in</h1>
      <p class="text-sm text-muted-foreground">Enter your credentials to continue</p>
    </div>
    <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          :aria-invalid="!!errors.email"
        />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email[0] }}</p>
      </div>
      <div class="grid gap-2">
        <label for="password" class="text-sm font-medium">Password</label>
        <Input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          :aria-invalid="!!errors.password"
        />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password[0] }}</p>
      </div>
      <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Log in' }}
      </Button>
    </form>
  </div>
</template>
