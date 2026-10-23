import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    beforeFetch: ({ options }) => {
      const headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_TOKEN}`)
      options.headers = headers

      return { options }
    },
  },
})
