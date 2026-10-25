import { useApi } from '@/composables/useApi'
import { ValidationError } from '@/stores/auth'
import type {
  ErrorResponse,
  PaginatedTickets,
  Ticket,
  TicketPayload,
  TicketResponse,
  TicketStatus,
  ValidationErrorResponse,
} from '@/types'
import { ref } from 'vue'

export const useTickets = () => {
  const tickets = ref<PaginatedTickets | null>(null)
  const ticket = ref<Ticket | null>(null)

  const getTickets = async (page = 1, status?: TicketStatus) => {
    const params = new URLSearchParams({ page: String(page) })
    if (status) {
      params.set('status', status)
    }

    const { data } = await useApi(`/tickets?${params}`).get().json<PaginatedTickets>()
    tickets.value = data.value
  }

  const getTicket = async (id: number | string) => {
    const { data, error } = await useApi(`/tickets/${id}`).get().json<TicketResponse>()

    if (error.value || !data.value) {
      ticket.value = null
      throw new Error('Could not load the ticket')
    }

    ticket.value = data.value.data
    return ticket.value
  }

  const updateTicket = async (id: number | string, payload: TicketPayload) => {
    const { data, error, statusCode } = await useApi(`/tickets/${id}`)
      .put(payload)
      .json<TicketResponse | ValidationErrorResponse>()

    if (error.value) {
      if (statusCode.value === 422 && data.value && 'errors' in data.value) {
        throw new ValidationError(data.value.message, data.value.errors)
      }
      if (statusCode.value === 403 && data.value && 'message' in data.value) {
        throw new Error(data.value.message)
      }
      throw new Error('Could not update the ticket, please try again')
    }

    ticket.value = (data.value as TicketResponse).data
    return ticket.value
  }

  const deleteTicket = async (id: number | string) => {
    const { data, response, statusCode } = await useApi(`/tickets/${id}`)
      .delete()
      .json<ErrorResponse>()

    // Rely on the HTTP status, not on `error`: the API answers with 204 No Content, and
    // parsing that empty body as JSON fails and sets `error` even though the delete succeeded
    if (!response.value?.ok) {
      if (statusCode.value === 403 && data.value?.message) {
        throw new Error(data.value.message)
      }
      throw new Error('Could not delete the ticket, please try again')
    }

    ticket.value = null
  }

  return {
    ticket,
    tickets,
    getTicket,
    getTickets,
    updateTicket,
    deleteTicket,
  }
}
