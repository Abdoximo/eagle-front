<template>
  <button
    type="button"
    :class="[
      'flex w-full items-center px-3 py-2 text-sm',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
      'text-left transition-colors duration-150',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      variant === 'destructive' ? 'text-red-600 hover:text-red-700' : 'text-gray-700 dark:text-gray-200'
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  variant?: 'default' | 'destructive'
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'default'
})

const emit = defineEmits<Emits>()
</script> 