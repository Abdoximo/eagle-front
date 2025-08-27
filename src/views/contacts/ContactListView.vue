<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Lists
              </h1>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your contact lists and organize your audience
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="showImportModal = true"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload class="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus class="w-4 h-4 mr-2" />
                Create List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Lists"
          :value="stats.totalLists"
          icon="List"
          color="blue"
        />
        <StatsCard
          title="Total Contacts"
          :value="stats.totalContacts"
          icon="Users"
          color="green"
        />
        <StatsCard
          title="Active Contacts"
          :value="stats.activeContacts"
          icon="UserCheck"
          color="purple"
        />
        <StatsCard
          title="Growth This Month"
          :value="`+${stats.monthlyGrowth}%`"
          icon="TrendingUp"
          color="orange"
        />
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search contact lists..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              v-model="selectedFilter"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Lists</option>
              <option value="active">Active Lists</option>
              <option value="large">Large Lists (500+)</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              ]"
              @click="viewMode = 'grid'"
            >
              <Grid class="w-4 h-4" />
            </button>
            <button
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              ]"
              @click="viewMode = 'list'"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactListSkeleton v-for="i in 6" :key="i" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLists.length === 0 && !searchQuery">
        <EmptyState
          title="No Contact Lists Yet"
          description="Create your first contact list to start organizing your audience and sending campaigns."
          icon="Users"
          :action="{
            label: 'Create First List',
            onClick: () => showCreateModal = true
          }"
          :secondary-action="{
            label: 'Import from CSV',
            onClick: () => showImportModal = true
          }"
        />
      </div>

      <!-- No Search Results -->
      <div v-else-if="filteredLists.length === 0 && searchQuery">
        <EmptyState
          title="No Results Found"
          :description="`No contact lists match '${searchQuery}'. Try adjusting your search terms.`"
          icon="Search"
          :action="{
            label: 'Clear Search',
            onClick: clearSearch
          }"
        />
      </div>

      <!-- Contact Lists Grid/List View -->
      <div v-else>
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContactListGridCard
            v-for="list in filteredLists"
            :key="list.id"
            :list="list"
            @edit="editList"
            @delete="deleteList"
            @view="viewList"
            @duplicate="duplicateList"
          />
        </div>

        <!-- List View -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ContactListTable
            :lists="filteredLists"
            @edit="editList"
            @delete="deleteList"
            @view="viewList"
            @duplicate="duplicateList"
          />
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ContactListModal
      v-if="showCreateModal || editingList"
      :list="editingList"
      @save="handleSaveList"
      @close="closeModal"
    />

    <!-- Import Modal -->
    <ImportContactsModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @success="handleImportSuccess"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="deletingList"
      :title="`Delete ${deletingList.name}?`"
      :message="`This will permanently delete the contact list and all ${deletingList.contacts_count} contacts. This action cannot be undone.`"
      confirm-text="Delete List"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="deletingList = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { 
  Plus, 
  Upload, 
  Search, 
  Grid, 
  List,
  Users,
  UserCheck,
  TrendingUp
} from 'lucide-vue-next'

// Composables
import { useContactsStore } from '@/stores/contacts'

// Components
import StatsCard from '@/components/ui/StatsCard.vue'
import ContactListSkeleton from '@/components/contacts/ContactListSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ContactListGridCard from '@/components/contacts/ContactListGridCard.vue'
import ContactListTable from '@/components/contacts/ContactListTable.vue'
import ContactListModal from '@/components/contacts/ContactListModal.vue'
import ImportContactsModal from '@/components/contacts/ImportContactsModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

// Types
import type { ContactList } from '@/types/contacts'

const router = useRouter()
const toast = useToast()
const contactsStore = useContactsStore()

// Local state
const searchQuery = ref('')
const selectedFilter = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const showCreateModal = ref(false)
const showImportModal = ref(false)
const editingList = ref<ContactList | null>(null)
const deletingList = ref<ContactList | null>(null)

// Computed
const loading = computed(() => contactsStore.loading)
const contactLists = computed(() => contactsStore.contactLists || [])

const stats = computed(() => ({
  totalLists: contactLists.value.length,
  totalContacts: contactLists.value.reduce((sum, list) => sum + list.contacts_count, 0),
  activeContacts: contactLists.value.reduce((sum, list) => sum + (list.stats?.active || 0), 0),
  monthlyGrowth: 12 // Mock data - replace with real calculation
}))

const filteredLists = computed(() => {
  let lists = [...contactLists.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    lists = lists.filter(list => 
      list.name.toLowerCase().includes(query) ||
      list.description?.toLowerCase().includes(query) ||
      list.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply category filter
  switch (selectedFilter.value) {
    case 'active':
      lists = lists.filter(list => list.contacts_count > 0)
      break
    case 'large':
      lists = lists.filter(list => list.contacts_count >= 500)
      break
    case 'recent':
      lists = lists.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 10)
      break
  }

  return lists
})

// Methods
const editList = (list: ContactList) => {
  editingList.value = { ...list }
}

const deleteList = (list: ContactList) => {
  deletingList.value = list
}

const viewList = (list: ContactList) => {
  router.push(`/contacts/lists/${list.id}`)
}

const duplicateList = async (list: ContactList) => {
  try {
    await contactsStore.createContactList({
      name: `${list.name} (Copy)`,
      description: list.description,
      tags: list.tags
    })
    toast.success(`Duplicated "${list.name}" successfully`)
  } catch (error) {
    toast.error('Failed to duplicate contact list')
  }
}

const handleSaveList = async (listData: any) => {
  try {
    if (editingList.value) {
      await contactsStore.updateContactList(editingList.value.id, listData)
      toast.success('Contact list updated successfully')
    } else {
      await contactsStore.createContactList(listData)
      toast.success('Contact list created successfully')
    }
    closeModal()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save contact list')
  }
}

const confirmDelete = async () => {
  if (!deletingList.value) return
  
  try {
    await contactsStore.deleteContactList(deletingList.value.id)
    toast.success(`Deleted "${deletingList.value.name}" successfully`)
    deletingList.value = null
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete contact list')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingList.value = null
}

const clearSearch = () => {
  searchQuery.value = ''
}

const handleImportSuccess = (result: any) => {
  showImportModal.value = false
  toast.success(`Imported ${result.imported} contacts successfully`)
  // Refresh lists
  contactsStore.fetchContactLists()
}

// Initialize
onMounted(async () => {
  await contactsStore.fetchContactLists()
})
</script>

<style scoped>
/* Smooth transitions */
.transition-colors {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states */
input:focus,
select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Grid/List toggle buttons */
.p-2:hover {
  transform: translateY(-1px);
}
</style>