<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="uiStore.sidebarCollapsed"
      :mobile-open="uiStore.mobileMenuOpen"
      @close-mobile="uiStore.closeMobileMenu"
    />

    <!-- Main content -->
    <div
      :class="[
        'transition-all duration-300',
        uiStore.sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      ]"
    >
      <!-- Header -->
      <Header />

      <!-- Page content -->
      <main class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumbs -->
          <Breadcrumbs
            v-if="uiStore.breadcrumbs.length > 0"
            :items="uiStore.breadcrumbs"
            class="mb-6"
          />

          <!-- Page content -->
          <router-view />
        </div>
      </main>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="uiStore.globalLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Loading size="lg" text="Loading..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import Loading from '@/components/ui/Loading.vue'

const uiStore = useUIStore()
const authStore = useAuthStore()

onMounted(() => {
  // Initialize UI state
  uiStore.initUI()
  
  // Auth is already initialized in main.ts
})
</script>