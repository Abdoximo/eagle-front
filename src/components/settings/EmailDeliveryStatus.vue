<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
        <Mail class="w-5 h-5 mr-2 text-blue-500" />
        Email Delivery Status
      </h2>
      <button @click="refreshStatus" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
        <RefreshCw class="w-4 h-4 text-gray-500" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Checking delivery status...</p>
    </div>

    <div v-else-if="deliveryStatus" class="space-y-6">
      <!-- Current Delivery Method -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Send class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Active Delivery Method</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ deliveryStatus.method_name }} via {{ deliveryStatus.server_name }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            <Check class="w-4 h-4 mr-1" />
            Active
          </span>
        </div>
      </div>

      <!-- Server Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Server Information</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Server:</span>
              <span class="text-gray-900 dark:text-white">{{ deliveryStatus.server_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">From Email:</span>
              <span class="text-gray-900 dark:text-white">{{ deliveryStatus.from_email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Priority:</span>
              <span class="text-gray-900 dark:text-white">{{ deliveryStatus.priority }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Usage Statistics</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Today:</span>
              <span class="text-gray-900 dark:text-white">
                {{ deliveryStatus.emails_sent_today }}/{{ deliveryStatus.daily_limit || '∞' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">This Hour:</span>
              <span class="text-gray-900 dark:text-white">
                {{ deliveryStatus.emails_sent_hour }}/{{ deliveryStatus.hourly_limit || '∞' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Capacity:</span>
              <span class="text-green-600 dark:text-green-400">{{ deliveryStatus.capacity_percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Servers -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-4">Available Servers</h4>
        <div class="space-y-3">
          <div v-for="server in availableServers" :key="server.id" 
               class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-3 h-3 rounded-full',
                server.is_active ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              <div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ server.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ server.type }})</span>
              </div>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Priority: {{ server.priority }}
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Preferences -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <Settings class="w-4 h-4 mr-2" />
          Delivery Preferences
        </h4>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Method
            </label>
            <select v-model="preferences.preferred_method" @change="updatePreferences" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="auto">Auto (Postal API preferred)</option>
              <option value="postal_api">Postal API only</option>
              <option value="smtp">SMTP only</option>
            </select>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            <strong>Auto mode:</strong> Uses Postal API when available, falls back to SMTP<br>
            <strong>Postal API:</strong> Better tracking and deliverability<br>
            <strong>SMTP:</strong> Traditional email sending
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <AlertTriangle class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Delivery Method Available</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        You need to configure at least one SMTP server or Postal API server to send emails.
      </p>
      <div class="flex justify-center space-x-3">
        <button @click="$router.push('/settings/smtp')" 
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Server class="w-4 h-4 mr-2" />
          Setup SMTP
        </button>
        <button @click="$router.push('/settings/postal-api')"
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Mail class="w-4 h-4 mr-2" />
          Setup Postal API
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Mail, RefreshCw, Send, Check, Settings, AlertTriangle, Server 
} from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

// Mock API calls - replace with real API endpoints
const loading = ref(false)
const deliveryStatus = ref(null)
const availableServers = ref([])
const preferences = ref({
  preferred_method: 'auto'
})

// Mock data - replace with real API calls
const mockDeliveryStatus = {
  method_name: 'Postal API',
  server_name: 'postal.leython.com',
  from_email: 'contact@service.leython.com',
  priority: 1,
  emails_sent_today: 45,
  daily_limit: 1000,
  emails_sent_hour: 3,
  hourly_limit: 100,
  capacity_percentage: 95
}

const mockAvailableServers = [
  {
    id: 1,
    name: 'postal.leython.com',
    type: 'Postal API',
    is_active: true,
    priority: 1
  },
  {
    id: 2,
    name: 'Gmail SMTP',
    type: 'SMTP',
    is_active: true,
    priority: 2
  }
]

const refreshStatus = async () => {
  loading.value = true
  try {
    // TODO: Replace with real API call
    // const response = await api.get('/api/email/delivery-status')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    deliveryStatus.value = mockDeliveryStatus
    availableServers.value = mockAvailableServers
    
  } catch (error) {
    showError('Failed to refresh delivery status')
  } finally {
    loading.value = false
  }
}

const updatePreferences = async () => {
  try {
    // TODO: Replace with real API call
    // await api.post('/api/user/email-preferences', preferences.value)
    
    showSuccess('Email preferences updated')
    await refreshStatus()
  } catch (error) {
    showError('Failed to update preferences')
  }
}

onMounted(() => {
  refreshStatus()
})
</script>
