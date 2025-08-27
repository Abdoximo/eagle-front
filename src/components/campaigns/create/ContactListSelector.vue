<template>
  <div class="space-y-4">
    <label class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
      <Users class="w-4 h-4 mr-2 text-green-500" />
      Select Audience
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Current Selection Display -->
    <div v-if="modelValue" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-sm font-medium text-blue-900 dark:text-blue-200">
            Selected: {{ getSelectedListName() }}
          </span>
          <span class="text-xs text-blue-600 dark:text-blue-400 ml-2">
            ({{ getSelectedListContacts() }} contacts)
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="showContactPreview = true"
            type="button"
            class="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
          >
            Preview Recipients
          </button>
          <button
            @click="clearSelection"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ContactListSkeleton v-for="i in 6" :key="i" />
    </div>
    
    <!-- Empty State with Quick Actions -->
    <div v-else-if="contactLists.length === 0" class="text-center py-8 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
      <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Contact Lists Yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Create a contact list to start sending campaigns</p>
      
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="showQuickCreateModal = true"
          type="button"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          Quick Create List
        </button>
        <button
          @click="showImportModal = true"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Upload class="w-4 h-4 mr-2" />
          Import Contacts
        </button>
      </div>
    </div>
    
    <!-- Contact Lists Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="list in contactLists"
        :key="list.id"
        @click="selectList(list)"
        :class="[
          'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group',
          modelValue === list.id
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 hover:shadow-md'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 :class="[
              'font-medium transition-colors',
              modelValue === list.id 
                ? 'text-blue-900 dark:text-blue-200' 
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
            ]">
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
            v-if="modelValue === list.id"
            class="p-1 bg-blue-500 rounded-full"
          >
            <Check class="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error Message -->
    <ErrorMessage v-if="error" :message="error" />

    <!-- Quick Create List Modal -->
    <QuickCreateListModal 
      v-if="showQuickCreateModal" 
      @close="showQuickCreateModal = false"
      @created="handleListCreated"
    />

    <!-- Import Contacts Modal -->
    <QuickImportModal 
      v-if="showImportModal" 
      @close="showImportModal = false"
      @imported="handleContactsImported"
    />

    <!-- Contact Preview Modal -->
    <ContactPreviewModal 
      v-if="showContactPreview && modelValue" 
      :list-id="modelValue"
      @close="showContactPreview = false"
      @recipients-updated="handleRecipientsUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Users, Calendar, Check, X, Plus, Upload } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import { showSuccess, showError, showInfo } from '@/services/toast'

// Components
import ContactListSkeleton from '@/components/contacts/ContactListSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import QuickCreateListModal from '@/components/contacts/QuickCreateListModal.vue'
import QuickImportModal from '@/components/contacts/QuickImportModal.vue'
import ContactPreviewModal from '@/components/campaigns/ContactPreviewModal.vue'

// Types
import type { ContactList } from '@/types/contacts'

interface Props {
  modelValue: number | null
  error?: string
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const router = useRouter()

// Store
const contactsStore = useContactsStore()

// State
const showQuickCreateModal = ref(false)
const showImportModal = ref(false)
const showContactPreview = ref(false)

// Computed
const contactLists = computed(() => contactsStore.contactLists || [])
const loading = computed(() => contactsStore.loading)

// Methods
const selectList = (list: ContactList) => {
  emit('update:modelValue', list.id)
  showSuccess(`Selected: ${list.name}`)
}

const clearSelection = () => {
  emit('update:modelValue', null)
  showInfo('Selection cleared')
}

const getSelectedListName = () => {
  if (!props.modelValue) return ''
  const list = contactLists.value.find(l => l.id === props.modelValue)
  return list?.name || ''
}

const getSelectedListContacts = () => {
  if (!props.modelValue) return 0
  const list = contactLists.value.find(l => l.id === props.modelValue)
  return formatNumber(list?.contacts_count || 0)
}

const handleCreateList = () => {
  router.push('/contacts/lists/create')
}

const handleListCreated = (newList: ContactList) => {
  // Refresh the contact lists
  contactsStore.fetchContactLists()
  // Auto-select the new list
  emit('update:modelValue', newList.id)
  showSuccess(`Created and selected: ${newList.name}`)
  showQuickCreateModal.value = false
}

const handleContactsImported = (listId: number) => {
  // Refresh the contact lists
  contactsStore.fetchContactLists()
  // Auto-select the updated list
  emit('update:modelValue', listId)
  showSuccess('Contacts imported successfully!')
  showImportModal.value = false
}

const handleRecipientsUpdated = (excludedContacts: number[]) => {
  // This would emit an event to parent to handle excluded contacts
  // For now, just show success message
  showSuccess(`Recipients updated. ${excludedContacts.length} contacts excluded.`)
  showContactPreview.value = false
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

// Lifecycle
onMounted(async () => {
  // Fetch contact lists if they haven't been loaded yet
  if (!contactsStore.contactLists || contactsStore.contactLists.length === 0) {
    try {
      await contactsStore.fetchContactLists()
    } catch (error) {
      console.error('Failed to fetch contact lists:', error)
    }
  }
})
</script>