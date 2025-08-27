<template>
  <div class="select-field">
    <label 
      v-if="label" 
      :for="fieldId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="fieldId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Custom Arrow Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown 
          :class="[
            'h-4 w-4 transition-colors duration-200',
            error ? 'text-red-500' : 'text-gray-400'
          ]" 
        />
      </div>
      
      <!-- Loading Spinner -->
      <div 
        v-if="loading" 
        class="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none"
      >
        <Loader2 class="h-4 w-4 animate-spin text-blue-500" />
      </div>
    </div>
    
    <!-- Help Text -->
    <p v-if="helpText && !error" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
    
    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, Loader2 } from 'lucide-vue-next'
import type { SelectOption } from '@/types/settings'

interface Props {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  loading?: boolean
  error?: string
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'change', value: string | number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<Emits>()

const fieldId = ref(`select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-md shadow-sm transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'dark:bg-gray-700 dark:text-white',
    'appearance-none bg-white'
  ]

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 pr-8 text-sm',
    md: 'px-3 py-2 pr-10 text-sm',
    lg: 'px-4 py-3 pr-12 text-base'
  }

  // State classes
  if (props.error) {
    baseClasses.push(
      'border-red-300 dark:border-red-600',
      'focus:border-red-500 focus:ring-red-500'
    )
  } else {
    baseClasses.push(
      'border-gray-300 dark:border-gray-600',
      'focus:border-blue-500 focus:ring-blue-500'
    )
  }

  if (props.disabled) {
    baseClasses.push(
      'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
    )
  } else {
    baseClasses.push('hover:border-gray-400 dark:hover:border-gray-500')
  }

  return [
    ...baseClasses,
    sizeClasses[props.size]
  ].join(' ')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  let value: string | number | null = target.value

  // Convert to number if needed
  if (value !== '' && !isNaN(Number(value))) {
    value = Number(value)
  }
  
  // Handle empty value
  if (value === '') {
    value = null
  }

  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
/* Remove default select styling */
select {
  background-image: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Custom focus styles for better accessibility */
select:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Ensure consistent styling across browsers */
select::-ms-expand {
  display: none;
}

/* Firefox specific styles */
@-moz-document url-prefix() {
  select {
    text-indent: 0.01px;
    text-overflow: '';
  }
}

/* Safari specific styles */
select:focus {
  outline: none;
}

/* Dark mode option styling */
@media (prefers-color-scheme: dark) {
  select option {
    background-color: #374151;
    color: #ffffff;
  }
  
  select option:disabled {
    color: #6b7280;
  }
}

/* Disabled state styling */
select:disabled {
  color: #6b7280;
}

select:disabled option {
  color: #6b7280;
}

/* Loading state */
.select-field:has(select:disabled) .animate-spin {
  opacity: 0.5;
}

/* Hover effects */
select:not(:disabled):hover {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Focus effects */
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error state effects */
select.border-red-300:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>