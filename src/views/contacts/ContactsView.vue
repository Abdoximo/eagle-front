<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Clear CTAs -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Contacts & Lists
                </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Manage your email lists and track subscriber engagement
                </p>
          </div>
          
            <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
              <button
                @click="showImportModal = true"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
              <Upload class="w-4 h-4 mr-2" />
                Import Contacts
              </button>
              
              <button
                @click="showAddContactModal = true"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
              <UserPlus class="w-4 h-4 mr-2" />
                Add Contact
              </button>
              
              <button
                @click="showCreateListModal = true"
                class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Plus class="w-4 h-4 mr-2" />
                Create List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onboarding Banner (for new users) -->
    <div v-if="$route.query.onboarding && contactLists.length === 0" 
         class="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center">
          <div class="flex-1">
            <h2 class="text-xl font-semibold mb-2">👋 Welcome! Let's add your first contacts</h2>
            <p class="text-blue-100">You need contacts before creating campaigns. Start by creating a list and adding contacts to it.</p>
          </div>
          <button @click="showCreateListModal = true" class="ml-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Get Started
          </button>
            </div>
          </div>
        </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Contact Lists Overview -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Contact Lists</h2>
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search lists..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Contact Lists Grid -->
        <div v-if="filteredLists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="list in filteredLists"
            :key="list.id"
            class="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            @click="viewList(list.id)"
          >
            <!-- List Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <List class="w-6 h-6 text-white" />
            </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ list.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ list.contacts_count || 0 }} contacts
                  </p>
        </div>
      </div>

              <!-- Actions Dropdown -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="toggleListActions(list.id)" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreVertical class="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <!-- List Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-lg font-bold text-green-600 dark:text-green-400">
                  {{ list.active_contacts_count || 0 }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Subscribed</div>
                  </div>
              <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {{ calculateEngagementRate(list) }}%
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-2">
              <button
                @click.stop="quickAddContact(list)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <UserPlus class="w-4 h-4 mr-1" />
                Add Contact
              </button>
              <button
                @click.stop="sendToList(list)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Send class="w-4 h-4 mr-1" />
                Send Campaign
              </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
        <div v-else-if="contactLists.length === 0" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create Your First Contact List</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
              Contact lists help you organize your audience and send targeted campaigns. Start by creating your first list.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                @click="showCreateListModal = true"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Plus class="w-5 h-5 mr-2" />
                Create Contact List
              </button>
              <button
                @click="showImportModal = true"
                class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Upload class="w-5 h-5 mr-2" />
                Import from CSV
              </button>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-16">
          <Search class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No lists found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try adjusting your search query</p>
        </div>
              </div>
              
      <!-- Recent Activity -->
      <div v-if="contactLists.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        
        <div v-if="recentActivity.length > 0" class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" 
               class="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
            <div class="flex-shrink-0">
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center',
                activity.type === 'contact_added' ? 'bg-green-100 dark:bg-green-900/30' :
                activity.type === 'list_created' ? 'bg-blue-100 dark:bg-blue-900/30' :
                'bg-gray-100 dark:bg-gray-700'
              ]">
                <UserPlus v-if="activity.type === 'contact_added'" class="w-5 h-5 text-green-600 dark:text-green-400" />
                <List v-else-if="activity.type === 'list_created'" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <Activity v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatRelativeTime(activity.timestamp) }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <Activity class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Create List Modal -->
    <Modal v-model="showCreateListModal" title="Create Contact List" size="lg">
      <ContactListForm
        @success="handleListCreated"
        @cancel="showCreateListModal = false"
      />
    </Modal>

    <!-- Add Contact Modal -->
    <Modal v-model="showAddContactModal" title="Add New Contact" size="lg">
      <ContactForm
        :contact-lists="contactLists"
        :default-list="selectedList"
        @created="handleContactCreated"
        @cancel="showAddContactModal = false"
      />
    </Modal>

    <!-- Import Modal -->
    <Modal v-model="showImportModal" title="Import Contacts" size="xl">
      <ContactImportForm
        @success="handleImportSuccess"
        @cancel="showImportModal = false"
      />
    </Modal>

    <!-- Quick Add Contact Modal -->
    <Modal v-model="showQuickAddModal" title="Add Contact to List" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Adding to: {{ selectedList?.name }}
          </label>
        </div>
        <QuickContactForm
          :list-id="selectedList?.id"
          @success="handleQuickContactAdded"
          @cancel="showQuickAddModal = false"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Users, Search, List, UserPlus, Upload, Send, 
  MoreVertical, Activity, Eye, MousePointer 
} from 'lucide-vue-next'
import { useContactsStore } from '@/stores/contacts'
import { showSuccess, showError } from '@/services/toast'

// Components
import Modal from '@/components/ui/Modal.vue'
import ContactListForm from '@/components/forms/ContactListForm.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import ContactImportForm from '@/components/contacts/ContactImportForm.vue'
import QuickContactForm from '@/components/contacts/QuickContactForm.vue'

const router = useRouter()
const contactsStore = useContactsStore()

// State
const searchQuery = ref('')
const showCreateListModal = ref(false)
const showAddContactModal = ref(false)
const showImportModal = ref(false)
const showQuickAddModal = ref(false)
const selectedList = ref(null)

// Mock recent activity (you can replace with real data)
const recentActivity = ref([
  {
    id: 1,
    type: 'contact_added',
    title: 'New contact added',
    description: 'john@example.com was added to Newsletter list',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: 'list_created',
    title: 'List created',
    description: 'VIP Customers list was created',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  }
])

// Computed
const contactLists = computed(() => contactsStore.contactLists || [])

const filteredLists = computed(() => {
  if (!searchQuery.value) return contactLists.value
  
  return contactLists.value.filter(list =>
    list.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const viewList = (listId: number) => {
  router.push(`/contacts/lists/${listId}`)
}

const quickAddContact = (list: any) => {
  selectedList.value = list
  showQuickAddModal.value = true
}

const sendToList = (list: any) => {
  router.push(`/campaigns/create?list=${list.id}`)
}

const toggleListActions = (listId: number) => {
  // Implementation for dropdown actions
}

const calculateEngagementRate = (list: any) => {
  // Mock calculation - replace with real logic
  return Math.floor(Math.random() * 100)
}

const handleListCreated = (list: any) => {
  showCreateListModal.value = false
  showSuccess(`List "${list.name}" created successfully!`)
  contactsStore.fetchContactLists()
}

const handleContactCreated = (contact: any) => {
  showAddContactModal.value = false
  showSuccess('Contact added successfully!')
  contactsStore.fetchContactLists()
}

const handleQuickContactAdded = (contact: any) => {
  showQuickAddModal.value = false
  selectedList.value = null
  showSuccess('Contact added to list!')
  contactsStore.fetchContactLists()
}

const handleImportSuccess = (result: any) => {
  showImportModal.value = false
  showSuccess(`Imported ${result.imported} contacts successfully!`)
  contactsStore.fetchContactLists()
}

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Lifecycle
onMounted(async () => {
  await contactsStore.fetchContactLists()
})
</script>