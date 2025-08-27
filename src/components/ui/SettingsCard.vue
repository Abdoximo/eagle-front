<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ subtitle }}
          </p>
        </div>
        
        <!-- Action Button -->
        <button
          v-if="actionLabel"
          @click="$emit('action')"
          :disabled="loading"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
        >
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          <Plus v-else class="w-4 h-4 mr-2" />
          {{ actionLabel }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div v-if="loading && !$slots.content" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
      </div>
      
      <slot v-else name="content">
        <slot />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Loader2 } from 'lucide-vue-next'

interface Props {
  title: string
  subtitle?: string
  loading?: boolean
  actionLabel?: string
}

interface Emits {
  (e: 'action'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>