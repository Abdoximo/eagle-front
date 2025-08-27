<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 text-gray-400" />
    </div>
    <input
      :value="modelValue"
      @input="handleInput"
      @keydown.enter="handleSearch"
      type="text"
      :placeholder="placeholder"
      :class="[
        'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md',
        'placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
        'dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400',
        'dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        'text-sm'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
})

const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleSearch = () => {
  emit('search', props.modelValue)
}
</script>
