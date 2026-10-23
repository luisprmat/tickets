<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import { House, Info } from '@lucide/vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'

import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Home',
      href: '/',
      icon: House,
    },
    {
      title: 'About',
      href: '/about',
      icon: Info,
    },
  ],
}
</script>

<template>
  <Sidebar collapsible="icon" variant="sidebar">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton size="lg" as-child>
          <RouterLink to="/">
            <AppLogo />
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser v-if="auth.user" :user="auth.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
