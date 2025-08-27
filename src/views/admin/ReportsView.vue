<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.reports.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('admin.reports.description') }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <SelectField
          v-model="selectedPeriod"
          :options="periodOptions"
          class="w-40"
          @change="handlePeriodChange"
        />
        <Button
          variant="outline"
          @click="exportReport"
          :loading="exporting"
          class="flex items-center"
        >
          <Download class="w-4 h-4 mr-2" />
          {{ $t('admin.reports.export') }}
        </Button>
        <Button
          variant="outline"
          @click="refreshReports"
          :loading="loading"
          class="flex items-center"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          {{ $t('common.refresh') }}
        </Button>
      </div>
    </div>

    <!-- Report Type Tabs -->
    <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button
        v-for="tab in reportTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
          activeTab === tab.id
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <component :is="tab.icon" class="h-4 w-4 mr-2" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
        </div>
      </div>
      <div class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
      </div>
    </div>

    <!-- Usage Report -->
    <div v-else-if="activeTab === 'usage'" class="space-y-6">
      <!-- Usage Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="p-6">
          <div class="flex items-center">
            <Users class="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.usage.activeUsers') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ usageReport?.active_users?.toLocaleString() || 0 }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedPeriodLabel }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <Mail class="h-12 w-12 text-green-600 dark:text-green-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.usage.totalEmails') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ usageReport?.total_emails_sent?.toLocaleString() || 0 }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedPeriodLabel }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <Send class="h-12 w-12 text-purple-600 dark:text-purple-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.usage.totalCampaigns') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ usageReport?.total_campaigns?.toLocaleString() || 0 }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedPeriodLabel }}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Usage Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('admin.reports.usage.topUsers') }}
          </h3>
          <div v-if="usageReport?.top_users?.length">
            <div class="space-y-3">
              <div
                v-for="(user, index) in usageReport.top_users"
                :key="user.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.emails_sent.toLocaleString() }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('admin.reports.usage.emailsSent') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Users class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('admin.reports.usage.noTopUsers') }}
            </p>
          </div>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('admin.reports.usage.smtpUsage') }}
          </h3>
          <div v-if="usageReport?.smtp_usage?.length">
            <div class="space-y-3">
              <div
                v-for="server in usageReport.smtp_usage"
                :key="server.name"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ server.name }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ server.emails_sent_today.toLocaleString() }} / {{ server.daily_limit?.toLocaleString() || '∞' }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all"
                    :style="{ width: `${server.usage_percentage}%` }"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ server.usage_percentage.toFixed(1) }}% {{ $t('admin.reports.usage.used') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Server class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('admin.reports.usage.noSmtpData') }}
            </p>
          </div>
        </Card>
      </div>
    </div>

    <!-- Revenue Report -->
    <div v-else-if="activeTab === 'revenue'" class="space-y-6">
      <!-- Revenue Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card class="p-6">
          <div class="flex items-center">
            <DollarSign class="h-12 w-12 text-green-600 dark:text-green-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.revenue.totalRevenue') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                ${{ revenueReport?.total_revenue?.toLocaleString() || 0 }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <CreditCard class="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.revenue.totalTransactions') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ revenueReport?.total_transactions?.toLocaleString() || 0 }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <TrendingUp class="h-12 w-12 text-purple-600 dark:text-purple-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.revenue.averageTransaction') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                ${{ revenueReport?.average_transaction?.toFixed(2) || '0.00' }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <Calendar class="h-12 w-12 text-orange-600 dark:text-orange-400" />
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.revenue.period') }}
              </p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ selectedPeriodLabel }}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Revenue Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('admin.reports.revenue.dailyRevenue') }}
          </h3>
          <!--
          <RevenueChart
            v-if="revenueReport?.revenue_by_day"
            :data="revenueReport.revenue_by_day"
            :period="selectedPeriod"
          />
          -->
          <div class="text-center py-8">
            <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('admin.reports.revenue.noRevenueData') }}
            </p>
          </div>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('admin.reports.revenue.topCustomers') }}
          </h3>
          <div v-if="revenueReport?.top_customers?.length">
            <div class="space-y-3">
              <div
                v-for="(customer, index) in revenueReport.top_customers"
                :key="customer.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-green-600 dark:text-green-400">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ customer.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ customer.email }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    ${{ customer.total_spent.toLocaleString() }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('admin.reports.revenue.totalSpent') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Users class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('admin.reports.revenue.noTopCustomers') }}
            </p>
          </div>
        </Card>
      </div>
    </div>

    <!-- Campaigns Report -->
    <div v-else-if="activeTab === 'campaigns'" class="space-y-6">
      <!-- Campaign Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="p-6">
          <div class="flex items-center">
            <Mail class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.totalCampaigns') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.total_campaigns?.toLocaleString() || 0 }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <Send class="h-8 w-8 text-green-600 dark:text-green-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.campaignsSent') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.campaigns_sent?.toLocaleString() || 0 }}
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <Eye class="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.openRate') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.overall_open_rate?.toFixed(1) || 0 }}%
              </p>
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center">
            <MousePointer class="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.clickRate') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.overall_click_rate?.toFixed(1) || 0 }}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.deliveryRate') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.overall_delivery_rate?.toFixed(1) || 0 }}%
              </p>
            </div>
            <CheckCircle class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.bounceRate') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.overall_bounce_rate?.toFixed(1) || 0 }}%
              </p>
            </div>
            <XCircle class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.totalEmails') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.total_emails_sent?.toLocaleString() || 0 }}
              </p>
            </div>
            <Mail class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('admin.reports.campaigns.emailsDelivered') }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ campaignsReport?.total_emails_delivered?.toLocaleString() || 0 }}
              </p>
            </div>
            <Truck class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>
      </div>

      <!-- Campaign Status Chart -->
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.reports.campaigns.campaignsByStatus') }}
        </h3>
        <!--
        <CampaignStatusChart
          v-if="campaignsReport?.campaigns_by_status"
          :data="campaignsReport.campaigns_by_status"
        />
        -->
        <div class="text-center py-8">
          <PieChart class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('admin.reports.campaigns.noCampaignData') }}
          </p>
        </div>
      </Card>
    </div>

    <!-- Custom Date Range Modal -->
    <!--
    <DateRangeModal
      v-model="showDateRange"
      @apply="handleDateRangeApply"
    />
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Download,
  RefreshCw,
  Users,
  Mail,
  Send,
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  BarChart3,
  Eye,
  MousePointer,
  CheckCircle,
  XCircle,
  Truck,
  Server,
  Activity,
  PieChart
} from 'lucide-vue-next'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SelectField from '@/components/ui/SelectField.vue'
// import RevenueChart from '@/components/admin/reports/RevenueChart.vue'
// import CampaignStatusChart from '@/components/admin/reports/CampaignStatusChart.vue'
// import DateRangeModal from '@/components/admin/reports/DateRangeModal.vue'

// Stores
import { useAdminStore } from '@/stores/admin'
import { useNotificationStore } from '@/stores/notifications'

// Types
import type { UsageReport, RevenueReport, CampaignsReport } from '@/types/admin'

const { t } = useI18n()
const adminStore = useAdminStore()
const notificationStore = useNotificationStore()

// Reactive data
const activeTab = ref('usage')
const selectedPeriod = ref('30d')
const loading = ref(false)
const exporting = ref(false)
const showDateRange = ref(false)

const usageReport = ref<UsageReport | null>(null)
const revenueReport = ref<RevenueReport | null>(null)
const campaignsReport = ref<CampaignsReport | null>(null)

// Computed
const reportTabs = computed(() => [
  {
    id: 'usage',
    name: t('admin.reports.tabs.usage'),
    icon: Activity
  },
  {
    id: 'revenue',
    name: t('admin.reports.tabs.revenue'),
    icon: DollarSign
  },
  {
    id: 'campaigns',
    name: t('admin.reports.tabs.campaigns'),
    icon: BarChart3
  }
])

const periodOptions = computed(() => [
  { value: '7d', label: t('admin.reports.period.7d') },
  { value: '30d', label: t('admin.reports.period.30d') },
  { value: '90d', label: t('admin.reports.period.90d') },
  { value: '1y', label: t('admin.reports.period.1y') },
  { value: 'custom', label: t('admin.reports.period.custom') }
])

const selectedPeriodLabel = computed(() => {
  const option = periodOptions.value.find(p => p.value === selectedPeriod.value)
  return option?.label || selectedPeriod.value
})

// Methods
const handlePeriodChange = () => {
  if (selectedPeriod.value === 'custom') {
    showDateRange.value = true
  } else {
    loadReports()
  }
}

const handleDateRangeApply = (range: { start: string; end: string }) => {
  // Handle custom date range
  loadReports(range.start, range.end)
}

const loadReports = async (startDate?: string, endDate?: string) => {
  loading.value = true
  try {
    const params = {
      period: selectedPeriod.value,
      ...(startDate && endDate && { start_date: startDate, end_date: endDate })
    }

    const [usage, revenue, campaigns] = await Promise.all([
      adminStore.fetchUsageReport(params),
      adminStore.fetchRevenueReport(params),
      adminStore.fetchCampaignsReport(params)
    ])

    usageReport.value = usage
    revenueReport.value = revenue
    campaignsReport.value = campaigns
  } catch (error) {
    notificationStore.error(t('admin.reports.loadError'))
  } finally {
    loading.value = false
  }
}

const refreshReports = () => {
  loadReports()
}

const exportReport = async () => {
  exporting.value = true
  try {
    const reportType = activeTab.value
    const params = {
      type: reportType,
      period: selectedPeriod.value
    }
    
    await adminStore.exportReport(params)
    notificationStore.success(t('admin.reports.exportSuccess'))
  } catch (error) {
    notificationStore.error(t('admin.reports.exportError'))
  } finally {
    exporting.value = false
  }
}

// Watchers
watch(activeTab, () => {
  // Refresh data when tab changes if needed
  if (!loading.value) {
    loadReports()
  }
})

// Lifecycle
onMounted(() => {
  loadReports()
})
</script>

<style scoped>
/* Scoped styles go here */
</style> 