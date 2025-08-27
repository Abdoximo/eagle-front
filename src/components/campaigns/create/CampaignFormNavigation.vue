<template>
  <div class="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
    <!-- Left Side - Back Button -->
    <div>
      <button
        v-if="currentStep > 0"
        type="button"
        @click="$emit('previous')"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Previous
      </button>
      
      <button
        v-else
        type="button"
        @click="$emit('back')"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <X class="w-4 h-4 mr-2" />
        Cancel
      </button>
    </div>
    
    <!-- Right Side - Action Buttons -->
    <div class="flex items-center space-x-3">
      <!-- Save Draft Button -->
      <button
        type="button"
        @click="$emit('saveDraft')"
        :disabled="loading || !canSaveDraft"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <Save class="w-4 h-4 mr-2" />
        <span v-if="loading && isDraftAction">
          <Loader2 class="w-4 h-4 animate-spin" />
        </span>
        <span v-else>Save Draft</span>
      </button>
      
      <!-- Continue/Submit Button -->
      <button
        v-if="currentStep < totalSteps - 1"
        type="button"
        @click="$emit('next')"
        :disabled="loading || !canProceed"
        class="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Continue
        <ArrowRight class="w-4 h-4 ml-2" />
      </button>
      
      <button
        v-else
        type="submit"
        :disabled="loading || !canProceed"
        class="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      >
        <span v-if="loading && !isDraftAction" class="flex items-center">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          Creating...
        </span>
        <span v-else class="flex items-center">
          <Send class="w-4 h-4 mr-2" />
          {{ submitButtonText }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Save, 
  Send, 
  Loader2 
} from 'lucide-vue-next'

interface Props {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  loading: boolean
  isDraftAction?: boolean
  sendOption?: 'now' | 'later'
}

interface Emits {
  (e: 'back'): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'saveDraft'): void
  (e: 'submit'): void
}

const props = withDefaults(defineProps<Props>(), {
  isDraftAction: false,
  sendOption: 'now'
})

defineEmits<Emits>()

// Computed properties
const canSaveDraft = computed(() => {
  // Can save draft if at least name is provided
  return true // This would check form validity
})

const submitButtonText = computed(() => {
  if (props.sendOption === 'later') {
    return 'Schedule Campaign'
  }
  return 'Send Campaign'
})
</script>

<style scoped>
/* Add subtle animations for better UX */
button {
  transition: all 0.2s ease-in-out;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Gradient button hover effect */
.bg-gradient-to-r:hover {
  background-size: 110% 110%;
}
</style>