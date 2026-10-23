import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import type { PaginatedTickets } from '@/types'

export const useTickets = () => {
  const tickets = ref<PaginatedTickets | null>(null)

  const getTickets = async () => {
    const { data } = await useApi('/tickets').get().json<PaginatedTickets>()
    tickets.value = data.value
  }

  return {
    tickets,
    getTickets,
  }
}
