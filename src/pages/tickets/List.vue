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

import { useTickets } from '@/composables/useTickets'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { getTickets, tickets } = useTickets()

// The URL (?page=N) is the source of truth: every change refetches the tickets
const currentPage = computed(() => Number(route.query.page) || 1)
watch(currentPage, (page) => getTickets(page), { immediate: true })

const goToPage = (page: number) => {
  router.push({ query: { ...route.query, page: page > 1 ? page : undefined } })
}

// meta.links wraps the pages with "« Previous" and "Next »"; keep only page numbers and ellipses
const pageLinks = computed(() => tickets.value?.meta.links.slice(1, -1) ?? [])
</script>
<template>
  <div>Tabla de Tickets</div>
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
        <TableCell class="text-right"></TableCell>
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
