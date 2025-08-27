<template>
  <div :class="containerClasses">
    <div v-if="type === 'spinner'" :class="spinnerClasses"></div>
    
    <div v-else-if="type === 'dots'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        :class="dotClasses"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>
    
    <div v-else-if="type === 'pulse'" :class="pulseClasses"></div>
    
    <div v-else-if="type === 'skeleton'" class="space-y-2">
      <div v-for="i in lines" :key="i" class="skeleton h-4 w-full"></div>
    </div>
    
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  lines?: number
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'md',
  lines: 3,
  center: false
})

const containerClasses = computed(() => {
  const baseClasses = 'flex flex-col items-center'
  const centerClasses = props.center ? 'justify-center min-h-[200px]' : ''
  
  return [baseClasses, centerClasses].filter(Boolean).join(' ')
})

const spinnerClasses = computed(() => {
  const baseClasses = 'loading-spinner border-gray-300 border-t-primary'
  
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-4'
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const dotClasses = computed(() => {
  const baseClasses = 'bg-primary rounded-full animate-bounce'
  
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const pulseClasses = computed(() => {
  const baseClasses = 'bg-primary rounded-full animate-pulse'
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const textClasses = computed(() => {
  const baseClasses = 'mt-2 text-sm text-gray-600 dark:text-gray-400'
  return baseClasses
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>