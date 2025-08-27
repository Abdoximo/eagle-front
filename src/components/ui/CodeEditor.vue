<template>
  <div class="code-editor">
    <div v-if="toolbar" class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
          {{ language }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="formatCode"
          class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Format
        </button>
        <button
          type="button"
          @click="copyCode"
          class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
    
    <div class="relative">
      <textarea
        ref="textarea"
        v-model="internalValue"
        :placeholder="placeholder"
        :style="{ height: height }"
        :class="[
          'block w-full p-3 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white font-mono text-sm resize-none',
          toolbar ? 'rounded-b-md' : 'rounded-md'
        ]"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      
      <!-- Line numbers (optional) -->
      <div 
        v-if="showLineNumbers" 
        class="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col text-xs text-gray-500 dark:text-gray-400 select-none pointer-events-none"
      >
        <div
          v-for="line in lineCount"
          :key="line"
          class="px-2 py-0.5 text-right leading-5"
        >
          {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
  modelValue: string
  language?: string
  placeholder?: string
  height?: string
  toolbar?: boolean
  showLineNumbers?: boolean
  readOnly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'html',
  height: '200px',
  toolbar: true,
  showLineNumbers: false,
  readOnly: false
})

const emit = defineEmits<Emits>()

const textarea = ref<HTMLTextAreaElement>()
const internalValue = ref(props.modelValue)

const lineCount = computed(() => {
  return internalValue.value.split('\n').length
})

const handleInput = () => {
  emit('update:modelValue', internalValue.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Handle tab key for indentation
  if (event.key === 'Tab') {
    event.preventDefault()
    const start = textarea.value?.selectionStart || 0
    const end = textarea.value?.selectionEnd || 0
    const spaces = '  ' // 2 spaces for indentation
    
    internalValue.value = 
      internalValue.value.substring(0, start) + 
      spaces + 
      internalValue.value.substring(end)
    
    nextTick(() => {
      if (textarea.value) {
        textarea.value.selectionStart = start + spaces.length
        textarea.value.selectionEnd = start + spaces.length
      }
    })
    
    emit('update:modelValue', internalValue.value)
  }
}

const formatCode = () => {
  // Basic HTML formatting - in a real app, you'd use a proper formatter
  if (props.language === 'html') {
    try {
      // Simple indentation for HTML - this is very basic
      let formatted = internalValue.value
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
      
      internalValue.value = formatted
      emit('update:modelValue', internalValue.value)
    } catch (error) {
      console.error('Failed to format code:', error)
    }
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(internalValue.value)
  } catch (error) {
    console.error('Failed to copy code:', error)
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue
  }
})
</script>

<style scoped>
.code-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style> 