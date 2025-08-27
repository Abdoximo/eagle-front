<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Bounce Details</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Email Info -->
          <div class="mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">Email: <span class="font-medium text-gray-900 dark:text-white">{{ email.email }}</span></p>
          </div>

          <!-- Bounce Info -->
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Bounce Type</label>
              <p class="text-gray-900 dark:text-white">{{ email.bounce_type || 'Hard Bounce' }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
              <p class="text-gray-900 dark:text-white">{{ email.bounce_reason || 'Invalid email address' }}</p>
            </div>
            
            <div v-if="email.bounce_details">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
              <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">{{ email.bounce_details }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  email: any
}>()

defineEmits<{
  close: []
}>()
</script>
