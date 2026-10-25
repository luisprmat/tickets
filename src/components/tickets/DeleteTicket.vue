<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useTickets } from '@/composables/useTickets'
import type { Ticket } from '@/types'
import { TrashIcon } from '@lucide/vue'
import { ref } from 'vue'

const props = defineProps<{ ticket: Ticket }>()
const emit = defineEmits<{ deleted: [] }>()

const { deleteTicket } = useTickets()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Don't show an error from a previous attempt when the dialog is reopened
const onOpenChange = (value: boolean) => {
  open.value = value
  if (value) error.value = null
}

const onConfirm = async () => {
  error.value = null
  loading.value = true
  try {
    await deleteTicket(props.ticket.id)
    open.value = false
    emit('deleted')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not delete the ticket'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogTrigger as-child>
      <Button variant="destructive" size="icon" :aria-label="`Delete ticket #${ticket.id}`">
        <TrashIcon />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete ticket #{{ ticket.id }}?</DialogTitle>
        <DialogDescription>
          "{{ ticket.subject }}" will be permanently deleted. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline" :disabled="loading">Cancel</Button>
        </DialogClose>
        <Button variant="destructive" :disabled="loading" @click="onConfirm">
          {{ loading ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
