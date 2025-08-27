<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'table-header',
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left',
              column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
            ]"
            :style="{ width: column.width }"
            @click="column.sortable ? handleSort(column.key) : null"
          >
            <div class="flex items-center">
              {{ column.label }}
              <template v-if="column.sortable">
                <ChevronUpIcon
                  v-if="sortBy === column.key && sortDirection === 'asc'"
                  class="w-4 h-4 ml-1"
                />
                <ChevronDownIcon
                  v-else-if="sortBy === column.key && sortDirection === 'desc'"
                  class="w-4 h-4 ml-1"
                />
                <ChevronUpDownIcon
                  v-else
                  class="w-4 h-4 ml-1 opacity-50"
                />
              </template>
            </div>
          </th>
        </tr>
      </thead>
      
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" v-for="n in 5" :key="`loading-${n}`">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4">
            <div class="skeleton h-4 w-full"></div>
          </td>
        </tr>
        
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500">
            <slot name="empty">
              <div class="flex flex-col items-center">
                <DocumentIcon class="w-12 h-12 text-gray-300 mb-2" />
                <p>{{ emptyMessage || 'No data available' }}</p>
              </div>
            </slot>
          </td>
        </tr>
        
        <tr
          v-else
          v-for="(item, index) in sortedData"
          :key="getRowKey(item, index)"
          class="hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-4 whitespace-nowrap text-sm',
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
            ]"
          >
            <slot
              :name="`cell-${column.key}`"
              :item="item"
              :value="getNestedValue(item, column.key)"
              :index="index"
            >
              {{ getNestedValue(item, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronUpIcon, ChevronDownIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import { ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import type { TableColumn } from '@/types/common'

interface Props {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  rowKey?: string | ((item: any, index: number) => string | number)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id'
})

const emit = defineEmits<{
  sort: [column: string, direction: 'asc' | 'desc']
}>()

const sortBy = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortBy.value) return props.data
  
  return [...props.data].sort((a, b) => {
    const aVal = getNestedValue(a, sortBy.value)
    const bVal = getNestedValue(b, sortBy.value)
    
    if (aVal === bVal) return 0
    
    const modifier = sortDirection.value === 'asc' ? 1 : -1
    return aVal > bVal ? modifier : -modifier
  })
})

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
  
  emit('sort', column, sortDirection.value)
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getRowKey = (item: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return item[props.rowKey] || index
}
</script>