<template>
  <div :class="alertClasses" role="alert">
    <component :is="iconComponent" class="h-4 w-4" />
    <div class="flex-1">
      <h5 v-if="title" class="mb-1 font-medium leading-none tracking-tight">
        {{ title }}
      </h5>
      <div class="text-sm opacity-90">
        <slot>{{ message }}</slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      @click="$emit('dismiss')"
      class="ml-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <XMarkIcon class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false
})

defineEmits<{
  dismiss: []
}>()

const alertClasses = computed(() => {
  const baseClasses = 'relative w-full rounded-lg border p-4 flex items-center space-x-2'
  
  const variantClasses = {
    success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-400',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
  }
  
  return [baseClasses, variantClasses[props.variant]].join(' ')
})

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  }
  
  return icons[props.variant]
})
</script>