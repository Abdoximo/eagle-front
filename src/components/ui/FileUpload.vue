<template>
  <div>
    <h3>File Upload Component</h3>
    <input type="file" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    emit('file-selected', input.files[0])
  }
}
</script>

<style scoped>
/* Scoped styles go here */
</style> 