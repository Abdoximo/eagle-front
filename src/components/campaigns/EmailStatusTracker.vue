<template>
  <div class="space-y-6">
    <!-- Overview Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div v-for="status in statusCounts" :key="status.type" 
           class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
        <div :class="['w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center', status.bgColor]">
          <component :is="status.icon" :class="['w-4 h-4', status.iconColor]" />
        </div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(status.count) }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ status.label }}</div>
        <div v-if="status.percentage" class="text-xs text-gray-400 mt-1">{{ status.percentage }}%</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by email address..."
            class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2">
          <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All Status</option>
            <option value="queued">Queued</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="opened">Opened</option>
            <option value="clicked">Clicked</option>
            <option value="bounced">Bounced</option>
            <option value="complained">Complained</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          
          <select v-model="engagementFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All Engagement</option>
            <option value="high">High (80+)</option>
            <option value="medium">Medium (40-79)</option>
            <option value="low">Low (0-39)</option>
          </select>
          
          <select v-model="locationFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
            <option value="">All Locations</option>
            <option v-for="location in uniqueLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>

          <button @click="exportEmails" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Download class="w-4 h-4 inline mr-1" />
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Email Status Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="rounded">
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('email')">
                Email Address
                <ArrowUpDown class="w-3 h-3 inline ml-1" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                Status
                <ArrowUpDown class="w-3 h-3 inline ml-1" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('sent_at')">
                Sent
                <ArrowUpDown class="w-3 h-3 inline ml-1" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Engagement
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opens / Clicks
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Device
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="email in paginatedEmails" :key="email.id" 
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedEmails.includes(email.id) }">
              
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  :value="email.id" 
                  v-model="selectedEmails" 
                  class="rounded"
                />
              </td>
              
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-8 h-8">
                    <img 
                      :src="getGravatar(email.email)" 
                      :alt="email.email"
                      class="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ email.email }}</div>
                    <div v-if="email.name" class="text-sm text-gray-500 dark:text-gray-400">{{ email.name }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <StatusBadge :status="email.status" />
                  <button 
                    v-if="email.status === 'bounced'" 
                    @click="showBounceDetails(email)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Info class="w-4 h-4" />
                  </button>
                </div>
              </td>
              
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                <div>{{ formatDateTime(email.sent_at) }}</div>
                <div v-if="email.delivered_at" class="text-xs text-green-600 dark:text-green-400">
                  Delivered: {{ formatTime(email.delivered_at) }}
                </div>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ email.engagement_score }}</div>
                  <div :class="['w-2 h-2 rounded-full', getEngagementColor(email.engagement_score)]"></div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getEngagementLabel(email.engagement_score) }}
                </div>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex items-center space-x-4 text-sm">
                  <div class="flex items-center text-blue-600 dark:text-blue-400">
                    <Eye class="w-3 h-3 mr-1" />
                    {{ email.open_count }}
                  </div>
                  <div class="flex items-center text-green-600 dark:text-green-400">
                    <MousePointer class="w-3 h-3 mr-1" />
                    {{ email.click_count }}
                  </div>
                </div>
                <div v-if="email.first_opened_at" class="text-xs text-gray-500 dark:text-gray-400">
                  First opened: {{ formatTime(email.first_opened_at) }}
                </div>
              </td>
              
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <MapPin class="w-3 h-3 mr-1" />
                  {{ email.location || 'Unknown' }}
                </div>
              </td>
              
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <component :is="getDeviceIcon(email.device_type)" class="w-3 h-3 mr-1" />
                  {{ email.device_type || 'Unknown' }}
                </div>
                <div v-if="email.email_client" class="text-xs">
                  {{ email.email_client }}
                </div>
              </td>
              
              <td class="px-4 py-3">
                <div class="flex items-center space-x-1">
                  <button 
                    @click="viewEmailDetails(email)"
                    class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="resendEmail(email)"
                    class="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    title="Resend"
                    :disabled="email.status === 'bounced'"
                  >
                    <RefreshCw class="w-4 h-4" />
                  </button>
                  <button 
                    @click="blockEmail(email)"
                    class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Block"
                  >
                    <Ban class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Table Footer with Bulk Actions -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ selectedEmails.length }} of {{ filteredEmails.length }} selected
            </span>
            <div v-if="selectedEmails.length > 0" class="flex items-center space-x-2">
              <button @click="bulkResend" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Resend Selected
              </button>
              <button @click="bulkBlock" class="text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                Block Selected
              </button>
            </div>
          </div>
          
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Simple Details Modal -->
    <div v-if="selectedEmailDetails" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Details</h3>
        <div class="space-y-2 text-sm">
          <p><strong>Email:</strong> {{ selectedEmailDetails.email }}</p>
          <p><strong>Status:</strong> {{ selectedEmailDetails.status }}</p>
          <p><strong>Opens:</strong> {{ selectedEmailDetails.open_count || 0 }}</p>
          <p><strong>Clicks:</strong> {{ selectedEmailDetails.click_count || 0 }}</p>
        </div>
        <button @click="selectedEmailDetails = null" class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Search, Download, ArrowUpDown, Eye, MousePointer, MapPin, 
  Info, RefreshCw, Ban, Smartphone, Monitor, Tablet,
  Clock, CheckCircle, AlertCircle, XCircle, Mail as MailIcon
} from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Pagination from '@/components/common/Pagination.vue'
import { showSuccess, showError } from '@/services/toast'

const props = defineProps({
  campaignId: {
    type: [String, Number],
    required: true
  }
})

// State
const searchQuery = ref('')
const statusFilter = ref('')
const engagementFilter = ref('')
const locationFilter = ref('')
const sortField = ref('sent_at')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 50
const selectAll = ref(false)
const selectedEmails = ref([])
const selectedEmailDetails = ref(null)
const selectedBounceEmail = ref(null)

// Mock data - replace with real API calls
const emails = ref([
  {
    id: 1,
    email: 'user1@example.com',
    name: 'John Doe',
    status: 'clicked',
    sent_at: '2024-01-15T10:00:00Z',
    delivered_at: '2024-01-15T10:01:15Z',
    first_opened_at: '2024-01-15T10:05:30Z',
    first_clicked_at: '2024-01-15T10:06:45Z',
    open_count: 3,
    click_count: 2,
    engagement_score: 85,
    location: 'New York, NY',
    device_type: 'Desktop',
    email_client: 'Gmail'
  },
  // Add more mock emails...
])

// Computed
const statusCounts = computed(() => {
  const counts = emails.value.reduce((acc, email) => {
    acc[email.status] = (acc[email.status] || 0) + 1
    return acc
  }, {})

  const total = emails.value.length

  return [
    {
      type: 'sent',
      label: 'Sent',
      count: total,
      percentage: 100,
      icon: MailIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      type: 'delivered',
      label: 'Delivered',
      count: counts.delivered || 0,
      percentage: total > 0 ? Math.round(((counts.delivered || 0) / total) * 100) : 0,
      icon: CheckCircle,
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      type: 'opened',
      label: 'Opened',
      count: counts.opened || 0,
      percentage: total > 0 ? Math.round(((counts.opened || 0) / total) * 100) : 0,
      icon: Eye,
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      type: 'clicked',
      label: 'Clicked',
      count: counts.clicked || 0,
      percentage: total > 0 ? Math.round(((counts.clicked || 0) / total) * 100) : 0,
      icon: MousePointer,
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      type: 'bounced',
      label: 'Bounced',
      count: counts.bounced || 0,
      percentage: total > 0 ? Math.round(((counts.bounced || 0) / total) * 100) : 0,
      icon: XCircle,
      bgColor: 'bg-red-100 dark:bg-red-900',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      type: 'complained',
      label: 'Complained',
      count: counts.complained || 0,
      percentage: total > 0 ? Math.round(((counts.complained || 0) / total) * 100) : 0,
      icon: AlertCircle,
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      type: 'queued',
      label: 'Queued',
      count: counts.queued || 0,
      percentage: total > 0 ? Math.round(((counts.queued || 0) / total) * 100) : 0,
      icon: Clock,
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400'
    }
  ]
})

const uniqueLocations = computed(() => {
  return [...new Set(emails.value.map(e => e.location).filter(Boolean))].sort()
})

const filteredEmails = computed(() => {
  let filtered = emails.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(email => 
      email.email.toLowerCase().includes(query) ||
      (email.name && email.name.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(email => email.status === statusFilter.value)
  }

  if (engagementFilter.value) {
    const ranges = {
      high: [80, 100],
      medium: [40, 79],
      low: [0, 39]
    }
    const [min, max] = ranges[engagementFilter.value] || [0, 100]
    filtered = filtered.filter(email => 
      email.engagement_score >= min && email.engagement_score <= max
    )
  }

  if (locationFilter.value) {
    filtered = filtered.filter(email => email.location === locationFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value.includes('_at')) {
      aVal = new Date(aVal || 0)
      bVal = new Date(bVal || 0)
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredEmails.value.length / itemsPerPage)
)

const paginatedEmails = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEmails.value.slice(start, end)
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
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

const formatTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const getGravatar = (email) => {
  // Simple placeholder - in real app, use proper Gravatar implementation
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random&size=32`
}

const getEngagementColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getEngagementLabel = (score) => {
  if (score >= 80) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

const getDeviceIcon = (device) => {
  const icons = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet
  }
  return icons[device] || Monitor
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedEmails.value = paginatedEmails.value.map(e => e.id)
  } else {
    selectedEmails.value = []
  }
}

const viewEmailDetails = (email) => {
  selectedEmailDetails.value = email
}

const showBounceDetails = (email) => {
  selectedBounceEmail.value = email
}

const resendEmail = async (email) => {
  try {
    // TODO: Replace with real API call
    showSuccess(`Email resent to ${email.email}`)
  } catch (error) {
    showError('Failed to resend email')
  }
}

const blockEmail = async (email) => {
  if (confirm(`Are you sure you want to block ${email.email}?`)) {
    try {
      // TODO: Replace with real API call
      showSuccess(`${email.email} has been blocked`)
    } catch (error) {
      showError('Failed to block email')
    }
  }
}

const bulkResend = async () => {
  if (confirm(`Resend to ${selectedEmails.value.length} recipients?`)) {
    try {
      // TODO: Replace with real API call
      showSuccess(`Emails resent to ${selectedEmails.value.length} recipients`)
      selectedEmails.value = []
      selectAll.value = false
    } catch (error) {
      showError('Failed to resend emails')
    }
  }
}

const bulkBlock = async () => {
  if (confirm(`Block ${selectedEmails.value.length} email addresses?`)) {
    try {
      // TODO: Replace with real API call
      showSuccess(`${selectedEmails.value.length} email addresses blocked`)
      selectedEmails.value = []
      selectAll.value = false
    } catch (error) {
      showError('Failed to block emails')
    }
  }
}

const exportEmails = () => {
  // TODO: Implement CSV export
  showSuccess('Email data export started')
}

const handlePageChange = (page) => {
  currentPage.value = page
  selectedEmails.value = []
  selectAll.value = false
}

// Watch for changes in filtered emails to reset selection
watch(filteredEmails, () => {
  selectedEmails.value = []
  selectAll.value = false
})

onMounted(() => {
  // Load email data
  // TODO: Replace with real API call
})
</script>
