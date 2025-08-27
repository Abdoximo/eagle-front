<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Table Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Contact Lists
        </h3>
        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search lists..."
              class="pl-9 pr-4 py-2 w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <!-- View Toggle -->
          <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              @click="$emit('view-change', 'table')"
              :class="[
                'px-3 py-2 text-sm font-medium transition-colors',
                currentView === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              <List class="w-4 h-4" />
            </button>
            <button
              @click="$emit('view-change', 'grid')"
              :class="[
                'px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600',
                currentView === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              <Grid class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <input
                v-model="selectAll"
                @change="toggleSelectAll"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sort(column.key)"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''
              ]"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <ChevronUp
                    :class="[
                      'w-3 h-3 -mb-1',
                      sortKey === column.key && sortOrder === 'asc'
                        ? 'text-blue-500'
                        : 'text-gray-400'
                    ]"
                  />
                  <ChevronDown
                    :class="[
                      'w-3 h-3',
                      sortKey === column.key && sortOrder === 'desc'
                        ? 'text-blue-500'
                        : 'text-gray-400'
                    ]"
                  />
                </div>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="list in sortedLists"
            :key="list.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                v-model="selectedItems"
                :value="list.id"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </td>
            
            <!-- Name -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Users class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ list.name }}
                  </div>
                  <div v-if="list.description" class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {{ list.description }}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Contacts -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white font-medium">
                {{ list.contacts_count.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ list.stats?.active || 0 }} active
              </div>
            </td>
            
            <!-- Tags -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in list.tags?.slice(0, 2)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="list.tags && list.tags.length > 2"
                  class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  +{{ list.tags.length - 2 }}
                </span>
              </div>
            </td>
            
            <!-- Created -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(list.created_at) }}
            </td>
            
            <!-- Updated -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(list.updated_at) }}
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('view', list)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  title="View contacts"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('edit', list)"
                  class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                  title="Edit list"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('duplicate', list)"
                  class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                  title="Duplicate list"
                >
                  <Copy class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('delete', list)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  title="Delete list"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="sortedLists.length === 0" class="p-12 text-center">
      <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ searchQuery ? 'No matching lists found' : 'No contact lists yet' }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {{ searchQuery 
          ? 'Try adjusting your search terms'
          : 'Create your first contact list to start organizing your contacts' 
        }}
      </p>
      <button
        v-if="!searchQuery"
        @click="$emit('create')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Contact List
      </button>
    </div>

    <!-- Bulk Actions Bar -->
    <div
      v-if="selectedItems.length > 0"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50"
    >
      <span class="text-sm font-medium">
        {{ selectedItems.length }} selected
      </span>
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('bulk-export', selectedItems)"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Export
        </button>
        <button
          @click="$emit('bulk-delete', selectedItems)"
          class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          @click="clearSelection"
          class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Search,
  List,
  Grid,
  Users,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'
import type { ContactList } from '@/types/contacts'

// Props
interface Props {
  contactLists: ContactList[]
  currentView: 'table' | 'grid'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
const emit = defineEmits<{
  'view-change': [view: 'table' | 'grid']
  view: [list: ContactList]
  edit: [list: ContactList]
  duplicate: [list: ContactList]
  delete: [list: ContactList]
  create: []
  'bulk-export': [ids: number[]]
  'bulk-delete': [ids: number[]]
}>()

// Reactive data
const searchQuery = ref('')
const sortKey = ref<string>('updated_at')
const sortOrder = ref<'asc' | 'desc'>('desc')
const selectedItems = ref<number[]>([])
const selectAll = ref(false)

// Table columns
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'contacts_count', label: 'Contacts', sortable: true },
  { key: 'tags', label: 'Tags', sortable: false },
  { key: 'created_at', label: 'Created', sortable: true },
  { key: 'updated_at', label: 'Updated', sortable: true }
]

// Computed properties
const filteredLists = computed(() => {
  if (!searchQuery.value) return props.contactLists
  
  const query = searchQuery.value.toLowerCase()
  return props.contactLists.filter(list =>
    list.name.toLowerCase().includes(query) ||
    list.description?.toLowerCase().includes(query) ||
    list.tags?.some(tag => tag.toLowerCase().includes(query))
  )
})

const sortedLists = computed(() => {
  if (!sortKey.value) return filteredLists.value
  
  return [...filteredLists.value].sort((a, b) => {
    let aVal = a[sortKey.value as keyof ContactList]
    let bVal = b[sortKey.value as keyof ContactList]
    
    // Handle special cases
    if (sortKey.value === 'contacts_count') {
      aVal = a.contacts_count
      bVal = b.contacts_count
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Methods
const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = sortedLists.value.map(list => list.id)
  } else {
    selectedItems.value = []
  }
}

const clearSelection = () => {
  selectedItems.value = []
  selectAll.value = false
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watch for selection changes
watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === sortedLists.value.length && newVal.length > 0
}, { deep: true })

watch(sortedLists, () => {
  // Clear selection when list changes
  if (selectedItems.value.length > 0) {
    selectedItems.value = selectedItems.value.filter(id =>
      sortedLists.value.some(list => list.id === id)
    )
  }
})
</script>