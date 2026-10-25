import type { Paginated } from './pagination'

export type TicketStatus = 'open' | 'in_progress' | 'closed' | 'resolved'

export type Ticket = {
  id: number
  subject: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

export type PaginatedTickets = Paginated<Ticket>

export type TicketResponse = {
  data: Ticket
}

export type TicketPayload = Pick<Ticket, 'subject' | 'description'>
