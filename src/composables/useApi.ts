import { useAuthStore } from '@/stores/auth'
import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    // Keep the response body on errors (e.g. 422 validation errors)
    updateDataOnError: true,
    beforeFetch: ({ options }) => {
      const auth = useAuthStore()
      const headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')
      if (auth.token) {
        headers.set('Authorization', `Bearer ${auth.token}`)
      }
      options.headers = headers

      return { options }
    },
    onFetchError: (ctx) => {
      // Expired or revoked token: drop the local session
      if (ctx.response?.status === 401) {
        useAuthStore().clearSession()
      }

      return ctx
    },
  },
})
