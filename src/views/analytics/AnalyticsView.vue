<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('analytics.title') }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Track your email campaign performance and engagement metrics.
        </p>
      </div>
      
      <!-- Date range picker -->
      <div class="mt-4 sm:mt-0 flex items-center space-x-2">
        <select v-model="dateRange" class="input text-sm">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
          <option value="custom">Custom range</option>
        </select>
        <Button variant="outline" @click="exportReport">
          Export Report
        </Button>
      </div>
    </div>

    <!-- Key metrics -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        v-for="metric in keyMetrics"
        :key="metric.name"
        :title="metric.name"
        :value="metric.value"
        :change="metric.change"
        :trend="metric.trend"
        :icon="metric.icon"
        :color="metric.color"
      />
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Email performance over time -->
      <Card title="Email Performance" class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Email Performance Over Time
            </h3>
            <div class="flex space-x-2">
              <Button
                v-for="metric in performanceMetrics"
                :key="metric.key"
                size="sm"
                :variant="activePerformanceMetric === metric.key ? 'primary' : 'outline'"
                @click="activePerformanceMetric = metric.key"
              >
                {{ metric.label }}
              </Button>
            </div>
          </div>
        </template>
        
        <LineChart
          :data="performanceChartData"
          :options="performanceChartOptions"
          height="300"
        />
      </Card>
    </div>

    <!-- Detailed analytics -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- Top performing campaigns -->
      <Card title="Top Performing Campaigns">
        <div class="space-y-4">
          <div
            v-for="campaign in topCampaigns"
            :key="campaign.id"
            class="flex items-center justify-between py-2"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ campaign.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(campaign.sent_at) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <Badge variant="success" size="sm">
                {{ formatPercentage(campaign.open_rate) }}
              </Badge>
              <span class="text-sm text-gray-500">
                {{ formatNumber(campaign.total_sent) }}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Email clients -->
      <Card title="Email Clients">
        <DoughnutChart
          :data="emailClientsData"
          :options="doughnutOptions"
          height="200"
        />
        <div class="mt-4 space-y-2">
          <div
            v-for="client in emailClients"
            :key="client.name"
            class="flex items-center justify-between text-sm"
          >
            <div class="flex items-center space-x-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: client.color }"
              ></div>
              <span class="text-gray-900 dark:text-white">{{ client.name }}</span>
            </div>
            <span class="text-gray-500 dark:text-gray-400">
              {{ formatPercentage(client.percentage) }}
            </span>
          </div>
        </div>
      </Card>

      <!-- Geographic data -->
      <Card title="Geographic Distribution">
        <div class="space-y-4">
          <div
            v-for="country in topCountries"
            :key="country.code"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ country.flag }}</span>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ country.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatNumber(country.opens) }} opens
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPercentage(country.percentage) }}
              </div>
              <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  class="bg-primary h-2 rounded-full"
                  :style="{ width: `${country.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Engagement timeline -->
    <Card title="Engagement Timeline">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Email Engagement Timeline
          </h3>
          <div class="flex space-x-2">
            <Button
              v-for="timeframe in timeframes"
              :key="timeframe.key"
              size="sm"
              :variant="activeTimeframe === timeframe.key ? 'primary' : 'outline'"
              @click="activeTimeframe = timeframe.key"
            >
              {{ timeframe.label }}
            </Button>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div v-for="stat in engagementStats" :key="stat.label" class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </div>
          <div v-if="stat.change" class="text-xs mt-1" :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'">
            {{ stat.change }}
          </div>
        </div>
      </div>

      <BarChart
        :data="engagementTimelineData"
        :options="barChartOptions"
        height="250"
      />
    </Card>

    <!-- Detailed campaign table -->
    <Card title="Campaign Performance">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Campaign Performance Details
          </h3>
          <Input
            v-model="campaignSearchQuery"
            type="search"
            placeholder="Search campaigns..."
            :leading-icon="MagnifyingGlassIcon"
            class="w-64"
          />
        </div>
      </template>

      <Table
        :columns="campaignColumns"
        :data="filteredCampaigns"
        :loading="loading"
        empty-message="No campaigns found"
        @sort="handleSort"
      >
        <template #cell-name="{ item }">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ item.name }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.subject }}
            </div>
          </div>
        </template>

        <template #cell-sent_at="{ item }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(item.sent_at) }}
          </span>
        </template>

        <template #cell-recipients="{ item }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ formatNumber(item.total_sent) }}
          </span>
        </template>

        <template #cell-open_rate="{ item }">
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPercentage(item.open_rate) }}
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  class="bg-blue-600 h-1.5 rounded-full"
                  :style="{ width: `${item.open_rate}%` }"
                ></div>
              </div>
            </div>
            <span class="text-xs text-gray-500">
              {{ formatNumber(item.total_opens) }}
            </span>
          </div>
        </template>

        <template #cell-click_rate="{ item }">
          <div class="flex items-center space-x-2">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPercentage(item.click_rate) }}
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  class="bg-green-600 h-1.5 rounded-full"
                  :style="{ width: `${item.click_rate}%` }"
                ></div>
              </div>
            </div>
            <span class="text-xs text-gray-500">
              {{ formatNumber(item.total_clicks) }}
            </span>
          </div>
        </template>

        <template #cell-bounce_rate="{ item }">
          <Badge :variant="item.bounce_rate > 5 ? 'warning' : 'success'" size="sm">
            {{ formatPercentage(item.bounce_rate) }}
          </Badge>
        </template>

        <template #cell-actions="{ item }">
          <Button
            size="sm"
            variant="outline"
            @click="viewCampaignDetails(item.id)"
          >
            View Details
          </Button>
        </template>
      </Table>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total="totalCampaigns"
          :per-page="perPage"
          @page-change="handlePageChange"
        />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalyticsStore } from '@/stores/analytics'
import { useUIStore } from '@/stores/ui'
import { formatDate, formatNumber, formatPercentage } from '@/utils/helpers'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/common/Pagination.vue'
import StatsCard from '@/components/charts/StatsCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import type { TableColumn } from '@/types/common'

const router = useRouter()
const analyticsStore = useAnalyticsStore()
const uiStore = useUIStore()

const loading = ref(false)
const dateRange = ref('30d')
const activePerformanceMetric = ref('opens')
const activeTimeframe = ref('24h')
const campaignSearchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const totalPages = ref(1)
const totalCampaigns = ref(0)

const performanceMetrics = [
  { key: 'opens', label: 'Opens' },
  { key: 'clicks', label: 'Clicks' },
  { key: 'bounces', label: 'Bounces' },
  { key: 'unsubscribes', label: 'Unsubscribes' }
]

const timeframes = [
  { key: '1h', label: '1H' },
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' }
]

const campaignColumns: TableColumn[] = [
  { key: 'name', label: 'Campaign', sortable: true },
  { key: 'sent_at', label: 'Sent', sortable: true },
  { key: 'recipients', label: 'Recipients', sortable: true, align: 'center' },
  { key: 'open_rate', label: 'Open Rate', sortable: true, align: 'center' },
  { key: 'click_rate', label: 'Click Rate', sortable: true, align: 'center' },
  { key: 'bounce_rate', label: 'Bounce Rate', sortable: true, align: 'center' },
  { key: 'actions', label: 'Actions', width: '120px', align: 'right' }
]

const keyMetrics = computed(() => [
  {
    name: 'Total Sent',
    value: formatNumber(analyticsStore.totalSent),
    change: '+12%',
    trend: 'up',
    icon: EnvelopeIcon,
    color: 'blue'
  },
  {
    name: 'Open Rate',
    value: formatPercentage(analyticsStore.averageOpenRate),
    change: '+2.5%',
    trend: 'up',
    icon: EnvelopeOpenIcon,
    color: 'green'
  },
  {
    name: 'Click Rate',
    value: formatPercentage(analyticsStore.averageClickRate),
    change: '+1.8%',
    trend: 'up',
    icon: CursorArrowRaysIcon,
    color: 'purple'
  },
  {
    name: 'Bounce Rate',
    value: formatPercentage(analyticsStore.averageBounceRate),
    change: '-0.5%',
    trend: 'down',
    icon: ExclamationTriangleIcon,
    color: 'red'
  }
])

const performanceChartData = computed(() => ({
  labels: analyticsStore.performanceData.labels,
  datasets: [
    {
      label: performanceMetrics.find(m => m.key === activePerformanceMetric.value)?.label,
      data: analyticsStore.performanceData[activePerformanceMetric.value],
      borderColor: getMetricColor(activePerformanceMetric.value),
      backgroundColor: getMetricColor(activePerformanceMetric.value, 0.1),
      tension: 0.4,
      fill: true
    }
  ]
}))

const performanceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => {
          return activePerformanceMetric.value.includes('rate') 
            ? formatPercentage(value)
            : formatNumber(value)
        }
      }
    }
  }
}

const engagementTimelineData = computed(() => ({
  labels: analyticsStore.engagementTimeline.labels,
  datasets: [
    {
      label: 'Opens',
      data: analyticsStore.engagementTimeline.opens,
      backgroundColor: '#3B82F6'
    },
    {
      label: 'Clicks',
      data: analyticsStore.engagementTimeline.clicks,
      backgroundColor: '#10B981'
    },
    {
      label: 'Unsubscribes',
      data: analyticsStore.engagementTimeline.unsubscribes,
      backgroundColor: '#EF4444'
    }
  ]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    }
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true
    }
  }
}

const emailClientsData = computed(() => ({
  labels: analyticsStore.emailClients.map(c => c.name),
  datasets: [
    {
      data: analyticsStore.emailClients.map(c => c.percentage),
      backgroundColor: analyticsStore.emailClients.map(c => c.color),
      borderWidth: 0
    }
  ]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const topCampaigns = computed(() => analyticsStore.topCampaigns.slice(0, 5))
const emailClients = computed(() => analyticsStore.emailClients.slice(0, 5))
const topCountries = computed(() => analyticsStore.topCountries.slice(0, 5))

const engagementStats = computed(() => [
  {
    label: 'Total Opens',
    value: formatNumber(analyticsStore.engagementStats.totalOpens),
    change: '+8.5%',
    trend: 'up'
  },
  {
    label: 'Unique Opens',
    value: formatNumber(analyticsStore.engagementStats.uniqueOpens),
    change: '+12.3%',
    trend: 'up'
  },
  {
    label: 'Total Clicks',
    value: formatNumber(analyticsStore.engagementStats.totalClicks),
    change: '+15.2%',
    trend: 'up'
  },
  {
    label: 'Unique Clicks',
    value: formatNumber(analyticsStore.engagementStats.uniqueClicks),
    change: '+9.8%',
    trend: 'up'
  }
])

const filteredCampaigns = computed(() => {
  let filtered = [...analyticsStore.campaigns]

  if (campaignSearchQuery.value) {
    const query = campaignSearchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign => 
      campaign.name.toLowerCase().includes(query) ||
      campaign.subject.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getMetricColor = (metric: string, alpha = 1) => {
  const colors = {
    opens: alpha === 1 ? '#3B82F6' : `rgba(59, 130, 246, ${alpha})`,
    clicks: alpha === 1 ? '#10B981' : `rgba(16, 185, 129, ${alpha})`,
    bounces: alpha === 1 ? '#EF4444' : `rgba(239, 68, 68, ${alpha})`,
    unsubscribes: alpha === 1 ? '#F59E0B' : `rgba(245, 158, 11, ${alpha})`
  }
  return colors[metric as keyof typeof colors] || colors.opens
}

const viewCampaignDetails = (campaignId: number) => {
  router.push(`/campaigns/${campaignId}/analytics`)
}

const exportReport = () => {
  // TODO: Implement report export functionality
  console.log('Export report')
}

const handleSort = (column: string, direction: 'asc' | 'desc') => {
  // TODO: Implement sorting
  console.log('Sort:', column, direction)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // TODO: Load campaigns for the new page
}

onMounted(async () => {
  loading.value = true
  
  uiStore.setBreadcrumbs([
    { label: $t('analytics.title') }
  ])

  try {
    await Promise.all([
      analyticsStore.fetchOverviewStats(dateRange.value),
      analyticsStore.fetchPerformanceData(dateRange.value),
      analyticsStore.fetchEngagementTimeline(activeTimeframe.value),
      analyticsStore.fetchCampaignAnalytics(currentPage.value, perPage.value),
      analyticsStore.fetchTopCampaigns(dateRange.value),
      analyticsStore.fetchEmailClients(dateRange.value),
      analyticsStore.fetchGeographicData(dateRange.value)
    ])
  } catch (error) {
    console.error('Failed to load analytics data:', error)
  } finally {
    loading.value = false
  }
})
</script>