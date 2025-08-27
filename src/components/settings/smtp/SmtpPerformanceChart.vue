<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="chartData.length === 0" class="flex items-center justify-center h-64">
      <EmptyState
        :icon="TrendingUp"
        :title="$t('settings.smtp.performance.noData')"
        :description="$t('settings.smtp.performance.noDataDescription')"
      />
    </div>
    
    <div v-else class="space-y-4">
      <!-- Chart Header -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('settings.smtp.performance.title') }}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.smtp.performance.description') }}
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <SelectField
            v-model="selectedMetric"
            :options="metricOptions"
            class="w-40"
          />
        </div>
      </div>

      <!-- Performance Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="server in chartData"
          :key="server.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-8 w-8">
                <div 
                  class="h-8 w-8 rounded-full flex items-center justify-center"
                  :class="getServerStatusColor(server)"
                >
                  <Server class="h-4 w-4" />
                </div>
              </div>
              <div class="ml-3">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ server.name }}
                </h5>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ server.host }}:{{ server.port }}
                </p>
              </div>
            </div>
            
            <StatusBadge
              :status="getPerformanceStatus(server.successRate)"
              :label="getPerformanceLabel(server.successRate)"
            />
          </div>
          
          <!-- Success Rate Circle -->
          <div class="flex items-center justify-center mb-4">
            <div class="relative w-24 h-24">
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  class="text-gray-200 dark:text-gray-700"
                />
                <!-- Progress circle -->
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (server.successRate / 100) * circumference"
                  :class="getSuccessRateColor(server.successRate)"
                  class="transition-all duration-300"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ Math.round(server.successRate) }}%
                </span>
              </div>
            </div>
          </div>
          
          <!-- Performance Stats -->
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ server.totalSent.toLocaleString() }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.performance.totalSent') }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ server.avgResponseTime }}ms
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.performance.avgResponse') }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ server.uptime }}%
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.performance.uptime') }}
              </div>
            </div>
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ server.errors }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.performance.errors') }}
              </div>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 dark:text-gray-400">
                {{ $t('settings.smtp.performance.lastActivity') }}
              </span>
              <span class="text-gray-900 dark:text-white">
                {{ formatLastActivity(server.lastUsed) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Performance Summary -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('settings.smtp.performance.summary') }}
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ overallSuccessRate }}%
            </div>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              {{ $t('settings.smtp.performance.overallSuccess') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('settings.smtp.performance.acrossAllServers') }}
            </div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {{ averageUptime }}%
            </div>
            <div class="text-sm text-green-700 dark:text-green-300">
              {{ $t('settings.smtp.performance.avgUptime') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('settings.smtp.performance.last30Days') }}
            </div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {{ averageResponseTime }}ms
            </div>
            <div class="text-sm text-orange-700 dark:text-orange-300">
              {{ $t('settings.smtp.performance.avgResponseTime') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('settings.smtp.performance.allServers') }}
            </div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {{ totalErrors }}
            </div>
            <div class="text-sm text-red-700 dark:text-red-300">
              {{ $t('settings.smtp.performance.totalErrors') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('settings.smtp.performance.last24Hours') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Server, TrendingUp } from 'lucide-vue-next'

// Components
import SelectField from '@/components/ui/SelectField.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

// Types
import type { SmtpServer } from '@/types/smtp'

interface Props {
  servers: SmtpServer[]
  loading?: boolean
}

interface PerformanceData {
  id: number
  name: string
  host: string
  port: number
  is_active: boolean
  successRate: number
  totalSent: number
  avgResponseTime: number
  uptime: number
  errors: number
  lastUsed?: string
}

const props = defineProps<Props>()

const { t } = useI18n()

// State
const selectedMetric = ref('success_rate')

// Constants
const circumference = 2 * Math.PI * 40

// Computed
const metricOptions = computed(() => [
  { value: 'success_rate', label: t('settings.smtp.performance.successRate') },
  { value: 'response_time', label: t('settings.smtp.performance.responseTime') },
  { value: 'uptime', label: t('settings.smtp.performance.uptime') },
  { value: 'error_rate', label: t('settings.smtp.performance.errorRate') },
])

const chartData = computed((): PerformanceData[] => {
  return props.servers.map(server => ({
    id: server.id,
    name: server.name,
    host: server.host,
    port: server.port,
    is_active: server.is_active,
    successRate: server.stats?.success_rate || 0,
    totalSent: (server.emails_sent_today || 0) + (server.emails_sent_hour || 0),
    avgResponseTime: generateMockResponseTime(), // Mock data
    uptime: generateMockUptime(server.is_active), // Mock data
    errors: generateMockErrors(), // Mock data
    lastUsed: server.last_used_at,
  }))
})

const overallSuccessRate = computed(() => {
  if (chartData.value.length === 0) return 0
  const total = chartData.value.reduce((sum, server) => sum + server.successRate, 0)
  return Math.round(total / chartData.value.length)
})

const averageUptime = computed(() => {
  if (chartData.value.length === 0) return 0
  const total = chartData.value.reduce((sum, server) => sum + server.uptime, 0)
  return Math.round(total / chartData.value.length)
})

const averageResponseTime = computed(() => {
  if (chartData.value.length === 0) return 0
  const total = chartData.value.reduce((sum, server) => sum + server.avgResponseTime, 0)
  return Math.round(total / chartData.value.length)
})

const totalErrors = computed(() => {
  return chartData.value.reduce((sum, server) => sum + server.errors, 0)
})

// Methods
const getServerStatusColor = (server: PerformanceData): string => {
  if (!server.is_active) {
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
  
  const successRate = server.successRate
  if (successRate >= 95) {
    return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
  } else if (successRate >= 80) {
    return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
  } else {
    return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
  }
}

const getPerformanceStatus = (successRate: number): string => {
  if (successRate >= 95) return 'success'
  if (successRate >= 80) return 'warning'
  return 'error'
}

const getPerformanceLabel = (successRate: number): string => {
  if (successRate >= 95) return t('settings.smtp.performance.excellent')
  if (successRate >= 80) return t('settings.smtp.performance.good')
  if (successRate >= 60) return t('settings.smtp.performance.poor')
  return t('settings.smtp.performance.critical')
}

const getSuccessRateColor = (successRate: number): string => {
  if (successRate >= 95) return 'text-green-500'
  if (successRate >= 80) return 'text-yellow-500'
  return 'text-red-500'
}

const formatLastActivity = (dateString?: string): string => {
  if (!dateString) return t('common.never')
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return t('settings.smtp.performance.minutesAgo', { minutes: diffInMinutes })
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return t('settings.smtp.performance.hoursAgo', { hours })
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return t('settings.smtp.performance.daysAgo', { days })
  }
}

// Mock data generators (replace with real data from API)
const generateMockResponseTime = (): number => {
  return Math.floor(Math.random() * 500) + 100 // 100-600ms
}

const generateMockUptime = (isActive: boolean): number => {
  if (!isActive) return 0
  return Math.floor(Math.random() * 20) + 80 // 80-100%
}

const generateMockErrors = (): number => {
  return Math.floor(Math.random() * 10) // 0-9 errors
}
</script> 