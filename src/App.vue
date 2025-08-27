<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
// Import other layout components if you have them, e.g., AuthLayout.vue

const route = useRoute()

// Determine the current layout based on route meta
const currentLayout = computed(() => {
  // For auth routes (login, register, etc.), don't use any layout
  if (route.meta.layout === 'auth') {
    return null;
  }
  
  // Use AppLayout for routes requiring authentication or if no specific layout is defined
  if (route.meta.requiresAuth || !route.meta.layout) {
    return AppLayout;
  }
  
  // Default to no layout for other cases
  return null;
});
</script>

<template>
  <!-- Render with layout or without layout -->
  <AppLayout v-if="currentLayout === AppLayout">
    <router-view />
  </AppLayout>
  
  <!-- Render without layout for auth pages -->
  <router-view v-else />
</template>

<style>
/* Global styles can be added here */
/* Ensure your base HTML and body styles allow for full height/flexbox if needed by layouts */
html, body, #app {
  height: 100%;
}
</style>
