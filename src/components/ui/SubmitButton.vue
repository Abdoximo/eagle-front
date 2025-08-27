<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <Loader2 
      v-if="loading" 
      :class="[
        'animate-spin',
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
        $slots.default ? 'mr-2' : ''
      ]" 
    />
    
    <!-- Icon (if provided and not loading) -->
    <component 
      v-else-if="icon" 
      :is="icon" 
      :class="[
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
        $slots.default ? 'mr-2' : ''
      ]"
    />
    
    <!-- Button Text -->
    <span v-if="$slots.default">
      <slot />
    </span>
    
    <!-- Loading Text Override -->
    <span v-else-if="loading && loadingText">
      {{ loadingText }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: any
  loadingText?: string
  fullWidth?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<Emits>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-all duration-200 ease-in-out',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'text-white bg-blue-600 border border-transparent',
      'hover:bg-blue-700 focus:ring-blue-500',
      'disabled:hover:bg-blue-600'
    ],
    secondary: [
      'text-gray-700 bg-gray-100 border border-gray-300',
      'hover:bg-gray-200 focus:ring-gray-500',
      'dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600',
      'dark:hover:bg-gray-600 dark:focus:ring-gray-400'
    ],
    danger: [
      'text-white bg-red-600 border border-transparent',
      'hover:bg-red-700 focus:ring-red-500',
      'disabled:hover:bg-red-600'
    ],
    outline: [
      'text-blue-700 bg-transparent border border-blue-300',
      'hover:bg-blue-50 focus:ring-blue-500',
      'dark:text-blue-400 dark:border-blue-400',
      'dark:hover:bg-blue-900/20'
    ]
  }

  // Full width class
  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...widthClasses
  ].join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Custom focus styles for better accessibility */
button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Ensure consistent height when loading */
button {
  min-height: fit-content;
}

/* Loading state animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hover effect enhancements */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  button:not(:disabled):hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  button:not(:disabled):active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}
</style>