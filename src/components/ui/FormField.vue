<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="fieldId"
      :class="[
        'block text-sm font-medium',
        error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <slot />
    </div>
    
    <!-- Hint slot takes priority over help prop -->
    <div v-if="$slots.hint && !error" class="text-xs text-gray-500 dark:text-gray-400">
      <slot name="hint" />
    </div>
    
    <p v-else-if="help && !error" class="text-xs text-gray-500 dark:text-gray-400">
      {{ help }}
    </p>
    
    <p v-if="error" class="text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  help?: string
  required?: boolean
  id?: string
}

const props = defineProps<Props>()

const fieldId = computed(() => {
  return props.id || `field-${Math.random().toString(36).substr(2, 9)}`
})
</script>