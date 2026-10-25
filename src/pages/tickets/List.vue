<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTickets } from '@/composables/useTickets'
import type { TicketStatus } from '@/types'
import { PencilIcon } from '@lucide/vue'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { getTickets, tickets } = useTickets()

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

// SelectItem can't use an empty value, so "all" stands for "no filter"
const ALL_STATUSES = 'all'

// The URL (?page=N&status=X) is the source of truth: every change refetches the tickets
const currentPage = computed(() => Number(route.query.page) || 1)
const currentStatus = computed(
  () => statusOptions.find((option) => option.value === route.query.status)?.value,
)
watch([currentPage, currentStatus], ([page, status]) => getTickets(page, status), {
  immediate: true,
})

const goToPage = (page: number) => {
  router.push({ query: { ...route.query, page: page > 1 ? page : undefined } })
}

// Reads from and writes to the URL, so v-model doesn't duplicate the state
const selectedStatus = computed({
  get: () => currentStatus.value ?? ALL_STATUSES,
  // A new filter changes the result set, so go back to the first page
  set: (status) => {
    router.push({
      query: {
        ...route.query,
        page: undefined,
        status: status !== ALL_STATUSES ? status : undefined,
      },
    })
  },
})

// meta.links wraps the pages with "« Previous" and "Next »"; keep only page numbers and ellipses
const pageLinks = computed(() => tickets.value?.meta.links.slice(1, -1) ?? [])
</script>
<template>
  <div class="font-semibold text-xl">Tickets Table</div>
  <Separator />
  <form>
    <Select v-model="selectedStatus">
      <SelectTrigger>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem :value="ALL_STATUSES">All statuses</SelectItem>
        <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </form>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-25"> ID </TableHead>
        <TableHead>Subject</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right"> Actions </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="ticket in tickets?.data" :key="ticket.id">
        <TableCell class="font-medium">{{ ticket.id }}</TableCell>
        <TableCell>{{ ticket.subject }}</TableCell>
        <TableCell>{{ ticket.status }}</TableCell>
        <TableCell class="text-right">
          <Button variant="secondary" size="icon" as-child>
            <RouterLink :to="{ name: 'edit', params: { id: ticket.id } }">
              <PencilIcon />
            </RouterLink>
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <Pagination
    v-if="tickets && tickets.meta.last_page > 1"
    :page="tickets.meta.current_page"
    :total="tickets.meta.total"
    :items-per-page="tickets.meta.per_page"
    @update:page="goToPage"
  >
    <PaginationContent>
      <PaginationPrevious :disabled="!tickets.links.prev" />

      <template v-for="(link, index) in pageLinks" :key="index">
        <PaginationEllipsis v-if="link.page === null" />
        <PaginationItem v-else :value="link.page" :is-active="link.active">
          {{ link.label }}
        </PaginationItem>
      </template>

      <PaginationNext :disabled="!tickets.links.next" />
    </PaginationContent>
  </Pagination>
</template>
