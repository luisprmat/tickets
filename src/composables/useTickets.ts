import { useApi } from '@/composables/useApi'
import type { PaginatedTickets, TicketStatus } from '@/types'
import { ref } from 'vue'

export const useTickets = () => {
  const tickets = ref<PaginatedTickets | null>(null)

  const getTickets = async (page = 1, status?: TicketStatus) => {
    const params = new URLSearchParams({ page: String(page) })
    if (status) {
      params.set('status', status)
    }

    const { data } = await useApi(`/tickets?${params}`).get().json<PaginatedTickets>()
    tickets.value = data.value
  }

  return {
    tickets,
    getTickets,
  }
}
