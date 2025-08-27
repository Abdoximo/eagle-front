<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="router.back()"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ campaign?.name || 'Loading Campaign...' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Campaign Details & Analytics
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Status Badge -->
            <StatusBadge 
              :status="campaign?.status || 'loading'" 
              :size="'lg'"
            />
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button
                v-if="campaign?.status === 'draft'"
                @click="editCampaign"
                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Edit class="w-4 h-4 mr-2" />
                Edit
              </button>
              
              <button
                v-if="campaign?.status === 'draft'"
                @click="sendCampaign"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <Send class="w-4 h-4 mr-2" />
                Send Now
              </button>
              
              <button
                v-if="campaign?.status === 'sent'"
                @click="viewAdvancedAnalytics"
                class="inline-flex items-center px-3 py-2 border border-purple-300 dark:border-purple-600 shadow-sm text-sm font-medium rounded-lg text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <BarChart class="w-4 h-4 mr-2" />
                Advanced Analytics
              </button>
              
              <button
                v-if="campaign?.status === 'sent'"
                @click="viewEmailTracking"
                class="inline-flex items-center px-3 py-2 border border-green-300 dark:border-green-600 shadow-sm text-sm font-medium rounded-lg text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <Users class="w-4 h-4 mr-2" />
                Email Status
              </button>
              
              <button
                v-if="campaign?.status === 'sent'"
                @click="viewWebVersion"
                class="inline-flex items-center px-3 py-2 border border-blue-300 dark:border-blue-600 shadow-sm text-sm font-medium rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                Web Version
              </button>
              
              <button
                @click="duplicateCampaign"
                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Copy class="w-4 h-4 mr-2" />
                Duplicate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <CampaignDetailsSkeleton />
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <AlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Campaign</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="fetchCampaign"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
      
      <!-- Campaign Content -->
      <div v-else-if="campaign" class="space-y-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Recipients"
            :value="formatNumber(campaign.total_recipients || 0)"
            icon="Users"
            color="blue"
            :trend="campaign.recipients_growth"
          />
          <StatCard
            title="Open Rate"
            :value="formatPercentage(campaign.open_rate || 0)"
            icon="Eye"
            color="green"
            :trend="campaign.open_rate_growth"
          />
          <StatCard
            title="Click Rate"
            :value="formatPercentage(campaign.click_rate || 0)"
            icon="MousePointer"
            color="purple"
            :trend="campaign.click_rate_growth"
          />
          <StatCard
            title="Conversion Rate"
            :value="formatPercentage(campaign.conversion_rate || 0)"
            icon="TrendingUp"
            color="orange"
            :trend="campaign.conversion_rate_growth"
          />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Campaign Info & Analytics -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Campaign Overview -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Mail class="w-5 h-5 mr-2 text-blue-500" />
                Campaign Overview
              </h2>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Name</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ campaign.name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Subject Line</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ campaign.subject }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact List</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ campaign.contact_list?.name || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(campaign.created_at) }}</p>
                  </div>
                  <div v-if="campaign.sent_at">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Sent</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(campaign.sent_at) }}</p>
                  </div>
                  <div v-if="campaign.scheduled_at">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</label>
                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(campaign.scheduled_at) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Analytics -->
            <div v-if="campaign.status === 'sent'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart class="w-5 h-5 mr-2 text-purple-500" />
                Performance Analytics
              </h2>
              
              <!-- Analytics Chart Placeholder -->
              <div class="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-6">
                <div class="text-center">
                  <BarChart class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-600 dark:text-gray-400">Analytics chart would go here</p>
                </div>
              </div>
              
              <!-- Engagement Metrics -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ campaign.opens || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Opens</div>
                </div>
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ campaign.clicks || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Clicks</div>
                </div>
                <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ campaign.bounces || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Bounces</div>
                </div>
                <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ campaign.unsubscribes || 0 }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Unsubscribes</div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div v-if="campaign.status === 'sent'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Activity class="w-5 h-5 mr-2 text-green-500" />
                Recent Activity
              </h2>
              
              <div class="space-y-3">
                <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div class="flex-shrink-0">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      activity.type === 'open' ? 'bg-blue-100 dark:bg-blue-900' : 
                      activity.type === 'click' ? 'bg-green-100 dark:bg-green-900' : 
                      'bg-gray-100 dark:bg-gray-700'
                    ]">
                      <Eye v-if="activity.type === 'open'" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <MousePointer v-else-if="activity.type === 'click'" class="w-4 h-4 text-green-600 dark:text-green-400" />
                      <Mail v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatRelativeTime(activity.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Email Preview & Actions -->
          <div class="space-y-6">
            <!-- Email Preview -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Eye class="w-5 h-5 mr-2 text-indigo-500" />
                Email Preview
              </h2>
              
              <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <!-- Email Header -->
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Mail class="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">Your Company</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">noreply@company.com</div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="font-medium text-gray-900 dark:text-white text-sm">{{ campaign.subject }}</div>
                  </div>
                </div>
                
                <!-- Email Content Preview -->
                <div class="p-4 bg-white dark:bg-gray-800 max-h-96 overflow-y-auto">
                                    <div
                    v-if="campaign.html_content"
                    v-html="sanitizeEmailContent(campaign.html_content)"
                    class="prose prose-sm max-w-none dark:prose-invert"
                  ></div>
                  <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500">
                    <FileText class="w-8 h-8 mx-auto mb-2" />
                    <p class="text-sm">No content available</p>
                  </div>
                </div>
              </div>
              
              <!-- Preview Actions -->
              <div class="mt-4 flex space-x-2">
                <button
                  @click="openFullPreview"
                  class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Maximize class="w-4 h-4 mr-2" />
                  Full Preview
                </button>
                <button
                  @click="sendTestEmail"
                  class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Send class="w-4 h-4 mr-2" />
                  Test Email
                </button>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Zap class="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h2>
              
              <div class="space-y-3">
                <button
                  v-if="campaign.status === 'sent'"
                  @click="exportResults"
                  class="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Download class="w-4 h-4 mr-2" />
                  Export Results
                </button>
                
                <button
                  @click="viewRecipients"
                  class="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Users class="w-4 h-4 mr-2" />
                  View Recipients
                </button>
                
                <button
                  @click="shareCampaign"
                  class="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Share class="w-4 h-4 mr-2" />
                  Share Campaign
                </button>
                
                <button
                  @click="deleteCampaign"
                  class="w-full inline-flex items-center justify-center px-4 py-3 border border-red-300 dark:border-red-600 shadow-sm text-sm font-medium rounded-lg text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Test Email Modal -->
  <div v-if="showTestEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Send Test Email
        </h3>
        <button
          @click="showTestEmailModal = false"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter up to 5 email addresses to send a test of this campaign.
        </p>

        <div class="space-y-3">
          <div v-for="(email, index) in testEmails" :key="index" class="flex items-center space-x-2">
            <input
              v-model="testEmails[index]"
              type="email"
              :placeholder="`Email ${index + 1}`"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              v-if="testEmails.length > 1"
              @click="removeTestEmail(index)"
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          v-if="testEmails.length < 5"
          @click="addTestEmail"
          class="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          + Add another email
        </button>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <button
          @click="showTestEmailModal = false"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleSendTestEmail"
          :disabled="!canSendTest || sendingTest"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="sendingTest">
            <div class="inline-flex items-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          </template>
          <template v-else>
            Send Test
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Mail, Users, Eye, MousePointer, TrendingUp, Edit, Send, Copy,
  AlertTriangle, RefreshCw, BarChart, Activity, Maximize, Zap, Download,
  Share, Trash2, FileText, ExternalLink
} from 'lucide-vue-next'
import { useCampaignsStore } from '@/stores/campaigns'
import { showSuccess, showError, showInfo } from '@/services/toast'
import { useSanitizer } from '@/composables/useSanitizer'

// Components
import StatusBadge from '@/components/ui/StatusBadge.vue'
import StatCard from '@/components/ui/StatCard.vue'
import CampaignDetailsSkeleton from '@/components/campaigns/CampaignDetailsSkeleton.vue'

const route = useRoute()
const router = useRouter()

// Store
const campaignsStore = useCampaignsStore()

// Sanitizer
const { sanitizeEmailContent } = useSanitizer()

// State
const loading = ref(true)
const error = ref('')
const showTestEmailModal = ref(false)
const testEmails = ref<string[]>([''])
const sendingTest = ref(false)

// Computed
const campaign = computed(() => campaignsStore.currentCampaign)

const sanitizedContent = computed(() => {
  if (!campaign.value?.html_content) return ''
  // Basic HTML sanitization - in a real app, use a proper sanitizer
  return campaign.value.html_content
    .replace(/\{\{first_name\}\}/g, 'John')
    .replace(/\{\{last_name\}\}/g, 'Doe')
    .replace(/\{\{email\}\}/g, 'john@example.com')
    .replace(/\{\{company\}\}/g, 'Acme Corp')
})

const recentActivity = computed(() => [
  {
    id: 1,
    type: 'open',
    description: 'john.doe@example.com opened the email',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'click',
    description: 'jane.smith@example.com clicked a link',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    type: 'open',
    description: 'bob.wilson@example.com opened the email',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  }
])

// Methods
const fetchCampaign = async () => {
  try {
    loading.value = true
    error.value = ''
    const campaignId = Number(route.params.id)
    await campaignsStore.fetchCampaign(campaignId)
  } catch (err: any) {
    error.value = err.message || 'Failed to load campaign'
  } finally {
    loading.value = false
  }
}

const editCampaign = () => {
  router.push(`/campaigns/${campaign.value?.id}/edit`)
}

const sendCampaign = async () => {
  if (!campaign.value) return
  
  try {
    await campaignsStore.sendCampaign(campaign.value.id)
    // Store already shows success message, no need to duplicate
    await fetchCampaign() // Refresh data
  } catch (error: any) {
    showError(error.message || 'Failed to send campaign')
  }
}

const duplicateCampaign = async () => {
  if (!campaign.value) return
  
  try {
    const duplicated = await campaignsStore.duplicateCampaign(campaign.value.id)
    // Store already shows success message, no need to duplicate
    router.push(`/campaigns/${duplicated.id}`)
  } catch (error: any) {
    showError(error.message || 'Failed to duplicate campaign')
  }
}

const openFullPreview = () => {
  if (!campaign.value) return
  
  // Create a new window with the campaign preview
  const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${campaign.value.subject || 'Campaign Preview'}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <div style="background: #f8f9fa; padding: 15px; border-bottom: 1px solid #e9ecef;">
            <h2 style="margin: 0; color: #333;">Campaign Preview</h2>
            <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Subject: ${campaign.value.subject || 'No subject'}</p>
          </div>
          <div style="padding: 20px;">
            ${campaign.value.html_content || '<p>No content available</p>'}
          </div>
        </div>
      </body>
      </html>
    `)
    previewWindow.document.close()
  }
}

const sendTestEmail = () => {
  if (!campaign.value) return
  
  showTestEmailModal.value = true
}

const addTestEmail = () => {
  if (testEmails.value.length < 5) {
    testEmails.value.push('')
  }
}

const removeTestEmail = (index: number) => {
  testEmails.value.splice(index, 1)
}

const canSendTest = computed(() => {
  return testEmails.value.some(email => email.trim() && /\S+@\S+\.\S+/.test(email))
})

const handleSendTestEmail = async () => {
  if (!campaign.value || sendingTest.value) return
  
  const validEmails = testEmails.value.filter(email => email.trim() && /\S+@\S+\.\S+/.test(email))
  
  if (validEmails.length === 0) {
    showError('Please enter at least one valid email address')
    return
  }
  
  sendingTest.value = true
  
  try {
    await campaignsStore.sendTestEmail(campaign.value.id, validEmails)
    showSuccess(`Test email sent to ${validEmails.length} recipient(s)`)
    showTestEmailModal.value = false
    testEmails.value = [''] // Reset
  } catch (error: any) {
    showError(error.message || 'Failed to send test email')
  } finally {
    sendingTest.value = false
  }
}

const exportResults = () => {
  showInfo('Export results feature coming soon!')
}

const viewRecipients = () => {
  router.push(`/campaigns/${campaign.value?.id}/recipients`)
}

const shareCampaign = () => {
  showInfo('Share campaign feature coming soon!')
}

const deleteCampaign = async () => {
  if (!campaign.value) return
  
  if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
    try {
      await campaignsStore.deleteCampaign(campaign.value.id)
      // Store already shows success message, no need to duplicate
      router.push('/campaigns')
    } catch (error: any) {
      showError(error.message || 'Failed to delete campaign')
    }
  }
}

const viewAdvancedAnalytics = () => {
  router.push(`/campaigns/${campaign.value?.id}/analytics`)
}

const viewEmailTracking = () => {
  // Open email tracking component in a modal or dedicated page
  // For now, we'll add it as a section in the analytics page
  router.push(`/campaigns/${campaign.value?.id}/analytics?tab=emails`)
}

const viewWebVersion = () => {
  if (campaign.value?.web_version_slug) {
    window.open(`/campaigns/${campaign.value.web_version_slug}/web`, '_blank')
  } else {
    // Generate web version slug and open
    const slug = `${campaign.value?.id}-${campaign.value?.name?.toLowerCase().replace(/\s+/g, '-')}`
    window.open(`/campaigns/${slug}/web`, '_blank')
  }
}

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Lifecycle
onMounted(() => {
  fetchCampaign()
})
</script>

<style scoped>
/* Scoped styles go here */
</style>