<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Users Stats -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Users class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.users') }}
          </h3>
          <div class="mt-1 space-y-1">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.users.total.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ stats.users.active.toLocaleString() }} {{ $t('common.active') }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div>{{ $t('settings.admin.stats.newToday') }}: {{ stats.users.new_today }}</div>
        <div>{{ $t('settings.admin.stats.newThisWeek') }}: {{ stats.users.new_this_week }}</div>
      </div>
    </div>

    <!-- Campaigns Stats -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Mail class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.campaigns') }}
          </h3>
          <div class="mt-1 space-y-1">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.campaigns.total.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ stats.campaigns.sent.toLocaleString() }} {{ $t('settings.admin.stats.sent') }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div>{{ $t('settings.admin.stats.pending') }}: {{ stats.campaigns.pending }}</div>
        <div>{{ $t('settings.admin.stats.draft') }}: {{ stats.campaigns.draft }}</div>
      </div>
    </div>

    <!-- Emails Stats -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Send class="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.emails') }}
          </h3>
          <div class="mt-1 space-y-1">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stats.emails.total_sent.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ $t('settings.admin.stats.totalSent') }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div>{{ $t('settings.admin.stats.today') }}: {{ stats.emails.sent_today.toLocaleString() }}</div>
        <div>{{ $t('settings.admin.stats.thisWeek') }}: {{ stats.emails.sent_this_week.toLocaleString() }}</div>
        <div>{{ $t('settings.admin.stats.thisMonth') }}: {{ stats.emails.sent_this_month.toLocaleString() }}</div>
      </div>
    </div>

    <!-- Revenue Stats -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <DollarSign class="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.revenue') }}
          </h3>
          <div class="mt-1 space-y-1">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              ${{ stats.revenue.total.toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ $t('settings.admin.stats.totalRevenue') }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div>{{ $t('settings.admin.stats.today') }}: ${{ stats.revenue.today.toLocaleString() }}</div>
        <div>{{ $t('settings.admin.stats.thisWeek') }}: ${{ stats.revenue.this_week.toLocaleString() }}</div>
        <div>{{ $t('settings.admin.stats.thisMonth') }}: ${{ stats.revenue.this_month.toLocaleString() }}</div>
      </div>
    </div>

    <!-- SMTP Stats (spanning 2 columns) -->
    <div class="md:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <Server class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.smtp') }}
          </h3>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('settings.admin.stats.smtpOverview') }}
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {{ stats.smtp.total_servers }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.totalServers') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ stats.smtp.active_servers }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.activeServers') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ stats.smtp.usage_today.toLocaleString() }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.stats.usageToday') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Users, Mail, Send, DollarSign, Server } from 'lucide-vue-next'

// Types
import type { SystemStats } from '@/types/admin'

interface Props {
  stats: SystemStats
}

const props = defineProps<Props>()
const { t } = useI18n()
</script> 