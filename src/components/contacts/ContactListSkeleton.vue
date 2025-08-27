<template>
  <div class="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 animate-pulse">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <!-- Title skeleton -->
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        
        <!-- Contact count skeleton -->
        <div class="flex items-center mb-2">
          <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-1"></div>
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        
        <!-- Date skeleton -->
        <div class="flex items-center mb-3">
          <div class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded mr-1"></div>
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        
        <!-- Tags skeleton -->
        <div class="flex gap-1">
          <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-12"></div>
          <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
          <div class="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-8"></div>
        </div>
      </div>
      
      <!-- Selection indicator skeleton -->
      <div class="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for skeleton loader
</script>

<style scoped>
/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Skeleton shimmer effect */
.animate-pulse > * {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.dark .animate-pulse > * {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>