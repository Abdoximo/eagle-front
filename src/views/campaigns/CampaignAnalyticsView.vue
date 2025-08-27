<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-4 mb-2">
                <button @click="$router.back()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ArrowLeft class="w-5 h-5 text-gray-500" />
                </button>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ campaign?.name || 'Campaign Analytics' }}
                </h1>
                <StatusBadge :status="campaign?.status" />
              </div>
              <p class="text-gray-600 dark:text-gray-400">
                Detailed performance analytics and recipient insights
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Download class="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button @click="refreshData" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw class="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Campaign Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Sent -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sent</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatNumber(analytics.sent) }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ formatDate(campaign?.sent_at) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Send class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <!-- Opens -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Opens</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ formatNumber(analytics.opens) }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-1">
                {{ formatPercentage(analytics.openRate) }} open rate
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Eye class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <!-- Clicks -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Clicks</p>
              <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ formatNumber(analytics.clicks) }}</p>
              <p class="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {{ formatPercentage(analytics.clickRate) }} click rate
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <MousePointer class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <!-- Bounces -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bounces</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ formatNumber(analytics.bounces) }}</p>
              <p class="text-sm text-red-600 dark:text-red-400 mt-1">
                {{ formatPercentage(analytics.bounceRate) }} bounce rate
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Performance Over Time -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp class="w-5 h-5 mr-2 text-blue-500" />
            Performance Over Time
          </h2>
          
          <!-- Chart placeholder - you can integrate Chart.js or similar -->
          <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
            <div class="text-center">
              <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-600 dark:text-gray-400">Interactive chart showing opens/clicks over time</p>
            </div>
          </div>
        </div>

        <!-- Device & Platform Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Smartphone class="w-5 h-5 mr-2 text-green-500" />
            Device & Platform
          </h2>
          
          <div class="space-y-4">
            <div v-for="device in deviceStats" :key="device.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  device.name === 'Desktop' ? 'bg-blue-500' :
                  device.name === 'Mobile' ? 'bg-green-500' :
                  'bg-purple-500'
                ]"></div>
                <span class="text-gray-900 dark:text-white font-medium">{{ device.name }}</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-gray-900 dark:text-white">{{ device.percentage }}%</span>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatNumber(device.count) }} opens</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics Tables -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <!-- Top Performing Links -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Link class="w-5 h-5 mr-2 text-purple-500" />
              Top Performing Links
            </h2>
            <button @click="exportLinks" class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Export all
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="link in topLinks" :key="link.id" class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ link.url }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ link.title || 'Untitled Link' }}</p>
              </div>
              <div class="text-right ml-4">
                <p class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ formatNumber(link.clicks) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">clicks</p>
              </div>
            </div>
          </div>
          
          <div v-if="topLinks.length === 0" class="text-center py-8">
            <Link class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">No link clicks yet</p>
          </div>
        </div>

        <!-- Recipient Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Users class="w-5 h-5 mr-2 text-green-500" />
              Recipient Activity
            </h2>
            <div class="flex items-center space-x-2">
              <select v-model="activityFilter" class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="all">All Activity</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="activity in filteredActivity" :key="activity.id" 
                 class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  activity.type === 'opened' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.type === 'clicked' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  activity.type === 'bounced' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-gray-100 dark:bg-gray-700'
                ]">
                  <Eye v-if="activity.type === 'opened'" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  <MousePointer v-else-if="activity.type === 'clicked'" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <AlertTriangle v-else-if="activity.type === 'bounced'" class="w-4 h-4 text-red-600 dark:text-red-400" />
                  <Mail v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
  <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ activity.email }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</p>
                </div>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatRelativeTime(activity.timestamp) }}
              </div>
            </div>
          </div>
          
          <div v-if="filteredActivity.length === 0" class="text-center py-8">
            <Activity class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">No activity found</p>
          </div>
        </div>
      </div>

      <!-- Geographic Data -->
      <div v-if="geoData.length > 0" class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Globe class="w-5 h-5 mr-2 text-blue-500" />
          Geographic Performance
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="geo in geoData" :key="geo.country" class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="text-2xl mb-2">{{ geo.flag }}</div>
            <p class="font-medium text-gray-900 dark:text-white">{{ geo.country }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatNumber(geo.opens) }} opens</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, Download, RefreshCw, Send, Eye, MousePointer, AlertTriangle,
  TrendingUp, BarChart3, Smartphone, Link, Users, Activity, Globe, Mail
} from 'lucide-vue-next'
import { useCampaignsStore } from '@/stores/campaigns'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { showSuccess, showError, showInfo } from '@/services/toast'

const route = useRoute()
const campaignsStore = useCampaignsStore()

// State
const activityFilter = ref('all')
const campaign = ref(null)

// Mock analytics data (replace with real API calls)
const analytics = ref({
  sent: 1250,
  opens: 742,
  clicks: 156,
  bounces: 23,
  openRate: 59.4,
  clickRate: 12.5,
  bounceRate: 1.8
})

const deviceStats = ref([
  { name: 'Desktop', count: 445, percentage: 60 },
  { name: 'Mobile', count: 222, percentage: 30 },
  { name: 'Tablet', count: 75, percentage: 10 }
])

const topLinks = ref([
  { id: 1, url: 'https://example.com/product', title: 'Main Product Page', clicks: 89 },
  { id: 2, url: 'https://example.com/offer', title: 'Special Offer', clicks: 67 },
  { id: 3, url: 'https://example.com/blog', title: 'Blog Post', clicks: 34 }
])

const recipientActivity = ref([
  {
    id: 1,
    email: 'john.doe@example.com',
    type: 'clicked',
    description: 'Clicked on "Special Offer" link',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    type: 'opened',
    description: 'Opened email on mobile device',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: 3,
    email: 'bounced@invalid.com',
    type: 'bounced',
    description: 'Hard bounce - invalid email',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  }
])

const geoData = ref([
  { country: 'USA', flag: '🇺🇸', opens: 450 },
  { country: 'UK', flag: '🇬🇧', opens: 120 },
  { country: 'Canada', flag: '🇨🇦', opens: 89 },
  { country: 'France', flag: '🇫🇷', opens: 67 },
  { country: 'Germany', flag: '🇩🇪', opens: 45 },
  { country: 'Spain', flag: '🇪🇸', opens: 34 }
])

// Computed
const filteredActivity = computed(() => {
  if (activityFilter.value === 'all') return recipientActivity.value
  return recipientActivity.value.filter(activity => activity.type === activityFilter.value)
})

// Methods
const loadCampaignData = async () => {
  try {
    const campaignId = Number(route.params.id)
    await campaignsStore.fetchCampaign(campaignId)
    campaign.value = campaignsStore.currentCampaign
  } catch (error) {
    showError('Failed to load campaign data')
  }
}

const refreshData = async () => {
  showInfo('Refreshing analytics data...')
  await loadCampaignData()
  showSuccess('Analytics data refreshed!')
}

const exportData = () => {
  showInfo('Exporting analytics data...')
  // Implement export functionality
}

const exportLinks = () => {
  showInfo('Exporting link performance data...')
  // Implement link export functionality
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not sent'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Lifecycle
onMounted(() => {
  loadCampaignData()
})
</script>