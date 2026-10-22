<script setup lang="ts">
import { Ticket } from '@lucide/vue'
</script>

<template>
  <div
    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
  >
    <Ticket class="size-4" />
  </div>
  <div class="grid flex-1 text-left text-sm leading-tight">
    <span class="truncate font-medium"> Tickets App </span>
    <span class="truncate text-xs">Company</span>
  </div>
</template>
