<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recipient Details
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed delivery and engagement information
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Recipient Info -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <span class="text-lg font-medium text-blue-600 dark:text-blue-400">
                {{ getInitials(recipient.contact?.first_name, recipient.contact?.last_name, recipient.email) }}
              </span>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ recipient.contact?.first_name }} {{ recipient.contact?.last_name }}
              </h4>
              <p class="text-gray-600 dark:text-gray-400">{{ recipient.email }}</p>
              <span :class="getStatusBadgeClass(recipient.status)" class="inline-block px-2 py-1 rounded-full text-xs font-medium mt-1">
                {{ getStatusLabel(recipient.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Delivery Timeline -->
        <div class="mb-6">
          <h5 class="font-medium text-gray-900 dark:text-white mb-4">Delivery Timeline</h5>
          <div class="space-y-3">
            <!-- Queued -->
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                <Clock class="w-4 h-4 text-gray-500" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Queued</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ recipient.created_at ? formatDateTime(recipient.created_at) : 'N/A' }}
                </p>
              </div>
            </div>

            <!-- Sent -->
            <div v-if="recipient.sent_at" class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <Send class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Sent</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(recipient.sent_at) }}
                </p>
              </div>
            </div>

            <!-- Delivered -->
            <div v-if="recipient.delivered_at" class="flex items-center">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                <CheckCircle class="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Delivered</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(recipient.delivered_at) }}
                </p>
              </div>
            </div>

            <!-- Opened -->
            <div v-if="recipient.opened_at" class="flex items-center">
              <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                <Eye class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  First Opened
                  <span v-if="recipient.open_count > 1" class="text-xs text-gray-500 ml-1">
                    ({{ recipient.open_count }} times)
                  </span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(recipient.opened_at) }}
                </p>
              </div>
            </div>

            <!-- Clicked -->
            <div v-if="recipient.clicked_at" class="flex items-center">
              <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                <MousePointer class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  First Clicked
                  <span v-if="recipient.click_count > 1" class="text-xs text-gray-500 ml-1">
                    ({{ recipient.click_count }} times)
                  </span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(recipient.clicked_at) }}
                </p>
              </div>
            </div>

            <!-- Bounced -->
            <div v-if="recipient.status === 'bounced'" class="flex items-center">
              <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Bounced</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ recipient.bounced_at ? formatDateTime(recipient.bounced_at) : 'N/A' }}
                </p>
                <p v-if="recipient.bounce_reason" class="text-xs text-red-600 dark:text-red-400 mt-1">
                  {{ recipient.bounce_reason }}
                </p>
              </div>
            </div>

            <!-- Unsubscribed -->
            <div v-if="recipient.status === 'unsubscribed'" class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                <UserMinus class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Unsubscribed</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ recipient.unsubscribed_at ? formatDateTime(recipient.unsubscribed_at) : 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h5 class="font-medium text-gray-900 dark:text-white mb-3">Technical Details</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div v-if="recipient.message_id">
              <span class="font-medium text-gray-600 dark:text-gray-400">Message ID:</span>
              <p class="text-gray-900 dark:text-white font-mono text-xs break-all">{{ recipient.message_id }}</p>
            </div>
            
            <div v-if="recipient.delivery_method">
              <span class="font-medium text-gray-600 dark:text-gray-400">Delivery Method:</span>
              <p class="text-gray-900 dark:text-white">{{ recipient.delivery_method }}</p>
            </div>

            <div v-if="recipient.user_agent">
              <span class="font-medium text-gray-600 dark:text-gray-400">User Agent:</span>
              <p class="text-gray-900 dark:text-white text-xs">{{ recipient.user_agent }}</p>
            </div>

            <div v-if="recipient.ip_address">
              <span class="font-medium text-gray-600 dark:text-gray-400">IP Address:</span>
              <p class="text-gray-900 dark:text-white">{{ recipient.ip_address }}</p>
            </div>

            <div v-if="recipient.device_type">
              <span class="font-medium text-gray-600 dark:text-gray-400">Device Type:</span>
              <p class="text-gray-900 dark:text-white">{{ recipient.device_type }}</p>
            </div>

            <div v-if="recipient.email_client">
              <span class="font-medium text-gray-600 dark:text-gray-400">Email Client:</span>
              <p class="text-gray-900 dark:text-white">{{ recipient.email_client }}</p>
            </div>

            <div v-if="recipient.location">
              <span class="font-medium text-gray-600 dark:text-gray-400">Location:</span>
              <p class="text-gray-900 dark:text-white">{{ recipient.location }}</p>
            </div>
          </div>
        </div>

        <!-- Error Details (if any) -->
        <div v-if="recipient.error_message || recipient.bounce_details" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h5 class="font-medium text-red-900 dark:text-red-300 mb-2">Error Details</h5>
          <div class="text-sm space-y-2">
            <div v-if="recipient.error_message">
              <span class="font-medium text-red-700 dark:text-red-400">Error Message:</span>
              <p class="text-red-800 dark:text-red-300">{{ recipient.error_message }}</p>
            </div>
            <div v-if="recipient.bounce_details">
              <span class="font-medium text-red-700 dark:text-red-400">Bounce Details:</span>
              <p class="text-red-800 dark:text-red-300">{{ recipient.bounce_details }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <button
          v-if="['bounced', 'failed'].includes(recipient.status)"
          @click="resendEmail"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCw class="w-4 h-4 mr-2 inline" />
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
</template>

<script setup lang="ts">
import { 
  X, Clock, Send, CheckCircle, Eye, MousePointer, AlertCircle, 
  UserMinus, RotateCw 
} from 'lucide-vue-next'
import { showInfo } from '@/services/toast'
import type { EmailLog } from '@/types/campaigns'

defineProps<{
  recipient: EmailLog
}>()

defineEmits<{
  close: []
}>()

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

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

const resendEmail = () => {
  // TODO: Implement resend functionality
  showInfo('Resend functionality coming soon!')
}
</script>
