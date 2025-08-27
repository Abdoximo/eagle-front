<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <!-- Error Message -->
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('errors.boundary.title', 'Something went wrong') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('errors.boundary.message', 'An unexpected error occurred. Please try refreshing the page.') }}
        </p>
        
        <!-- Error Details (Development Only) -->
        <div v-if="isDevelopment && errorInfo" class="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded text-left">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Error Details:</h4>
          <pre class="text-xs text-gray-600 dark:text-gray-300 overflow-auto">{{ errorInfo }}</pre>
        </div>
        
        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="retry"
            type="button"
            class="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {{ $t('errors.boundary.retry', 'Try Again') }}
          </button>
          <button
            @click="goHome"
            type="button"
            class="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            {{ $t('errors.boundary.home', 'Go Home') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hasError = ref(false)
const errorInfo = ref<string>('')
const isDevelopment = import.meta.env.DEV

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorInfo.value = `${err.message}\n\nComponent: ${instance?.$options.name || 'Unknown'}\nInfo: ${info}`
  
  // Log error in development
  if (isDevelopment) {
    // Only log in development mode
  }
  
  // Report error to monitoring service in production
  if (!isDevelopment) {
    // Add your error reporting service here (e.g., Sentry)
  }
  
  return false // Prevent the error from propagating further
})

const retry = () => {
  hasError.value = false
  errorInfo.value = ''
  // Force component re-render
  window.location.reload()
}

const goHome = () => {
  hasError.value = false
  errorInfo.value = ''
  router.push('/')
}
</script>
