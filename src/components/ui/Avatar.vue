<template>
  <div :class="avatarClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt || name"
      :class="imageClasses"
      @error="onImageError"
    />
    <div v-else :class="initialsClasses">
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  name: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  size: 'md',
  shape: 'circle'
})

const imageError = ref(false)

const onImageError = () => {
  imageError.value = true
}

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  }
  return sizes[props.size]
})

const avatarClasses = computed(() => [
  'inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700',
  sizeClasses.value,
  props.shape === 'circle' ? 'rounded-full' : 'rounded-md'
])

const imageClasses = computed(() => [
  'h-full w-full object-cover',
  props.shape === 'circle' ? 'rounded-full' : 'rounded-md'
])

const initialsClasses = computed(() => [
  'font-medium text-gray-600 dark:text-gray-300'
])

const initials = computed(() => {
  if (!props.name) return '?'
  
  const names = props.name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return names[0][0].toUpperCase()
})
</script> 