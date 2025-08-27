<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.dashboard.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('admin.dashboard.overview') }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <Button
          variant="outline"
          @click="refreshData"
          :loading="loading"
          class="flex items-center"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          {{ $t('common.refresh') }}
        </Button>
      </div>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        :title="$t('admin.dashboard.users')"
        :value="totalUsers.toString()"
        :icon="Users"
        color="blue"
        :trend="userTrend"
        :subtitle="$t('admin.dashboard.activeUsers', { count: activeUsers })"
      />
      <StatsCard
        :title="$t('admin.dashboard.campaigns')"
        :value="totalCampaigns.toString()"
        :icon="Mail"
        color="green"
        :trend="campaignTrend"
        :subtitle="$t('admin.dashboard.campaignsThisMonth', { count: campaignsThisMonth })"
      />
      <StatsCard
        :title="$t('admin.dashboard.emails')"
        :value="totalEmails.toString()"
        :icon="Send"
        color="purple"
        :trend="emailTrend"
        :subtitle="$t('admin.dashboard.emailsThisMonth', { count: emailsThisMonth })"
      />
      <StatsCard
        :title="$t('admin.dashboard.revenue')"
        :value="`$${totalRevenue.toLocaleString()}`"
        :icon="DollarSign"
        color="orange"
        :trend="revenueTrend"
        :subtitle="$t('admin.dashboard.revenueThisMonth', { amount: revenueThisMonth })"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daily Stats Chart -->
      <Card class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('admin.dashboard.dailyStats') }}
          </h3>
          <SelectField
            v-model="chartPeriod"
            :options="periodOptions"
            class="w-32"
          />
        </div>
        <div v-if="loading" class="h-64 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <!--
        <DailyStatsChart v-else :data="chartData" :period="chartPeriod" />
        -->
        <div v-else class="text-center py-8 h-64 flex items-center justify-center">
          <div>
            <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('admin.dashboard.chartsComingSoon') }}
            </p>
          </div>
        </div>
      </Card>

      <!-- System Health -->
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.dashboard.systemHealth') }}
        </h3>
        <!--
        <SystemHealthGrid :health="systemHealth" />
        -->
        <div class="text-center py-8">
          <Server class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('admin.dashboard.systemHealthComingSoon') }}
          </p>
        </div>
      </Card>
    </div>

    <!-- Activity and Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.dashboard.recentActivity') }}
        </h3>
        <div v-if="loading" class="space-y-3">
          <SkeletonLoader :rows="5" />
        </div>
        <div v-else-if="recentActivities.length === 0" class="text-center py-8">
          <Activity class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('admin.dashboard.noRecentActivity') }}
          </p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex-shrink-0">
              <component
                :is="getActivityIcon(activity.type)"
                class="h-5 w-5"
                :class="getActivityIconColor(activity.type)"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(activity.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Quick Actions -->
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.dashboard.quickActions') }}
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            class="flex flex-col items-center p-4 h-auto"
            @click="$router.push('/admin/users')"
          >
            <Users class="h-6 w-6 mb-2" />
            <span class="text-sm">{{ $t('admin.dashboard.manageUsers') }}</span>
          </Button>
          
          <Button
            variant="outline"
            class="flex flex-col items-center p-4 h-auto"
            @click="$router.push('/admin/templates')"
          >
            <FileText class="h-6 w-6 mb-2" />
            <span class="text-sm">{{ $t('admin.dashboard.manageTemplates') }}</span>
          </Button>
          
          <Button
            variant="outline"
            class="flex flex-col items-center p-4 h-auto"
            @click="$router.push('/admin/smtp')"
          >
            <Server class="h-6 w-6 mb-2" />
            <span class="text-sm">{{ $t('admin.dashboard.manageSmtp') }}</span>
          </Button>
          
          <Button
            variant="outline"
            class="flex flex-col items-center p-4 h-auto"
            @click="$router.push('/admin/reports')"
          >
            <BarChart3 class="h-6 w-6 mb-2" />
            <span class="text-sm">{{ $t('admin.dashboard.viewReports') }}</span>
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  Users,
  Mail,
  Send,
  DollarSign,
  RefreshCw,
  Activity,
  FileText,
  Server,
  BarChart3,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

// Stores
import { useAdminStore } from '@/stores/admin'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import SelectField from '@/components/ui/SelectField.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
// import DailyStatsChart from '@/components/admin/DailyStatsChart.vue'
// import SystemHealthGrid from '@/components/admin/SystemHealthGrid.vue'

const { t } = useI18n()
const router = useRouter()

// Store
const adminStore = useAdminStore()

// Reactive data
const chartPeriod = ref('7d')

// Computed properties
const loading = computed(() => adminStore.loading)
const dashboardData = computed(() => adminStore.dashboardData)

const totalUsers = computed(() => dashboardData.value?.stats.total_users || 0)
const activeUsers = computed(() => dashboardData.value?.stats.active_users || 0)
const totalCampaigns = computed(() => dashboardData.value?.stats.total_campaigns || 0)
const campaignsThisMonth = computed(() => dashboardData.value?.stats.campaigns_this_month || 0)
const totalEmails = computed(() => dashboardData.value?.stats.total_emails_sent || 0)
const emailsThisMonth = computed(() => dashboardData.value?.stats.emails_sent_this_month || 0)
const totalRevenue = computed(() => dashboardData.value?.stats.total_revenue || 0)
const revenueThisMonth = computed(() => dashboardData.value?.stats.revenue_this_month || 0)

const chartData = computed(() => dashboardData.value?.daily_stats || [])

const userTrend = computed(() => ({
  value: 12.5,
  isPositive: true
}))

const campaignTrend = computed(() => ({
  value: 8.2,
  isPositive: true
}))

const emailTrend = computed(() => ({
  value: 15.3,
  isPositive: true
}))

const revenueTrend = computed(() => ({
  value: 23.1,
  isPositive: true
}))

const periodOptions = computed(() => [
  { value: '7d', label: t('admin.dashboard.last7Days') },
  { value: '30d', label: t('admin.dashboard.last30Days') },
  { value: '90d', label: t('admin.dashboard.last90Days') }
])

const systemHealth = computed(() => ({
  database: { status: 'healthy', responseTime: 45 },
  smtp: { status: 'healthy', activeServers: 3 },
  storage: { status: 'warning', usage: 78 },
  api: { status: 'healthy', responseTime: 120 }
}))

const recentActivities = ref([
  {
    id: 1,
    type: 'user_registered',
    description: 'New user registered: john@example.com',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'campaign_sent',
    description: 'Campaign "Welcome Series" sent to 1,250 recipients',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    type: 'system_alert',
    description: 'SMTP server reached 80% capacity',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
])

// Methods
const refreshData = async () => {
  await adminStore.fetchDashboard()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return t('admin.dashboard.justNow')
  } else if (diffInHours < 24) {
    return t('admin.dashboard.hoursAgo', { hours: diffInHours })
  } else {
    const days = Math.floor(diffInHours / 24)
    return t('admin.dashboard.daysAgo', { days })
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_registered':
      return UserPlus
    case 'campaign_sent':
      return Mail
    case 'system_alert':
      return AlertTriangle
    default:
      return Activity
  }
}

const getActivityIconColor = (type: string): string => {
  switch (type) {
    case 'user_registered':
      return 'text-green-600'
    case 'campaign_sent':
      return 'text-blue-600'
    case 'system_alert':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Scoped styles go here */
</style> 