<template>
  <div
    :class="[
      'flex items-center p-3 rounded-lg border transition-all duration-200',
      variant === 'error' && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
      variant === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
      variant === 'info' && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    ]"
  >
    <!-- Icon -->
    <div class="flex-shrink-0 mr-3">
      <component
        :is="iconComponent"
        :class="[
          'w-5 h-5',
          variant === 'error' && 'text-red-600 dark:text-red-400',
          variant === 'warning' && 'text-yellow-600 dark:text-yellow-400',
          variant === 'info' && 'text-blue-600 dark:text-blue-400'
        ]"
      />
    </div>
    
    <!-- Content -->
    <div class="flex-1">
      <div
        v-if="title"
        :class="[
          'text-sm font-medium mb-1',
          variant === 'error' && 'text-red-800 dark:text-red-200',
          variant === 'warning' && 'text-yellow-800 dark:text-yellow-200',
          variant === 'info' && 'text-blue-800 dark:text-blue-200'
        ]"
      >
        {{ title }}
      </div>
      
      <div
        :class="[
          'text-sm',
          variant === 'error' && 'text-red-700 dark:text-red-300',
          variant === 'warning' && 'text-yellow-700 dark:text-yellow-300',
          variant === 'info' && 'text-blue-700 dark:text-blue-300'
        ]"
      >
        {{ message }}
      </div>
      
      <!-- Actions -->
      <div v-if="actions && actions.length > 0" class="mt-3 flex space-x-2">
        <button
          v-for="action in actions"
          :key="action.label"
          @click="action.onClick"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200',
            variant === 'error' && 'bg-red-600 text-white hover:bg-red-700',
            variant === 'warning' && 'bg-yellow-600 text-white hover:bg-yellow-700',
            variant === 'info' && 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
    
    <!-- Dismiss Button -->
    <button
      v-if="dismissible"
      @click="$emit('dismiss')"
      :class="[
        'flex-shrink-0 ml-3 p-1 rounded-md transition-colors duration-200',
        variant === 'error' && 'text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-800/30',
        variant === 'warning' && 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-800/30',
        variant === 'info' && 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-800/30'
      ]"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

interface Action {
  label: string
  onClick: () => void
}

interface Props {
  message: string
  title?: string
  variant?: 'error' | 'warning' | 'info'
  dismissible?: boolean
  actions?: Action[]
}

interface Emits {
  (e: 'dismiss'): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'error',
  dismissible: false
})

defineEmits<Emits>()

// Icon mapping based on variant
const iconComponent = computed(() => {
  switch (props.variant) {
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    case 'error':
    default:
      return AlertCircle
  }
})
</script>

<style scoped>
/* Smooth entrance animation */
.transition-all {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects for buttons */
button:hover {
  transform: translateY(-1px);
}

/* Focus states */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px currentColor;
}
</style>