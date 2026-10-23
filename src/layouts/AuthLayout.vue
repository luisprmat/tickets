<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex items-center gap-2 self-center">
        <AppLogo />
      </div>
      <RouterView />
    </div>
  </div>
</template>
