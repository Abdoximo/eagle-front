<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Campaign Info -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center space-x-4">
            <button @click="$router.go(-1)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ campaign.name }}</h1>
              <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ formatDate(campaign.sent_at) }}</span>
                <span>•</span>
                <span>{{ formatNumber(campaign.total_recipients) }} recipients</span>
                <span>•</span>
                <Badge :variant="getStatusVariant(campaign.status)">{{ campaign.status }}</Badge>
                <span>•</span>
                <div class="flex items-center space-x-1">
                  <span class="text-xl">{{ getPerformanceEmoji(campaign.engagement_score) }}</span>
                  <span class="font-medium text-gray-700 dark:text-gray-300">Grade {{ campaign.performance_grade }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <button @click="toggleRealTime" :class="[
              'px-4 py-2 rounded-lg transition-colors flex items-center',
              isRealTime ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]">
              <div :class="['w-2 h-2 rounded-full mr-2', isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400']"></div>
              {{ isRealTime ? 'Live' : 'Static' }}
            </button>
            <button @click="exportReport" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download class="w-4 h-4 mr-2 inline" />
              Export
            </button>
            <button @click="viewWebVersion" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ExternalLink class="w-4 h-4 mr-2 inline" />
              Web Version
            </button>
            <button @click="duplicateCampaign" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Copy class="w-4 h-4 mr-2 inline" />
              Duplicate
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Performance Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Delivery Rate -->
        <StatsCard 
          title="Delivery Rate" 
          :value="campaign.delivery_rate" 
          suffix="%" 
          :trend="getTrend(campaign.delivery_rate, 95)" 
          :benchmark="95"
          color="blue"
          icon="CheckCircle"
          description="Successfully delivered emails"
        />
        
        <!-- Open Rate -->
        <StatsCard 
          title="Open Rate" 
          :value="campaign.open_rate" 
          suffix="%" 
          :trend="getTrend(campaign.open_rate, 21.33)" 
          :benchmark="21.33"
          color="green"
          icon="Eye"
          description="Unique email opens"
        />
        
        <!-- Click Rate -->
        <StatsCard 
          title="Click Rate" 
          :value="campaign.click_rate" 
          suffix="%" 
          :trend="getTrend(campaign.click_rate, 2.62)" 
          :benchmark="2.62"
          color="purple"
          icon="MousePointer"
          description="Click-through rate"
        />
        
        <!-- Engagement Score -->
        <StatsCard 
          title="Engagement Score" 
          :value="campaign.engagement_score" 
          suffix="/100" 
          :trend="getTrend(campaign.engagement_score, 70)" 
          :benchmark="70"
          color="indigo"
          icon="TrendingUp"
          description="Overall performance metric"
        />
      </div>

      <!-- Advanced Metrics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Performance Over Time Chart -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Performance Timeline</h3>
              <div class="flex items-center space-x-2">
                <select v-model="timeframe" class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 dark:bg-gray-700 dark:text-white">
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <button @click="refreshChart" class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <RefreshCw class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="h-80">
              <PerformanceChart :data="performanceData" :timeframe="timeframe" />
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="space-y-6">
          <!-- Benchmark Comparison -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">vs Industry Benchmark</h3>
            <div class="space-y-4">
              <BenchmarkBar label="Delivery Rate" :value="campaign.delivery_rate" :benchmark="95" />
              <BenchmarkBar label="Open Rate" :value="campaign.open_rate" :benchmark="21.33" />
              <BenchmarkBar label="Click Rate" :value="campaign.click_rate" :benchmark="2.62" />
              <BenchmarkBar label="Bounce Rate" :value="campaign.bounce_rate" :benchmark="0.43" inverted />
            </div>
          </div>

          <!-- Top Performing Content -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Links</h3>
            <div class="space-y-3">
              <div v-for="link in topLinks" :key="link.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ link.text }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ link.url }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ link.clicks }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">clicks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in analyticsTabsTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 inline mr-2" />
              {{ tab.label }}
              <span v-if="tab.count" class="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">{{ tab.count }}</span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Geographic Performance -->
          <div v-if="activeTab === 'geographic'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Country</h4>
                <div class="space-y-3">
                  <div v-for="country in geographicData" :key="country.code" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="text-2xl">{{ country.flag }}</div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ country.name }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ country.recipients }} recipients</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ country.open_rate }}%</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">open rate</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Cities</h4>
                <div class="space-y-3">
                  <div v-for="city in topCities" :key="city.name" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ city.name }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ city.recipients }} recipients</p>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center space-x-2">
                        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ city.engagement }}%</div>
                        <div :class="['w-2 h-2 rounded-full', getEngagementColor(city.engagement)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Device & Platform Analytics -->
          <div v-if="activeTab === 'devices'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Types</h4>
                <div class="space-y-3">
                  <div v-for="device in deviceData" :key="device.type" class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <component :is="getDeviceIcon(device.type)" class="w-5 h-5 text-gray-500" />
                      <span class="text-gray-900 dark:text-white">{{ device.type }}</span>
                    </div>
                    <div class="text-right">
                      <span class="font-bold text-gray-900 dark:text-white">{{ device.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Clients</h4>
                <div class="space-y-3">
                  <div v-for="client in emailClients" :key="client.name" class="flex items-center justify-between">
                    <span class="text-gray-900 dark:text-white">{{ client.name }}</span>
                    <span class="font-bold text-gray-900 dark:text-white">{{ client.percentage }}%</span>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Operating Systems</h4>
                <div class="space-y-3">
                  <div v-for="os in operatingSystems" :key="os.name" class="flex items-center justify-between">
                    <span class="text-gray-900 dark:text-white">{{ os.name }}</span>
                    <span class="font-bold text-gray-900 dark:text-white">{{ os.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-time Activity Feed -->
          <div v-if="activeTab === 'activity'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Live Activity Feed</h4>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Live updates</span>
              </div>
            </div>
            <div class="max-h-96 overflow-y-auto space-y-2">
              <div v-for="activity in realtimeActivity" :key="activity.id" class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div :class="['w-2 h-2 rounded-full', getActivityColor(activity.type)]"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">
                    <span class="font-medium">{{ activity.email }}</span>
                    {{ getActivityText(activity.type) }}
                    <span v-if="activity.link" class="text-blue-600 dark:text-blue-400">{{ activity.link }}</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatActivityTime(activity.timestamp) }} • {{ activity.location }}
                  </p>
                </div>
                <Badge :variant="getActivityBadgeVariant(activity.type)" size="sm">
                  {{ activity.type }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- Email Status Tracking -->
          <div v-if="activeTab === 'recipients'" class="space-y-6">
            <EmailStatusTracker :campaign-id="campaign.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Download, ExternalLink, Copy, CheckCircle, Eye, MousePointer, 
  TrendingUp, RefreshCw, Globe, Smartphone, Monitor, Tablet, Activity,
  Users, Mail, MapPin
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import StatsCard from '@/components/charts/StatsCard.vue'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import BenchmarkBar from '@/components/charts/BenchmarkBar.vue'
import EmailStatusTracker from '@/components/campaigns/EmailStatusTracker.vue'
import { showSuccess, showError } from '@/services/toast'

const route = useRoute()
const router = useRouter()

// State
const isRealTime = ref(true)
const timeframe = ref('24h')
const activeTab = ref(route.query.tab === 'emails' ? 'recipients' : 'geographic')
const emailSearchQuery = ref('')
const emailFilter = ref('')
let realTimeInterval = null

// Mock campaign data - replace with real API calls
const campaign = ref({
  id: route.params.id,
  name: 'Black Friday Mega Sale 2024',
  status: 'sent',
  sent_at: '2024-01-15T10:00:00Z',
  total_recipients: 15420,
  delivery_rate: 97.8,
  open_rate: 28.5,
  click_rate: 4.2,
  bounce_rate: 0.8,
  engagement_score: 85,
  performance_grade: 'A-'
})

// Analytics tabs configuration
const analyticsTabsTabs = [
  { key: 'geographic', label: 'Geographic', icon: Globe, count: null },
  { key: 'devices', label: 'Devices & Platforms', icon: Smartphone, count: null },
  { key: 'activity', label: 'Live Activity', icon: Activity, count: 45 },
  { key: 'recipients', label: 'Email Performance', icon: Mail, count: campaign.value.total_recipients },
]

// Mock data
const performanceData = ref([])
const geographicData = ref([
  { code: 'US', name: 'United States', flag: '🇺🇸', recipients: 8520, open_rate: 32.1 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', recipients: 2180, open_rate: 29.8 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', recipients: 1890, open_rate: 26.4 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', recipients: 1420, open_rate: 31.2 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', recipients: 1410, open_rate: 24.8 }
])

const topCities = ref([
  { name: 'New York, NY', recipients: 1250, engagement: 85 },
  { name: 'Los Angeles, CA', recipients: 980, engagement: 78 },
  { name: 'Toronto, ON', recipients: 720, engagement: 82 },
  { name: 'London, UK', recipients: 680, engagement: 76 },
  { name: 'Sydney, AU', recipients: 540, engagement: 89 }
])

const deviceData = ref([
  { type: 'Mobile', percentage: 68 },
  { type: 'Desktop', percentage: 25 },
  { type: 'Tablet', percentage: 7 }
])

const emailClients = ref([
  { name: 'Apple Mail', percentage: 35 },
  { name: 'Gmail', percentage: 28 },
  { name: 'Outlook', percentage: 22 },
  { name: 'Yahoo Mail', percentage: 8 },
  { name: 'Others', percentage: 7 }
])

const operatingSystems = ref([
  { name: 'iOS', percentage: 42 },
  { name: 'Android', percentage: 31 },
  { name: 'Windows', percentage: 18 },
  { name: 'macOS', percentage: 7 },
  { name: 'Others', percentage: 2 }
])

const topLinks = ref([
  { id: 1, text: 'Shop Now - Black Friday', url: 'https://store.com/black-friday', clicks: 1825 },
  { id: 2, text: 'Free Shipping Offer', url: 'https://store.com/free-shipping', clicks: 1204 },
  { id: 3, text: 'View All Deals', url: 'https://store.com/deals', clicks: 892 },
  { id: 4, text: 'Contact Support', url: 'https://store.com/support', clicks: 245 }
])

const realtimeActivity = ref([])
const emailPerformanceData = ref([])

// Computed
const filteredEmails = computed(() => {
  let filtered = emailPerformanceData.value
  
  if (emailSearchQuery.value) {
    filtered = filtered.filter(email => 
      email.address.toLowerCase().includes(emailSearchQuery.value.toLowerCase())
    )
  }
  
  if (emailFilter.value) {
    filtered = filtered.filter(email => email.status === emailFilter.value)
  }
  
  return filtered
})

// Methods
const getTrend = (value, benchmark) => {
  const diff = value - benchmark
  return {
    direction: diff >= 0 ? 'up' : 'down',
    percentage: Math.abs(diff).toFixed(1)
  }
}

const getPerformanceEmoji = (score) => {
  if (score >= 90) return '🏆'
  if (score >= 80) return '🎯'
  if (score >= 70) return '👍'
  if (score >= 60) return '📈'
  return '⚠️'
}

const getStatusVariant = (status) => {
  const variants = {
    sent: 'success',
    sending: 'warning',
    draft: 'secondary',
    scheduled: 'info',
    cancelled: 'error'
  }
  return variants[status] || 'secondary'
}

const getDeviceIcon = (device) => {
  const icons = {
    Mobile: Smartphone,
    Desktop: Monitor,
    Tablet: Tablet
  }
  return icons[device] || Monitor
}

const getEngagementColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getActivityColor = (type) => {
  const colors = {
    open: 'bg-blue-500',
    click: 'bg-green-500',
    bounce: 'bg-red-500',
    unsubscribe: 'bg-gray-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityText = (type) => {
  const texts = {
    open: 'opened the email',
    click: 'clicked on',
    bounce: 'email bounced',
    unsubscribe: 'unsubscribed'
  }
  return texts[type] || 'performed an action'
}

const getActivityBadgeVariant = (type) => {
  const variants = {
    open: 'info',
    click: 'success',
    bounce: 'error',
    unsubscribe: 'warning'
  }
  return variants[type] || 'secondary'
}

const getEmailStatusVariant = (status) => {
  const variants = {
    delivered: 'success',
    opened: 'info',
    clicked: 'success',
    bounced: 'error',
    complained: 'error'
  }
  return variants[status] || 'secondary'
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatActivityTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return time.toLocaleDateString()
}

const toggleRealTime = () => {
  isRealTime.value = !isRealTime.value
  if (isRealTime.value) {
    startRealTimeUpdates()
  } else {
    stopRealTimeUpdates()
  }
}

const startRealTimeUpdates = () => {
  realTimeInterval = setInterval(() => {
    // Simulate real-time activity
    const activities = ['open', 'click', 'bounce', 'unsubscribe']
    const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com']
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL']
    const links = ['Shop Now', 'View Details', 'Learn More']
    
    const newActivity = {
      id: Date.now(),
      type: activities[Math.floor(Math.random() * activities.length)],
      email: emails[Math.floor(Math.random() * emails.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date().toISOString(),
      link: Math.random() > 0.5 ? links[Math.floor(Math.random() * links.length)] : null
    }
    
    realtimeActivity.value.unshift(newActivity)
    if (realtimeActivity.value.length > 50) {
      realtimeActivity.value = realtimeActivity.value.slice(0, 50)
    }
  }, 3000)
}

const stopRealTimeUpdates = () => {
  if (realTimeInterval) {
    clearInterval(realTimeInterval)
    realTimeInterval = null
  }
}

const refreshChart = () => {
  // Simulate chart refresh
  showSuccess('Chart data refreshed')
}

const exportReport = () => {
  // TODO: Implement export functionality
  showSuccess('Report export started')
}

const viewWebVersion = () => {
  const webUrl = `${window.location.origin}/campaigns/${campaign.value.id}/web`
  window.open(webUrl, '_blank')
}

const duplicateCampaign = () => {
  router.push({
    name: 'CampaignCreate',
    query: { duplicate: campaign.value.id }
  })
}

// Initialize mock data
const initializeMockData = () => {
  // Generate performance chart data
  const hours = Array.from({ length: 24 }, (_, i) => i)
  performanceData.value = hours.map(hour => ({
    hour,
    opens: Math.floor(Math.random() * 100) + 50,
    clicks: Math.floor(Math.random() * 30) + 10,
    deliveries: Math.floor(Math.random() * 200) + 100
  }))
  
  // Generate email performance data
  emailPerformanceData.value = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    address: `user${i + 1}@example.com`,
    status: ['delivered', 'opened', 'clicked', 'bounced'][Math.floor(Math.random() * 4)],
    delivered_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    open_count: Math.floor(Math.random() * 5),
    click_count: Math.floor(Math.random() * 3),
    location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL'][Math.floor(Math.random() * 3)],
    engagement_score: Math.floor(Math.random() * 100)
  }))
  
  // Initial real-time activity
  realtimeActivity.value = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    type: ['open', 'click'][Math.floor(Math.random() * 2)],
    email: `user${i + 1}@example.com`,
    location: 'New York, NY',
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    link: Math.random() > 0.5 ? 'Shop Now' : null
  }))
}

onMounted(() => {
  initializeMockData()
  if (isRealTime.value) {
    startRealTimeUpdates()
  }
})

onUnmounted(() => {
  stopRealTimeUpdates()
})
</script>
