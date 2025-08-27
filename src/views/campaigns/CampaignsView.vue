<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Email Campaigns
              </h1>
              <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Create, manage, and track your email marketing campaigns
              </p>
              
              <!-- Quick Stats -->
              <div class="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div class="flex items-center">
                    <Mail class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-blue-900 dark:text-blue-200">Total Campaigns</p>
                      <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ campaigns.length }}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div class="flex items-center">
                    <Send class="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-green-900 dark:text-green-200">Sent</p>
                      <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ sentCampaigns }}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div class="flex items-center">
                    <FileText class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-yellow-900 dark:text-yellow-200">Drafts</p>
                      <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ draftCampaigns }}</p>
                    </div>
                  </div>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div class="flex items-center">
                    <TrendingUp class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-purple-900 dark:text-purple-200">Avg. Open Rate</p>
                      <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ averageOpenRate }}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 md:mt-0 md:ml-6">
              <button
                @click="router.push('/campaigns/create')"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus class="w-5 h-5 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search campaigns..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>
          
          <!-- Status Filter -->
          <div>
            <select
              v-model="statusFilter"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="resetFilters"
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <RefreshCw class="w-4 h-4 mx-auto" />
            </button>
            <button
              @click="exportCampaigns"
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Download class="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <CampaignCardSkeleton v-for="i in 5" :key="i" />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCampaigns.length === 0 && !loading" class="text-center py-16">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
          <Mail class="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ searchQuery || statusFilter ? 'No campaigns found' : 'No campaigns yet' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {{ searchQuery || statusFilter 
              ? 'Try adjusting your search criteria or filters to find what you\'re looking for.' 
              : 'Get started by creating your first email campaign to reach your audience.' 
            }}
          </p>
          <button
            v-if="!searchQuery && !statusFilter"
            @click="router.push('/campaigns/create')"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus class="w-5 h-5 mr-2" />
            Create Your First Campaign
          </button>
          <button
            v-else
            @click="resetFilters"
            class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            <RefreshCw class="w-5 h-5 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Campaigns Grid -->
      <div v-else class="space-y-4">
        <CampaignCard
          v-for="campaign in filteredCampaigns"
          :key="campaign.id"
          :campaign="campaign"
          @view="viewCampaign"
          @edit="editCampaign"
          @send="sendCampaign"
          @duplicate="duplicateCampaign"
          @delete="deleteCampaign"
          @analytics="viewAnalytics"
        />
      </div>

      <!-- Pagination -->
      <div v-if="filteredCampaigns.length > 0" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredCampaigns.length) }} 
          to {{ Math.min(currentPage * itemsPerPage, filteredCampaigns.length) }} 
          of {{ filteredCampaigns.length }} campaigns
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          
          <span class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Mail, Send, FileText, TrendingUp, Plus, Search, RefreshCw, 
  Download, ChevronLeft, ChevronRight 
} from 'lucide-vue-next'
import { useCampaignsStore } from '@/stores/campaigns'
import { showSuccess, showError, showInfo } from '@/services/toast'
import CampaignCard from '@/components/campaigns/CampaignCard.vue'
import CampaignCardSkeleton from '@/components/campaigns/CampaignCardSkeleton.vue'

const router = useRouter()

// Store
const campaignsStore = useCampaignsStore()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const loading = ref(true)

// Computed
const campaigns = computed(() => campaignsStore.campaigns || [])

const sentCampaigns = computed(() => 
  campaigns.value.filter(c => c.status === 'sent').length
)

const draftCampaigns = computed(() => 
  campaigns.value.filter(c => c.status === 'draft').length
)

const averageOpenRate = computed(() => {
  const sentCamps = campaigns.value.filter(c => c.status === 'sent' && c.open_rate)
  if (sentCamps.length === 0) return 0
  const total = sentCamps.reduce((sum, c) => sum + (c.open_rate || 0), 0)
  return (total / sentCamps.length).toFixed(1)
})

const filteredCampaigns = computed(() => {
  let filtered = [...campaigns.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign =>
      campaign.name?.toLowerCase().includes(query) ||
      campaign.subject?.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }
  
  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let filtered = [...campaigns.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign =>
      campaign.name?.toLowerCase().includes(query) ||
      campaign.subject?.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }
  
  return Math.ceil(filtered.length / itemsPerPage.value)
})

// Methods
const fetchCampaigns = async () => {
  try {
    loading.value = true
    await campaignsStore.fetchCampaigns()
  } catch (error: any) {
    showError(error.message || 'Failed to load campaigns')
  } finally {
    loading.value = false
  }
}

const viewCampaign = (id: number) => {
  router.push(`/campaigns/${id}`)
}

const editCampaign = (id: number) => {
  router.push(`/campaigns/${id}/edit`)
}

const viewAnalytics = (id: number) => {
  router.push(`/campaigns/${id}/analytics`)
}

const sendCampaign = async (campaign: any) => {
  if (confirm(`Are you sure you want to send "${campaign.name}"? This action cannot be undone.`)) {
    try {
      await campaignsStore.sendCampaign(campaign.id)
      // Store already shows success message, no need to duplicate
      await fetchCampaigns() // Refresh data
    } catch (error: any) {
      showError(error.message || 'Failed to send campaign')
    }
  }
}

const duplicateCampaign = async (campaign: any) => {
  try {
    const duplicated = await campaignsStore.duplicateCampaign(campaign.id)
    // Store already shows success message, no need to duplicate
    router.push(`/campaigns/${duplicated.id}`)
  } catch (error: any) {
    showError(error.message || 'Failed to duplicate campaign')
  }
}

const deleteCampaign = async (campaign: any) => {
  if (confirm(`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`)) {
    try {
      await campaignsStore.deleteCampaign(campaign.id)
      // Store already shows success message, no need to duplicate
      await fetchCampaigns() // Refresh data
    } catch (error: any) {
      showError(error.message || 'Failed to delete campaign')
    }
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const exportCampaigns = () => {
  showInfo('Export feature coming soon!')
}

// Lifecycle
onMounted(() => {
  fetchCampaigns()
})
</script>