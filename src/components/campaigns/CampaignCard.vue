<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex items-start justify-between">
      <!-- Campaign Info -->
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-3">
          <div :class="[
            'p-3 rounded-full',
            campaign.status === 'sent' ? 'bg-green-100 dark:bg-green-900/20' :
            campaign.status === 'draft' ? 'bg-gray-100 dark:bg-gray-700' :
            campaign.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/20' :
            campaign.status === 'sending' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
            'bg-red-100 dark:bg-red-900/20'
          ]">
            <Mail :class="[
              'w-6 h-6',
              campaign.status === 'sent' ? 'text-green-600 dark:text-green-400' :
              campaign.status === 'draft' ? 'text-gray-600 dark:text-gray-400' :
              campaign.status === 'scheduled' ? 'text-blue-600 dark:text-blue-400' :
              campaign.status === 'sending' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            ]" />
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {{ campaign.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {{ campaign.subject }}
            </p>
          </div>
          
          <StatusBadge :status="campaign.status" size="md" />
        </div>
        
        <!-- Campaign Details -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Users class="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatNumber(campaign.total_recipients || 0) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Recipients</div>
          </div>
          
          <div v-if="campaign.status === 'sent'" class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Eye class="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <div class="text-lg font-bold text-blue-900 dark:text-blue-100">
              {{ formatPercentage(campaign.open_rate || 0) }}
            </div>
            <div class="text-xs text-blue-600 dark:text-blue-400">Open Rate</div>
          </div>
          
          <div v-if="campaign.status === 'sent'" class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <MousePointer class="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <div class="text-lg font-bold text-green-900 dark:text-green-100">
              {{ formatPercentage(campaign.click_rate || 0) }}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">Click Rate</div>
          </div>
          
          <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <div class="text-sm font-medium text-purple-900 dark:text-purple-100">
              {{ formatDate(campaign.created_at) }}
            </div>
            <div class="text-xs text-purple-600 dark:text-purple-400">Created</div>
          </div>
        </div>
        
        <!-- Contact List Info -->
        <div v-if="campaign.contact_list" class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <List class="w-4 h-4 mr-2" />
          <span>Audience: {{ campaign.contact_list.name }}</span>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('view', campaign.id)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Eye class="w-4 h-4 mr-1" />
          View
        </button>
        
        <button
          v-if="campaign.status === 'draft'"
          @click="$emit('edit', campaign.id)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Edit class="w-4 h-4 mr-1" />
          Edit
        </button>
        
        <button
          v-if="campaign.status === 'sent'"
          @click="$emit('analytics', campaign.id)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <BarChart class="w-4 h-4 mr-1" />
          Analytics
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="campaign.status === 'draft'"
          @click="$emit('send', campaign)"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <Send class="w-4 h-4 mr-1" />
          Send Now
        </button>
        
        <!-- Dropdown Menu -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="showDropdown = !showDropdown"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <MoreHorizontal class="w-4 h-4" />
          </button>
          
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10"
          >
            <div class="py-1">
              <button
                @click="handleDuplicate"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Copy class="w-4 h-4 inline mr-2" />
                Duplicate
              </button>
              
              <button
                v-if="campaign.status === 'sent'"
                @click="handleExport"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Download class="w-4 h-4 inline mr-2" />
                Export Results
              </button>
              
              <div class="border-t border-gray-100 dark:border-gray-600"></div>
              
              <button
                v-if="campaign.status === 'draft'"
                @click="handleDelete"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Trash2 class="w-4 h-4 inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Mail, Users, Eye, MousePointer, Calendar, List, Edit, Send, 
  BarChart, MoreHorizontal, Copy, Download, Trash2
} from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'

interface Campaign {
  id: number
  name: string
  subject: string
  status: string
  total_recipients?: number
  open_rate?: number
  click_rate?: number
  created_at: string
  contact_list?: {
    name: string
  }
}

interface Props {
  campaign: Campaign
}

interface Emits {
  (e: 'view', id: number): void
  (e: 'edit', id: number): void
  (e: 'send', campaign: Campaign): void
  (e: 'duplicate', campaign: Campaign): void
  (e: 'delete', campaign: Campaign): void
  (e: 'analytics', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement>()

// Methods
const handleDuplicate = () => {
  showDropdown.value = false
  emit('duplicate', props.campaign)
}

const handleDelete = () => {
  showDropdown.value = false
  emit('delete', props.campaign)
}

const handleExport = () => {
  showDropdown.value = false
  // Export functionality would go here
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Handle click outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 