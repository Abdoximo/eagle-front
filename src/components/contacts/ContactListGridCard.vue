<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group">
    <!-- Header -->
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ list.name }}
          </h3>
          <p v-if="list.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {{ list.description }}
          </p>
        </div>
        
        <!-- Dropdown Menu -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical class="w-4 h-4" />
          </button>
          
          <!-- Menu Dropdown -->
          <div
            v-if="showMenu"
            v-click-outside="() => showMenu = false"
            class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10"
          >
            <button
              @click="handleView"
              class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye class="w-4 h-4 mr-2" />
              View Details
            </button>
            <button
              @click="handleEdit"
              class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit class="w-4 h-4 mr-2" />
              Edit List
            </button>
            <button
              @click="handleDuplicate"
              class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Copy class="w-4 h-4 mr-2" />
              Duplicate
            </button>
            <hr class="border-gray-200 dark:border-gray-600" />
            <button
              @click="handleDelete"
              class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Delete List
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="px-6 pb-4">
      <div class="flex items-center space-x-6 text-sm">
        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Users class="w-4 h-4 mr-1" />
          <span class="font-medium">{{ formatNumber(list.contacts_count) }}</span>
          <span class="ml-1">contacts</span>
        </div>
        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar class="w-4 h-4 mr-1" />
          <span>{{ formatDate(list.updated_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="list.tags && list.tags.length > 0" class="px-6 pb-4">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in list.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
        >
          {{ tag }}
        </span>
        <span
          v-if="list.tags.length > 3"
          class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
        >
          +{{ list.tags.length - 3 }}
        </span>
      </div>
    </div>

    <!-- Footer Stats -->
    <div v-if="list.stats" class="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-sm font-medium text-green-600 dark:text-green-400">
            {{ formatNumber(list.stats.active) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Active</div>
        </div>
        <div>
          <div class="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            {{ formatNumber(list.stats.bounced) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Bounced</div>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ formatNumber(list.stats.unsubscribed) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Unsub</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions (shown on hover) -->
    <div class="px-6 pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
      <div class="flex space-x-2">
        <button
          @click="handleView"
          class="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
        >
          View Details
        </button>
        <button
          @click="handleEdit"
          class="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Users, 
  Calendar 
} from 'lucide-vue-next'
import type { ContactList } from '@/types/contacts'

interface Props {
  list: ContactList
}

interface Emits {
  (e: 'view', list: ContactList): void
  (e: 'edit', list: ContactList): void
  (e: 'duplicate', list: ContactList): void
  (e: 'delete', list: ContactList): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showMenu = ref(false)

// Methods
const handleView = () => {
  showMenu.value = false
  emit('view', props.list)
}

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.list)
}

const handleDuplicate = () => {
  showMenu.value = false
  emit('duplicate', props.list)
}

const handleDelete = () => {
  showMenu.value = false
  emit('delete', props.list)
}

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Click outside directive
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-opacity {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>