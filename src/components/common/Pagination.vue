<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
      <span class="mr-2">Showing</span>
      <span class="font-medium">{{ startItem }}</span>
      <span class="mx-2">to</span>
      <span class="font-medium">{{ endItem }}</span>
      <span class="mx-2">of</span>
      <span class="font-medium">{{ total }}</span>
      <span class="ml-2">items</span>
    </div>

    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="$emit('page-change', currentPage - 1)"
      >
        Previous
      </Button>

      <div class="flex items-center space-x-1">
        <template v-for="page in displayedPages" :key="page">
          <Button
            v-if="page !== '...'"
            variant="outline"
            size="sm"
            :class="{ 'bg-primary text-white': page === currentPage }"
            @click="$emit('page-change', page)"
          >
            {{ page }}
          </Button>
          <span v-else class="px-2 text-gray-500">...</span>
        </template>
      </div>

      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="$emit('page-change', currentPage + 1)"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '../ui/Button.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()

const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisiblePages = 5

  if (props.totalPages <= maxVisiblePages) {
    // Show all pages if total pages is less than max visible
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate start and end of visible pages
    let start = Math.max(2, props.currentPage - 1)
    let end = Math.min(props.totalPages - 1, props.currentPage + 1)

    // Adjust if at the start
    if (props.currentPage <= 2) {
      end = 4
    }
    // Adjust if at the end
    if (props.currentPage >= props.totalPages - 1) {
      start = props.totalPages - 3
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (end < props.totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(props.totalPages)
  }

  return pages
})
</script> 