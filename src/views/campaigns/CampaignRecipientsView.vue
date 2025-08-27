<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Campaign Recipients
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ campaign?.name }} - Track delivery status and recipient engagement
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="refreshData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="loading"
          >
            <RefreshCw class="w-4 h-4 mr-2 inline" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
          <button
            @click="exportRecipients"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download class="w-4 h-4 mr-2 inline" />
            Export
          </button>
          <router-link
            :to="`/campaigns/${campaign?.id}`"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft class="w-4 h-4 mr-2 inline" />
            Back to Campaign
          </router-link>
        </div>
      </div>
    </div>

    <!-- Campaign Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recipients</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.total_recipients) }}</p>
          </div>
          <Users class="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
            <p class="text-2xl font-bold text-green-600">{{ formatNumber(stats.delivered) }}</p>
            <p class="text-xs text-gray-500">{{ formatPercentage(stats.delivery_rate) }} delivery rate</p>
          </div>
          <CheckCircle class="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Opened</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatNumber(stats.opened) }}</p>
            <p class="text-xs text-gray-500">{{ formatPercentage(stats.open_rate) }} open rate</p>
          </div>
          <Mail class="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Clicked</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatNumber(stats.clicked) }}</p>
            <p class="text-xs text-gray-500">{{ formatPercentage(stats.click_rate) }} click rate</p>
          </div>
          <MousePointer class="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div class="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by email address..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="opened">Opened</option>
            <option value="clicked">Clicked</option>
            <option value="bounced">Bounced</option>
            <option value="complained">Complained</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>

          <!-- Date Filter -->
          <select
            v-model="dateFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <!-- Clear Filters -->
          <button
            @click="clearFilters"
            class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X class="w-4 h-4 mr-1 inline" />
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Recipients Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recipients ({{ formatNumber(filteredRecipients.length) }})
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ totalRecipients }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400">
            <RefreshCw class="w-4 h-4 mr-2 animate-spin" />
            Loading recipients...
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="recipients.length === 0" class="text-center py-12">
          <Mail class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No recipients found</h3>
          <p class="text-gray-500 dark:text-gray-400">
            This campaign hasn't been sent to any recipients yet.
          </p>
        </div>

        <!-- Recipients Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Recipient
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Sent At
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Delivered At
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Last Activity
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="recipient in paginatedRecipients"
                :key="recipient.id"
                class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <!-- Recipient Info -->
                <td class="py-4 px-4">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {{ getInitials(recipient.contact?.first_name, recipient.contact?.last_name, recipient.email) }}
                      </span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ recipient.contact?.first_name }} {{ recipient.contact?.last_name }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ recipient.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-4 px-4">
                  <span :class="getStatusBadgeClass(recipient.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusLabel(recipient.status) }}
                  </span>
                </td>

                <!-- Sent At -->
                <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ recipient.sent_at ? formatDateTime(recipient.sent_at) : '-' }}
                </td>

                <!-- Delivered At -->
                <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ recipient.delivered_at ? formatDateTime(recipient.delivered_at) : '-' }}
                </td>

                <!-- Last Activity -->
                <td class="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ getLastActivity(recipient) }}
                </td>

                <!-- Actions -->
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewRecipientDetails(recipient)"
                      class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      v-if="['bounced', 'failed'].includes(recipient.status)"
                      @click="resendToRecipient(recipient)"
                      class="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Resend"
                    >
                      <RotateCw class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ totalRecipients }} recipients
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            
            <span v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 border rounded',
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 text-gray-500">...</span>
            </span>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipient Details Modal -->
    <RecipientDetailsModal
      v-if="selectedRecipient"
      :recipient="selectedRecipient"
      @close="selectedRecipient = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Users, CheckCircle, Mail, MousePointer, RefreshCw, Download, ArrowLeft,
  Search, X, Eye, RotateCw, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { useCampaignsStore } from '@/stores/campaigns'
import { showSuccess, showError, showInfo } from '@/services/toast'
import { campaignRecipientsApi } from '@/services/campaignRecipients.api'
import type { Campaign, EmailLog } from '@/types/campaigns'
import RecipientDetailsModal from '@/components/campaigns/RecipientDetailsModal.vue'

const route = useRoute()
const router = useRouter()
const campaignsStore = useCampaignsStore()

// State
const campaign = ref<Campaign | null>(null)
const recipients = ref<EmailLog[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(25)
const selectedRecipient = ref<EmailLog | null>(null)

// Mock stats - replace with real API call
const stats = ref({
  total_recipients: 0,
  delivered: 0,
  opened: 0,
  clicked: 0,
  bounced: 0,
  delivery_rate: 0,
  open_rate: 0,
  click_rate: 0,
  bounce_rate: 0
})

// Computed
const filteredRecipients = computed(() => {
  let filtered = recipients.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipient => 
      recipient.email.toLowerCase().includes(query) ||
      recipient.contact?.first_name?.toLowerCase().includes(query) ||
      recipient.contact?.last_name?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(recipient => recipient.status === statusFilter.value)
  }

  // Date filter
  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    filtered = filtered.filter(recipient => {
      if (!recipient.sent_at) return false
      const sentDate = new Date(recipient.sent_at)
      
      switch (dateFilter.value) {
        case 'today':
          return sentDate >= today
        case 'yesterday':
          return sentDate >= yesterday && sentDate < today
        case 'week':
          return sentDate >= weekStart
        case 'month':
          return sentDate >= monthStart
        default:
          return true
      }
    })
  }

  return filtered
})

const totalRecipients = computed(() => filteredRecipients.value.length)
const totalPages = computed(() => Math.ceil(totalRecipients.value / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, totalRecipients.value))

const paginatedRecipients = computed(() => {
  return filteredRecipients.value.slice(startIndex.value, startIndex.value + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const loadCampaignData = async () => {
  try {
    const campaignId = Number(route.params.id)
    await campaignsStore.fetchCampaign(campaignId)
    campaign.value = campaignsStore.currentCampaign
  } catch (error) {
    showError('Failed to load campaign data')
    router.push('/campaigns')
  }
}

const loadRecipients = async () => {
  loading.value = true
  try {
    const campaignId = Number(route.params.id)
    const response = await campaignRecipientsApi.getRecipients(campaignId, {
      page: currentPage.value,
      per_page: pageSize.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      date_filter: dateFilter.value || undefined
    })
    
    // Combine actual email logs with potential recipients
    const actualLogs = response.logs || []
    const potentialRecipients = response.potential_recipients || []
    
    // For draft/scheduled campaigns, show potential recipients
    // For sent campaigns, show actual logs
    recipients.value = actualLogs.length > 0 ? actualLogs : potentialRecipients
    
    calculateStats()
  } catch (error) {
    showError('Failed to load recipients data')
    recipients.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const total = recipients.value.length
  const delivered = recipients.value.filter(r => r.status === 'delivered' || r.delivered_at).length
  const opened = recipients.value.filter(r => r.opened_at).length
  const clicked = recipients.value.filter(r => r.clicked_at).length
  const bounced = recipients.value.filter(r => r.status === 'bounced').length

  stats.value = {
    total_recipients: total,
    delivered,
    opened,
    clicked,
    bounced,
    delivery_rate: total > 0 ? (delivered / total) * 100 : 0,
    open_rate: delivered > 0 ? (opened / delivered) * 100 : 0,
    click_rate: delivered > 0 ? (clicked / delivered) * 100 : 0,
    bounce_rate: total > 0 ? (bounced / total) * 100 : 0
  }
}

const refreshData = async () => {
  await Promise.all([loadCampaignData(), loadRecipients()])
  showSuccess('Data refreshed successfully!')
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
  currentPage.value = 1
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    queued: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    opened: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    clicked: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    bounced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    complained: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    unsubscribed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
  return classes[status] || classes.queued
}

const getStatusLabel = (status: string) => {
  const labels = {
    queued: 'Queued',
    sent: 'Sent',
    delivered: 'Delivered',
    opened: 'Opened',
    clicked: 'Clicked',
    bounced: 'Bounced',
    complained: 'Complained',
    unsubscribed: 'Unsubscribed'
  }
  return labels[status] || status
}

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) {
    return firstName[0].toUpperCase()
  }
  if (email) {
    return email[0].toUpperCase()
  }
  return '?'
}

const getLastActivity = (recipient: EmailLog) => {
  if (recipient.clicked_at) {
    return `Clicked ${formatDateTime(recipient.clicked_at)}`
  }
  if (recipient.opened_at) {
    return `Opened ${formatDateTime(recipient.opened_at)}`
  }
  if (recipient.delivered_at) {
    return `Delivered ${formatDateTime(recipient.delivered_at)}`
  }
  if (recipient.sent_at) {
    return `Sent ${formatDateTime(recipient.sent_at)}`
  }
  return 'No activity'
}

const viewRecipientDetails = (recipient: EmailLog) => {
  selectedRecipient.value = recipient
}

const resendToRecipient = async (recipient: EmailLog) => {
  try {
    // TODO: Implement resend functionality
    showInfo('Resend functionality coming soon!')
  } catch (error) {
    showError('Failed to resend email')
  }
}

const exportRecipients = () => {
  try {
    // Create CSV content
    const headers = ['Email', 'Name', 'Status', 'Sent At', 'Delivered At', 'Opened At', 'Clicked At']
    const csvContent = [
      headers.join(','),
      ...filteredRecipients.value.map(recipient => [
        recipient.email,
        `"${recipient.contact?.first_name || ''} ${recipient.contact?.last_name || ''}".trim()`,
        recipient.status,
        recipient.sent_at || '',
        recipient.delivered_at || '',
        recipient.opened_at || '',
        recipient.clicked_at || ''
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${campaign.value?.name || 'campaign'}-recipients.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    showSuccess('Recipients data exported successfully!')
  } catch (error) {
    showError('Failed to export recipients data')
  }
}

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

// Watchers
watch([searchQuery, statusFilter, dateFilter], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await Promise.all([loadCampaignData(), loadRecipients()])
})
</script>
