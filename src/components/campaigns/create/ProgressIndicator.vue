<template>
  <div class="hidden md:flex items-center space-x-2">
    <!-- Desktop Progress Steps -->
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="flex items-center"
    >
      <!-- Step Circle -->
      <div
        :class="[
          'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
          getStepClasses(index)
        ]"
      >
        <!-- Step Number or Check Icon -->
        <template v-if="currentStep > index">
          <Check class="w-5 h-5 text-white" />
        </template>
        <template v-else>
          {{ index + 1 }}
        </template>
        
        <!-- Active Step Pulse -->
        <div
          v-if="currentStep === index"
          class="absolute inset-0 rounded-full bg-blue-600 animate-pulse opacity-25"
        ></div>
      </div>
      
      <!-- Step Label (shown on hover) -->
      <div
        class="absolute top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
      >
        <div class="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
          {{ step.label }}
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
        </div>
      </div>
      
      <!-- Connector Line -->
      <div
        v-if="index < steps.length - 1"
        :class="[
          'w-16 h-0.5 mx-3 transition-all duration-300',
          currentStep > index
            ? 'bg-green-500 shadow-lg shadow-green-500/25'
            : currentStep === index
            ? 'bg-gradient-to-r from-blue-600 to-gray-300'
            : 'bg-gray-300 dark:bg-gray-600'
        ]"
      ></div>
    </div>
    
    <!-- Mobile Progress Bar -->
    <div class="md:hidden w-full">
      <MobileProgressBar 
        :current-step="currentStep"
        :total-steps="steps.length"
        :current-step-label="steps[currentStep]?.label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import MobileProgressBar from './MobileProgressBar.vue'

interface Step {
  key: string
  label: string
  description?: string
}

interface Props {
  currentStep: number
  steps: Step[]
}

const props = defineProps<Props>()

// Computed
const getStepClasses = (index: number) => {
  if (props.currentStep > index) {
    // Completed step
    return [
      'bg-green-500 text-white shadow-lg shadow-green-500/25',
      'ring-4 ring-green-100 dark:ring-green-900'
    ]
  } else if (props.currentStep === index) {
    // Current step
    return [
      'bg-blue-600 text-white shadow-lg shadow-blue-500/25',
      'ring-4 ring-blue-100 dark:ring-blue-900',
      'scale-110'
    ]
  } else {
    // Upcoming step
    return [
      'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
      'hover:bg-gray-300 dark:hover:bg-gray-600'
    ]
  }
}

const progressPercentage = computed(() => {
  return Math.round((props.currentStep / (props.steps.length - 1)) * 100)
})
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.1;
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Step hover effects */
.group:hover .step-tooltip {
  opacity: 1;
  transform: translateY(-8px);
}

/* Smooth transitions for all elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Connector line gradient animation */
.bg-gradient-to-r {
  background-size: 200% 100%;
  animation: slideGradient 2s infinite;
}

@keyframes slideGradient {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Ring glow effect */
.ring-4 {
  box-shadow: 0 0 0 4px currentColor;
}

/* Scale animation for current step */
.scale-110 {
  transform: scale(1.1);
}
</style>