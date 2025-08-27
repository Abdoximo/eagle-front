<template>
  <div>
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <component
        v-if="leadingIcon"
        :is="leadingIcon"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <component
        v-if="trailingIcon"
        :is="trailingIcon"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />
    </div>
    
    <div v-if="error" class="text-sm text-red-600 dark:text-red-400 mt-1">{{ error }}</div>
    <div v-if="hint && !error" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  leadingIcon?: any
  trailingIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white'
  
  const stateClasses = props.error 
    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500'
    
  const disabledClasses = props.disabled 
    ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
    : 'bg-white dark:bg-gray-700'
    
  const iconClasses = []
  if (props.leadingIcon) iconClasses.push('pl-10')
  if (props.trailingIcon) iconClasses.push('pr-10')
  
  return [baseClasses, stateClasses, disabledClasses, ...iconClasses].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>