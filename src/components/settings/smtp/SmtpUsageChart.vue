<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="chartData.length === 0" class="flex items-center justify-center h-64">
      <EmptyState
        :icon="BarChart3"
        :title="$t('settings.smtp.analytics.noData')"
        :description="$t('settings.smtp.analytics.noDataDescription')"
      />
    </div>
    
    <div v-else class="space-y-4">
      <!-- Chart Header -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('settings.smtp.analytics.usageTitle') }}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.smtp.analytics.usageDescription') }}
          </p>
        </div>
        
        <SelectField
          v-model="selectedPeriod"
          :options="periodOptions"
          class="w-32"
        />
      </div>

      <!-- Usage Bars -->
      <div class="space-y-3">
        <div
          v-for="server in chartData"
          :key="server.id"
          class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-6 w-6">
                <div 
                  class="h-6 w-6 rounded-full flex items-center justify-center"
                  :class="server.is_active 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                >
                  <Server class="h-3 w-3" />
                </div>
              </div>
              <div class="ml-3">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ server.name }}
                </h5>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ server.host }}
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ server.usage.toLocaleString() }} / {{ server.limit ? server.limit.toLocaleString() : '∞' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ Math.round(server.percentage) }}% {{ $t('common.used') }}
              </div>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-300"
              :class="getProgressBarColor(server.percentage)"
              :style="{ width: `${Math.min(100, server.percentage)}%` }"
            ></div>
          </div>
          
          <!-- Usage Stats -->
          <div class="mt-3 grid grid-cols-3 gap-4 text-xs">
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ server.hourlyUsage.toLocaleString() }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.analytics.thisHour') }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ (server.stats?.success_rate || 0) }}%
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.analytics.successRate') }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(server.last_used_at) }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.analytics.lastUsed') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ totalUsage.toLocaleString() }}
            </div>
            <div class="text-xs text-blue-700 dark:text-blue-300">
              {{ $t('settings.smtp.analytics.totalSent') }}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ activeServersCount }}
            </div>
            <div class="text-xs text-green-700 dark:text-green-300">
              {{ $t('settings.smtp.analytics.activeServers') }}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ averageUsage }}%
            </div>
            <div class="text-xs text-orange-700 dark:text-orange-300">
              {{ $t('settings.smtp.analytics.avgUsage') }}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ overallSuccessRate }}%
            </div>
            <div class="text-xs text-purple-700 dark:text-purple-300">
              {{ $t('settings.smtp.analytics.overallSuccess') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Server, BarChart3 } from 'lucide-vue-next'

// Components
import SelectField from '@/components/ui/SelectField.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

// Types
import type { SmtpServer } from '@/types/smtp'

interface Props {
  servers: SmtpServer[]
  loading?: boolean
}

interface ChartDataItem {
  id: number
  name: string
  host: string
  is_active: boolean
  usage: number
  limit: number | null
  percentage: number
  hourlyUsage: number
  stats?: {
    success_rate: number
  }
  last_used_at?: string
}

const props = defineProps<Props>()

const { t } = useI18n()

// State
const selectedPeriod = ref('daily')

// Computed
const periodOptions = computed(() => [
  { value: 'hourly', label: t('settings.smtp.analytics.hourly') },
  { value: 'daily', label: t('settings.smtp.analytics.daily') },
  { value: 'weekly', label: t('settings.smtp.analytics.weekly') },
  { value: 'monthly', label: t('settings.smtp.analytics.monthly') },
])

const chartData = computed((): ChartDataItem[] => {
  return props.servers.map(server => {
    const usage = getUsageForPeriod(server)
    const limit = getLimitForPeriod(server)
    const percentage = limit ? (usage / limit) * 100 : 0
    
    return {
      id: server.id,
      name: server.name,
      host: server.host,
      is_active: server.is_active,
      usage,
      limit,
      percentage,
      hourlyUsage: server.emails_sent_hour || 0,
      stats: server.stats,
      last_used_at: server.last_used_at,
    }
  })
})

const totalUsage = computed(() => 
  chartData.value.reduce((total, server) => total + server.usage, 0)
)

const activeServersCount = computed(() => 
  chartData.value.filter(server => server.is_active).length
)

const averageUsage = computed(() => {
  const serversWithLimits = chartData.value.filter(server => server.limit)
  if (serversWithLimits.length === 0) return 0
  
  const totalPercentage = serversWithLimits.reduce((total, server) => total + server.percentage, 0)
  return Math.round(totalPercentage / serversWithLimits.length)
})

const overallSuccessRate = computed(() => {
  const serversWithStats = chartData.value.filter(server => server.stats?.success_rate !== undefined)
  if (serversWithStats.length === 0) return 0
  
  const totalSuccessRate = serversWithStats.reduce((total, server) => total + (server.stats?.success_rate || 0), 0)
  return Math.round(totalSuccessRate / serversWithStats.length)
})

// Methods
const getUsageForPeriod = (server: SmtpServer): number => {
  switch (selectedPeriod.value) {
    case 'hourly':
      return server.emails_sent_hour || 0
    case 'daily':
      return server.emails_sent_today || 0
    case 'weekly':
      return (server.emails_sent_today || 0) * 7 // Approximate
    case 'monthly':
      return (server.emails_sent_today || 0) * 30 // Approximate
    default:
      return server.emails_sent_today || 0
  }
}

const getLimitForPeriod = (server: SmtpServer): number | null => {
  switch (selectedPeriod.value) {
    case 'hourly':
      return server.hourly_limit || null
    case 'daily':
      return server.daily_limit || null
    case 'weekly':
      return server.daily_limit ? server.daily_limit * 7 : null
    case 'monthly':
      return server.daily_limit ? server.daily_limit * 30 : null
    default:
      return server.daily_limit || null
  }
}

const getProgressBarColor = (percentage: number): string => {
  if (percentage >= 90) {
    return 'bg-red-500'
  } else if (percentage >= 75) {
    return 'bg-orange-500'
  } else if (percentage >= 50) {
    return 'bg-yellow-500'
  } else {
    return 'bg-blue-500'
  }
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return t('common.never')
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return t('settings.smtp.analytics.justNow')
  } else if (diffInHours < 24) {
    return t('settings.smtp.analytics.hoursAgo', { hours: diffInHours })
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return t('settings.smtp.analytics.daysAgo', { days: diffInDays })
  }
}

// Watchers
watch(selectedPeriod, () => {
  // Trigger reactivity when period changes
})
</script> 