<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('common.pagination.showing') }}
        {{ startItem }}
        {{ $t('common.pagination.to') }}
        {{ endItem }}
        {{ $t('common.pagination.of') }}
        {{ total }}
        {{ $t('common.pagination.results') }}
      </span>
    </div>

    <div class="flex items-center space-x-2">
      <!-- Items per page selector -->
      <div v-if="showSizeChanger" class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('common.pagination.items_per_page') }}:
        </span>
        <select
          :value="perPage"
          @change="handlePerPageChange"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center space-x-1">
        <!-- First page -->
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          {{ $t('common.pagination.first') }}
        </Button>

        <!-- Previous page -->
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>

        <!-- Page numbers -->
        <div class="flex items-center space-x-1">
          <Button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            :variant="pageNum === currentPage ? 'default' : 'ghost'"
            size="sm"
            @click="goToPage(pageNum)"
            :class="pageNum === currentPage ? 'bg-blue-600 text-white' : ''"
          >
            {{ pageNum }}
          </Button>
        </div>

        <!-- Next page -->
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>

        <!-- Last page -->
        <Button
          variant="ghost"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          {{ $t('common.pagination.last') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from './Button.vue'

interface Props {
  page: number
  total: number
  perPage: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}

interface Emits {
  (e: 'update:page', page: number): void
  (e: 'update:per-page', perPage: number): void
}

const props = withDefaults(defineProps<Props>(), {
  showSizeChanger: false,
  pageSizeOptions: () => [10, 25, 50, 100]
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const currentPage = computed(() => props.page)
const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const startItem = computed(() => {
  return (currentPage.value - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const delta = 2 // Show 2 pages before and after current page
  const start = Math.max(1, currentPage.value - delta)
  const end = Math.min(totalPages.value, currentPage.value + delta)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Add first page and ellipsis if needed
  if (start > 1) {
    if (start > 2) {
      pages.unshift('...')
    }
    pages.unshift(1)
  }

  // Add last page and ellipsis if needed
  if (end < totalPages.value) {
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }

  return pages.filter(page => typeof page === 'number') as number[]
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    emit('update:page', page)
  }
}

const handlePerPageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:per-page', parseInt(target.value))
}
</script> 