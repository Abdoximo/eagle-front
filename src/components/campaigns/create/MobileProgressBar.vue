<template>
  <div class="w-full space-y-2">
    <!-- Step Info -->
    <div class="flex items-center justify-between">
      <div class="text-sm font-medium text-gray-900 dark:text-white">
        {{ currentStepLabel }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ currentStep + 1 }} of {{ totalSteps }}
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="relative">
      <!-- Background Bar -->
      <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <!-- Progress Fill -->
        <div
          :class="[
            'h-full rounded-full transition-all duration-500 ease-out',
            'bg-gradient-to-r from-blue-500 to-purple-500'
          ]"
          :style="{ width: `${progressPercentage}%` }"
        >
          <!-- Animated shine effect -->
          <div class="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
        </div>
      </div>
      
      <!-- Step Markers -->
      <div class="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
        <div
          v-for="(_, index) in Array.from({ length: totalSteps })"
          :key="index"
          :class="[
            'w-1.5 h-1.5 rounded-full transition-all duration-300',
            currentStep >= index
              ? 'bg-white shadow-sm'
              : 'bg-gray-400 dark:bg-gray-600'
          ]"
        ></div>
      </div>
    </div>
    
    <!-- Progress Percentage -->
    <div class="text-center">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ Math.round(progressPercentage) }}% Complete
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentStep: number
  totalSteps: number
  currentStepLabel: string
}

const props = defineProps<Props>()

const progressPercentage = computed(() => {
  return (props.currentStep / (props.totalSteps - 1)) * 100
})
</script>

<style scoped>
/* Shine animation for progress bar */
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine 2s infinite;
}

/* Smooth progress bar animation */
.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Step marker glow effect */
.bg-white {
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}
</style>