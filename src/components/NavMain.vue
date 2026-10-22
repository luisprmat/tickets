<script setup lang="ts">
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { LucideIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'

defineProps<{
  items: {
    title: string
    href: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Menú principal</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <SidebarMenuButton as-child :tooltip="item.title">
          <RouterLink :to="item.href">
            <component :is="item.icon" />
            <span>{{ item.title }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
