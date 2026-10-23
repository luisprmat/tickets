import { useApi } from '@/composables/useApi'
import type {
  LoginCredentials,
  LoginResponse,
  User,
  UserResponse,
  ValidationErrorResponse,
  ValidationErrors,
} from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: ValidationErrors,
  ) {
    super(message)
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<string | null>('auth_token', null)
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials) {
    const { data, error, statusCode } = await useApi('/login')
      .post(credentials)
      .json<LoginResponse | ValidationErrorResponse>()

    if (error.value) {
      if (statusCode.value === 422 && data.value && 'errors' in data.value) {
        throw new ValidationError(data.value.message, data.value.errors)
      }
      throw new Error('Could not log in, please try again')
    }

    token.value = (data.value as LoginResponse).token
    await getUser()
  }

  async function getUser() {
    const { data, error } = await useApi('/user').get().json<UserResponse>()
    user.value = error.value || !data.value ? null : data.value.data

    return user.value
  }

  async function logout() {
    // Revoke the token on the API; the local session is cleared even if it fails
    await useApi('/logout').delete()
    clearSession()
  }

  function clearSession() {
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, getUser, logout, clearSession }
})
