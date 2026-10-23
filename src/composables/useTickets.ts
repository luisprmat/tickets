import { useApi } from '@/composables/useApi'
import type { PaginatedTickets } from '@/types'
import { ref } from 'vue'

export const useTickets = () => {
  const tickets = ref<PaginatedTickets | null>(null)

  const getTickets = async (page = 1) => {
    const { data } = await useApi(`/tickets?page=${page}`).get().json<PaginatedTickets>()
    tickets.value = data.value
  }

  return {
    tickets,
    getTickets,
  }
}
