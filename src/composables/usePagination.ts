import { ref, computed, watch } from 'vue'
import type { PaginationMeta } from '@/types/common'

export function usePagination(initialPage = 1, initialPerPage = 15) {
  const currentPage = ref(initialPage)
  const perPage = ref(initialPerPage)
  const total = ref(0)
  const lastPage = ref(1)

  const hasNextPage = computed(() => currentPage.value < lastPage.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  
  const totalPages = computed(() => Math.ceil(total.value / perPage.value))
  
  const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1)
  const endItem = computed(() => Math.min(currentPage.value * perPage.value, total.value))

  const updateMeta = (meta: PaginationMeta) => {
    currentPage.value = meta.current_page
    total.value = meta.total
    perPage.value = meta.per_page
    lastPage.value = meta.last_page || Math.ceil(meta.total / meta.per_page)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const reset = () => {
    currentPage.value = 1
    total.value = 0
    lastPage.value = 1
  }

  return {
    currentPage,
    perPage,
    total,
    lastPage,
    hasNextPage,
    hasPrevPage,
    totalPages,
    startItem,
    endItem,
    updateMeta,
    goToPage,
    nextPage,
    prevPage,
    reset,
  }
}