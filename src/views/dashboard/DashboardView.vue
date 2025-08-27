<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Hero Section with Quick Actions -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Eagle Email 🦅
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Send beautiful email campaigns and track their performance
        </p>

        <!-- Quick Action Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Create Campaign -->
          <div @click="createCampaign" class="group bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <Plus class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold mb-2">Create Campaign</h3>
              <p class="text-blue-100 text-center">Start a new email campaign in minutes</p>
            </div>
          </div>

          <!-- Manage Contacts -->
          <div @click="manageContacts" class="group bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <Users class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold mb-2">Manage Contacts</h3>
              <p class="text-green-100 text-center">Add and organize your audience</p>
            </div>
          </div>

          <!-- View Analytics -->
          <div @click="viewAnalytics" class="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <BarChart3 class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold mb-2">View Analytics</h3>
              <p class="text-orange-100 text-center">Track your campaign performance</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Campaigns</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalCampaigns || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Mail class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 dark:text-green-400 text-sm font-medium">+12% from last month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contacts</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalContacts || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Users class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 dark:text-green-400 text-sm font-medium">+8% from last month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Emails Sent</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.emailsSent || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Send class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 dark:text-green-400 text-sm font-medium">+25% from last month</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Credits</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ userCredits }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Coins class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div class="mt-4">
            <button @click="buyCreds" class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              Buy more credits
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Quick Guide -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Campaigns -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Campaigns</h2>
            <button @click="$router.push('/campaigns')" class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              View all
            </button>
          </div>
          
          <div v-if="recentCampaigns.length > 0" class="space-y-4">
            <div v-for="campaign in recentCampaigns" :key="campaign.id" 
                 @click="$router.push(`/campaigns/${campaign.id}`)"
                 class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer group">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {{ campaign.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(campaign.created_at) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <StatusBadge :status="campaign.status" />
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ campaign.recipients_count || 0 }} recipients
                </p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <Mail class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns yet</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Create your first email campaign to get started</p>
            <button @click="createCampaign" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus class="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>

        <!-- Getting Started Guide -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Getting Started</h2>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Add Your Contacts</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Import contacts or add them manually to build your audience
                </p>
                <button @click="manageContacts" class="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2">
                  Add contacts →
                </button>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Create Your Campaign</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Design and send beautiful email campaigns to your audience
                </p>
                <button @click="createCampaign" class="text-green-600 dark:text-green-400 text-sm hover:underline mt-2">
                  Create campaign →
                </button>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Track Performance</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Monitor opens, clicks, and engagement with detailed analytics
                </p>
                <button @click="viewAnalytics" class="text-purple-600 dark:text-purple-400 text-sm hover:underline mt-2">
                  View analytics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Welcome Modal -->
    <WelcomeModal :show="showWelcomeModal" @close="showWelcomeModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Users, BarChart3, Mail, Send, Coins, Eye, MousePointer 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCampaignsStore } from '@/stores/campaigns'
import { useContactsStore } from '@/stores/contacts'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import WelcomeModal from '@/components/onboarding/WelcomeModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const campaignsStore = useCampaignsStore()
const contactsStore = useContactsStore()

// Reactive data
const stats = ref({
  totalCampaigns: 0,
  totalContacts: 0,
  emailsSent: 0,
  openRate: 0
})

const recentCampaigns = ref([])
const showWelcomeModal = ref(false)

// Computed
const userCredits = computed(() => authStore.userCredits)

// Methods
const createCampaign = () => {
  // Check if user has contacts first
  if (stats.value.totalContacts === 0) {
    router.push('/contacts?onboarding=true')
  } else {
    router.push('/campaigns/create')
  }
}

const manageContacts = () => {
  router.push('/contacts')
}

const viewAnalytics = () => {
  router.push('/analytics')
}

const buyCreds = () => {
  router.push('/settings/billing')
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

const loadDashboardData = async () => {
  try {
    // Load campaigns
    await campaignsStore.fetchCampaigns()
    recentCampaigns.value = campaignsStore.campaigns.slice(0, 3)
    
    // Load contacts
    await contactsStore.fetchContactLists()
    
    // Update stats
    stats.value = {
      totalCampaigns: campaignsStore.campaigns.length,
      totalContacts: contactsStore.contactLists.reduce((total, list) => total + (list.contacts_count || 0), 0),
      emailsSent: campaignsStore.campaigns.reduce((total, campaign) => total + (campaign.recipients_count || 0), 0),
      openRate: 0
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

// Lifecycle
// Check if user should see welcome modal
const checkWelcomeModal = () => {
  const dismissed = localStorage.getItem('eagle_welcome_dismissed')
  const isFirstVisit = !dismissed && stats.value.totalCampaigns === 0
  showWelcomeModal.value = isFirstVisit
}

onMounted(async () => {
  await loadDashboardData()
  checkWelcomeModal()
})
</script>