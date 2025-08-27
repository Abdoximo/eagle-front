<template>
  <div
    @click="handleClick"
    :class="[
      'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group',
      selected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
    ]"
  >
    <!-- Debug Info -->
    <div class="absolute top-1 right-1 text-xs bg-black text-white px-1 rounded">
      {{ selected ? 'SELECTED' : 'NOT SELECTED' }}
    </div>
    
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ list.name }}
        </h4>
        
        <div class="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          <Users class="w-4 h-4 mr-1" />
          {{ formatNumber(list.contacts_count) }} contacts
        </div>
        
        <div class="flex items-center mt-1 text-xs text-gray-500">
          <Calendar class="w-3 h-3 mr-1" />
          Updated {{ formatDate(list.updated_at) }}
        </div>
        
        <!-- Tags -->
        <div v-if="list.tags && list.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="tag in list.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
          >
            {{ tag }}
          </span>
          <span
            v-if="list.tags.length > 3"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full"
          >
            +{{ list.tags.length - 3 }}
          </span>
        </div>
      </div>
      
      <!-- Selection Indicator -->
      <div
        v-if="selected"
        class="p-1 bg-blue-500 rounded-full"
      >
        <Check class="w-3 h-3 text-white" />
      </div>
    </div>
    
    <!-- Hover Stats -->
    <div
      v-if="list.stats"
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <div class="grid grid-cols-3 gap-2 text-center">
        <div>
          <div class="text-xs font-medium text-green-600 dark:text-green-400">
            {{ list.stats.active || 0 }}
          </div>
          <div class="text-xs text-gray-500">Active</div>
        </div>
        <div>
          <div class="text-xs font-medium text-yellow-600 dark:text-yellow-400">
            {{ list.stats.bounced || 0 }}
          </div>
          <div class="text-xs text-gray-500">Bounced</div>
        </div>
        <div>
          <div class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ list.stats.unsubscribed || 0 }}
          </div>
          <div class="text-xs text-gray-500">Unsub</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Calendar, Check } from 'lucide-vue-next'

interface ContactList {
  id: number
  name: string
  contacts_count: number
  updated_at: string
  tags?: string[]
  stats?: {
    active: number
    bounced: number
    unsubscribed: number
  }
}

interface Props {
  list: ContactList
  selected: boolean
}

interface Emits {
  (e: 'select', list: ContactList): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Methods
const handleClick = () => {
  console.log('ContactListCard clicked:', props.list.name, 'ID:', props.list.id, 'Selected:', props.selected)
  emit('select', props.list)
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
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-opacity {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.group:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Selected state glow */
.border-blue-500 {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.dark .border-blue-500 {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}
</style>