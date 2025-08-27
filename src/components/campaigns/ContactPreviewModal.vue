<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Preview Recipients</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Review and manage who will receive this campaign
              </p>
            </div>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ totalContacts }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Total Contacts</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ includedContacts }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Will Receive</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                {{ excludedContacts.length }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Excluded</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search contacts..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <select
              v-model="statusFilter"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Contacts</option>
              <option value="included">Will Receive</option>
              <option value="excluded">Excluded</option>
            </select>
            <div class="flex items-center space-x-2">
              <button
                @click="selectAll"
                class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select All
              </button>
              <button
                @click="selectNone"
                class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Select None
              </button>
            </div>
          </div>
        </div>
        
        <!-- Contacts List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-6">
            <div class="space-y-3">
              <div v-for="i in 10" :key="i" class="animate-pulse">
                <div class="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                    <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="filteredContacts.length === 0" class="p-12 text-center">
            <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No contacts found</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ searchQuery ? 'Try adjusting your search' : 'This contact list is empty' }}
            </p>
          </div>
          
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="contact in paginatedContacts"
              :key="contact.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :checked="!excludedContacts.includes(contact.id)"
                  @change="toggleContact(contact.id)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {{ getInitials(contact) }}
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ contact.first_name || contact.email.split('@')[0] }} {{ contact.last_name || '' }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ contact.email }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      contact.is_subscribed
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    ]"
                  >
                    {{ contact.is_subscribed ? 'Subscribed' : 'Unsubscribed' }}
                  </span>
                  <span
                    v-if="excludedContacts.includes(contact.id)"
                    class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full"
                  >
                    Excluded
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredContacts.length) }} 
              of {{ filteredContacts.length }} contacts
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              <span class="px-3 py-1 text-sm">{{ currentPage }} / {{ totalPages }}</span>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <strong>{{ includedContacts }}</strong> contacts will receive this campaign
              <span v-if="excludedContacts.length > 0">
                ({{ excludedContacts.length }} excluded)
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="close"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleConfirm"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Recipients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Search, Users, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'
import api from '@/services/api'

interface Contact {
  id: number
  email: string
  first_name?: string
  last_name?: string
  is_subscribed: boolean
}

interface Props {
  listId: number
}

interface Emits {
  (e: 'close'): void
  (e: 'recipients-updated', excludedContacts: number[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(true)
const contacts = ref<Contact[]>([])
const excludedContacts = ref<number[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 20

const filteredContacts = computed(() => {
  let filtered = [...contacts.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact => 
      contact.email.toLowerCase().includes(query) ||
      (contact.first_name?.toLowerCase().includes(query)) ||
      (contact.last_name?.toLowerCase().includes(query))
    )
  }
  
  // Status filter
  if (statusFilter.value === 'included') {
    filtered = filtered.filter(contact => !excludedContacts.value.includes(contact.id))
  } else if (statusFilter.value === 'excluded') {
    filtered = filtered.filter(contact => excludedContacts.value.includes(contact.id))
  }
  
  return filtered
})

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredContacts.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / pageSize))
const totalContacts = computed(() => contacts.value.length)
const includedContacts = computed(() => totalContacts.value - excludedContacts.value.length)

const close = () => {
  emit('close')
}

const toggleContact = (contactId: number) => {
  const index = excludedContacts.value.indexOf(contactId)
  if (index > -1) {
    excludedContacts.value.splice(index, 1)
  } else {
    excludedContacts.value.push(contactId)
  }
}

const selectAll = () => {
  excludedContacts.value = []
}

const selectNone = () => {
  excludedContacts.value = [...contacts.value.map(c => c.id)]
}

const getInitials = (contact: Contact) => {
  if (contact.first_name) {
    return (contact.first_name[0] + (contact.last_name?.[0] || '')).toUpperCase()
  }
  return contact.email[0].toUpperCase()
}

const handleConfirm = () => {
  emit('recipients-updated', excludedContacts.value)
}

const loadContacts = async () => {
  loading.value = true
  try {
    console.log('🔍 Loading contacts for list ID:', props.listId)
    console.log('🔑 Auth token:', localStorage.getItem('auth_token'))
    
    // Fetch real contacts from the API using the configured service
    const data = await api.get(`/contacts/lists/${props.listId}/contacts`)
    console.log('📊 API response:', data)
    
    contacts.value = data.contacts || []
    console.log('👥 Contacts loaded:', contacts.value.length)
    
    if (contacts.value.length === 0) {
      showError('No contacts found in this list')
    }
  } catch (error: any) {
    console.error('❌ Error loading contacts:', error)
    console.error('❌ Error details:', error.response?.data)
    showError(error.message || 'Failed to load contacts')
    contacts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContacts()
})
</script>
