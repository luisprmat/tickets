<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useTickets } from '@/composables/useTickets'
import { ValidationError } from '@/stores/auth'
import type { TicketPayload, ValidationErrors } from '@/types'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const ticketId = computed(() => String(route.params.id))

const form = reactive<TicketPayload>({
  subject: '',
  description: '',
})

const errors = ref<ValidationErrors>({})
const generalError = ref<string | null>(null)
const fetching = ref(false)
const loading = ref(false)

const { getTicket, updateTicket } = useTickets()

// Fill the form with the current ticket data, also when navigating between tickets
watch(
  ticketId,
  async (id) => {
    errors.value = {}
    generalError.value = null
    fetching.value = true
    try {
      const ticket = await getTicket(id)
      form.subject = ticket.subject
      form.description = ticket.description
    } catch (e) {
      generalError.value = e instanceof Error ? e.message : 'Could not load the ticket'
    } finally {
      fetching.value = false
    }
  },
  { immediate: true },
)

const onSubmit = async () => {
  errors.value = {}
  generalError.value = null
  loading.value = true
  try {
    await updateTicket(ticketId.value, form)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch (e) {
    if (e instanceof ValidationError) {
      errors.value = e.errors
    } else {
      generalError.value = e instanceof Error ? e.message : 'Could not update the ticket'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="font-semibold text-xl">Edit Ticket: #{{ ticketId }}</div>
  <Separator />
  <form class="flex w-full max-w-md flex-col gap-4" novalidate @submit.prevent="onSubmit">
    <div class="grid gap-2">
      <label for="subject" class="text-sm font-medium">Subject</label>
      <Input
        id="subject"
        v-model="form.subject"
        :disabled="fetching"
        :aria-invalid="!!errors.subject"
      />
      <p v-if="errors.subject" class="text-sm text-destructive">{{ errors.subject[0] }}</p>
    </div>
    <div class="grid gap-2">
      <label for="description" class="text-sm font-medium">Description</label>
      <Textarea
        id="description"
        v-model="form.description"
        :disabled="fetching"
        :aria-invalid="!!errors.description"
      />
      <p v-if="errors.description" class="text-sm text-destructive">{{ errors.description[0] }}</p>
    </div>
    <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>
    <Button type="submit" class="self-start" :disabled="fetching || loading">
      {{ loading ? 'Updating...' : 'Update' }}
    </Button>
  </form>
</template>
