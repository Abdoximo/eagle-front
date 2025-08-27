<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Email Details</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ email.email }}</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Email Status Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <Mail class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-200">Status</p>
                  <p class="text-lg font-bold text-blue-900 dark:text-blue-100">{{ email.status }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <Eye class="w-8 h-8 text-green-600 dark:text-green-400" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-900 dark:text-green-200">Opens</p>
                  <p class="text-lg font-bold text-green-900 dark:text-green-100">{{ email.open_count || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <MousePointer class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-purple-900 dark:text-purple-200">Clicks</p>
                  <p class="text-lg font-bold text-purple-900 dark:text-purple-100">{{ email.click_count || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <TrendingUp class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-yellow-900 dark:text-yellow-200">Score</p>
                  <p class="text-lg font-bold text-yellow-900 dark:text-yellow-100">{{ email.engagement_score || 0 }}/100</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="mb-6">
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Email Timeline</h4>
            <div class="flow-root">
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-if="email.sent_at" class="py-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Send class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Email Sent</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(email.sent_at) }}</p>
                    </div>
                  </div>
                </li>

                <li v-if="email.delivered_at" class="py-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle class="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Email Delivered</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(email.delivered_at) }}</p>
                    </div>
                  </div>
                </li>

                <li v-if="email.first_opened_at" class="py-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Eye class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">First Opened</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(email.first_opened_at) }}</p>
                    </div>
                  </div>
                </li>

                <li v-if="email.first_clicked_at" class="py-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <MousePointer class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">First Clicked</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(email.first_clicked_at) }}</p>
                    </div>
                  </div>
                </li>

                <li v-if="email.bounced_at" class="py-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <AlertTriangle class="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Email Bounced</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateTime(email.bounced_at) }}</p>
                      <p v-if="email.bounce_reason" class="text-sm text-red-600 dark:text-red-400">{{ email.bounce_reason }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Device & Location Info -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Device & Location</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Location:</span>
                  <span class="text-gray-900 dark:text-white">{{ email.location || 'Unknown' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Device:</span>
                  <span class="text-gray-900 dark:text-white">{{ email.device_type || 'Unknown' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Email Client:</span>
                  <span class="text-gray-900 dark:text-white">{{ email.email_client || 'Unknown' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">IP Address:</span>
                  <span class="text-gray-900 dark:text-white font-mono text-xs">{{ email.ip_address || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Engagement Details -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Engagement Details</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Total Opens:</span>
                  <span class="text-gray-900 dark:text-white">{{ email.open_count || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Total Clicks:</span>
                  <span class="text-gray-900 dark:text-white">{{ email.click_count || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Last Activity:</span>
                  <span class="text-gray-900 dark:text-white">{{ formatDateTime(email.last_opened_at || email.last_clicked_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Engagement Score:</span>
                  <span class="text-gray-900 dark:text-white font-bold">{{ email.engagement_score || 0 }}/100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              @click="resendEmail"
              class="px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <RefreshCw class="w-4 h-4 mr-2 inline" />
              Resend Email
            </button>
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  X, Mail, Eye, MousePointer, TrendingUp, Send, CheckCircle, 
  AlertTriangle, RefreshCw
} from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

const props = defineProps<{
  email: any
}>()

defineEmits<{
  close: []
}>()

const formatDateTime = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resendEmail = async () => {
  try {
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess(`Email resent to ${props.email.email}`)
  } catch (error) {
    showError('Failed to resend email')
  }
}
</script>
