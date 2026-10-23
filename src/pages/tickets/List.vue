<script setup lang="ts">
import { useTickets } from '@/composables/useTickets'
import { onMounted } from 'vue'

const { getTickets, tickets } = useTickets()
onMounted(getTickets)
</script>
<template>
  <div>Tabla de Tickets</div>
  <code>{{ tickets?.data }}</code>
</template>
