<template>
  <div class="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between">
        <!-- Title Section -->
        <div class="flex items-center space-x-4">
          <button
            @click="$emit('back')"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Create Campaign
            </h1>
            <p class="mt-1 text-gray-600 dark:text-gray-400">
              Design and send beautiful email campaigns to your audience
            </p>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <ProgressIndicator 
          :current-step="currentStep"
          :steps="steps"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import ProgressIndicator from '@/components/campaigns/create/ProgressIndicator.vue'

interface Props {
  currentStep: number
  steps: Array<{ key: string; label: string }>
}

interface Emits {
  (e: 'back'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>