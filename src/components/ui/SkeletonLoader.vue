<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
      widthClass,
      heightClass,
      customClass
    ]"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 'full',
  height: '4',
  rounded: 'md'
})

// Computed properties
const widthClass = computed(() => {
  if (typeof props.width === 'number') {
    return `w-${props.width}`
  }
  
  const widths: Record<string, string> = {
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    '1/4': 'w-1/4',
    '3/4': 'w-3/4',
    '20': 'w-20',
    '24': 'w-24',
    '32': 'w-32',
    '40': 'w-40',
    '48': 'w-48',
    '56': 'w-56',
    '64': 'w-64'
  }
  
  return widths[props.width] || `w-${props.width}`
})

const heightClass = computed(() => {
  if (typeof props.height === 'number') {
    return `h-${props.height}`
  }
  
  const heights: Record<string, string> = {
    '2': 'h-2',
    '3': 'h-3',
    '4': 'h-4',
    '5': 'h-5',
    '6': 'h-6',
    '8': 'h-8',
    '10': 'h-10',
    '12': 'h-12',
    '16': 'h-16',
    '20': 'h-20',
    '24': 'h-24',
    '32': 'h-32',
    '40': 'h-40',
    '48': 'h-48',
    '56': 'h-56',
    '64': 'h-64'
  }
  
  return heights[props.height] || `h-${props.height}`
})

const customClass = computed(() => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  
  return `${roundedClasses[props.rounded]} ${props.class || ''}`
})
</script>