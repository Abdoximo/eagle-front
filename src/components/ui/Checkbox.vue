<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', $event.target.checked)"
    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script> 