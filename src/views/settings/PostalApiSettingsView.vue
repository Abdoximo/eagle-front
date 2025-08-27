<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Postal API Servers</h2>
        <p v-if="authStore.isAuthenticated" class="text-gray-600">Manage your Postal API email delivery servers</p>
        <p v-else class="text-gray-600">Please log in to manage your Postal API email delivery servers</p>
      </div>
      
      <button
        v-if="authStore.isAuthenticated"
        @click="showAddModal = true"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Add Server
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-if="authStore.isAuthenticated" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ServerIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Servers</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Servers</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.active }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <EnvelopeIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Emails Sent Today</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.emailsSentToday }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <GlobeAltIcon class="h-6 w-6 text-indigo-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Webhooks Active</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.webhooksActive }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Servers List -->
    <div v-if="authStore.isAuthenticated" class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="server in servers" :key="server.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Status Indicator -->
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'h-3 w-3 rounded-full',
                    server.is_active ? 'bg-green-400' : 'bg-red-400'
                  ]"
                ></div>
              </div>

              <!-- Server Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ server.name }}
                  </h3>
                  
                  <span v-if="server.is_shared" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Shared
                  </span>
                  
                  <span v-if="server.webhook_settings?.enabled" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Webhook
                  </span>
                </div>
                
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ server.domain }}</span>
                  <span>Priority: {{ server.priority }}</span>
                  <span>From: {{ server.from_email }}</span>
                </div>
                
                <div class="mt-1 flex items-center space-x-4 text-xs text-gray-400">
                  <span v-if="server.daily_limit">
                    Daily: {{ server.emails_sent_today }}/{{ server.daily_limit }}
                  </span>
                  <span v-if="server.hourly_limit">
                    Hourly: {{ server.emails_sent_hour }}/{{ server.hourly_limit }}
                  </span>
                  <span v-if="server.last_used_at">
                    Last used: {{ formatDate(server.last_used_at) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button
                @click="testServer(server)"
                :disabled="testingServer === server.id"
                class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                title="Test Connection"
              >
                <div v-if="testingServer === server.id" class="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <WrenchScrewdriverIcon v-else class="h-4 w-4" />
              </button>

                                <button
                    @click="openTestEmailModal(server)"
                    class="p-2 text-green-400 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
                    title="Send Test Email"
                  >
                    <EnvelopeIcon class="h-4 w-4" />
                  </button>

              <button
                @click="editServer(server)"
                class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                title="Edit Server"
              >
                <PencilIcon class="h-4 w-4" />
              </button>

              <button
                @click="deleteServer(server)"
                class="p-2 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                title="Delete Server"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Test Result -->
          <div v-if="testResults[server.id]" class="mt-3 ml-10">
            <div
              :class="[
                'flex items-center space-x-2 text-sm',
                testResults[server.id].success ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <CheckCircleIcon v-if="testResults[server.id].success" class="h-4 w-4" />
              <XCircleIcon v-else class="h-4 w-4" />
              <span>{{ testResults[server.id].message }}</span>
            </div>
          </div>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12">
        <ServerIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
        <p class="mt-1 text-sm text-gray-500">
          Please log in to manage your Postal API servers.
        </p>
        <div class="mt-6">
          <router-link
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </router-link>
        </div>
      </div>
      
      <!-- No Servers State -->
      <div v-else-if="servers.length === 0" class="text-center py-12">
        <ServerIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Postal API servers</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating your first Postal API server.
        </p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Server
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="(showAddModal || editingServer) && authStore.isAuthenticated" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingServer ? 'Edit Postal API Server' : 'Add New Postal API Server' }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Server Name *
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Postal Server"
                />
              </div>

              <div>
                <label for="domain" class="block text-sm font-medium text-gray-700">
                  Postal Domain *
                </label>
                <input
                  id="domain"
                  v-model="form.domain"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="mail.yourdomain.com"
                />
              </div>
            </div>

            <!-- API Configuration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="api_key" class="block text-sm font-medium text-gray-700">
                  API Key *
                </label>
                <div class="relative">
                  <input
                    id="api_key"
                    v-model="form.api_key"
                    :type="showApiKey ? 'text' : 'password'"
                    required
                    class="mt-1 block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your Postal API key"
                  />
                  <button
                    type="button"
                    @click="showApiKey = !showApiKey"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <EyeIcon v-if="!showApiKey" class="h-5 w-5 text-gray-400" />
                    <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
            </div>

            <!-- From Email Configuration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="from_email" class="block text-sm font-medium text-gray-700">
                  From Email *
                </label>
                <input
                  id="from_email"
                  v-model="form.from_email"
                  type="email"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="noreply@yourdomain.com"
                />
              </div>

              <div>
                <label for="from_name" class="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  id="from_name"
                  v-model="form.from_name"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            <!-- Limits -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="daily_limit" class="block text-sm font-medium text-gray-700">
                  Daily Limit
                </label>
                <input
                  id="daily_limit"
                  v-model.number="form.daily_limit"
                  type="number"
                  min="1"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10000"
                />
                <p class="mt-1 text-sm text-gray-500">Leave empty for unlimited</p>
              </div>

              <div>
                <label for="hourly_limit" class="block text-sm font-medium text-gray-700">
                  Hourly Limit
                </label>
                <input
                  id="hourly_limit"
                  v-model.number="form.hourly_limit"
                  type="number"
                  min="1"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1000"
                />
                <p class="mt-1 text-sm text-gray-500">Leave empty for unlimited</p>
              </div>
            </div>

            <!-- Tracking Options -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">Tracking Options</h4>
              <div class="flex items-center space-x-6">
                <label class="flex items-center">
                  <input
                    v-model="form.track_opens"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Track email opens</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.track_clicks"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Track link clicks</span>
                </label>
              </div>
            </div>

            <!-- Webhook Settings -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">Webhook Settings</h4>
              <label class="flex items-center">
                <input
                  v-model="form.webhook_settings!.enabled"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Enable webhooks for tracking</span>
              </label>
            </div>

            <!-- Admin Options -->
            <div v-if="isAdmin" class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">Admin Options</h4>
              <label class="flex items-center">
                <input
                  v-model="form.is_shared"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Share this server with all users</span>
              </label>
            </div>

            <!-- Status -->
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-4">
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="testConnection"
                  :disabled="testing || !canTest"
                  class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="testing" class="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  {{ testing ? 'Testing...' : 'Test Connection' }}
                </button>
                
                <div v-if="testResult" class="flex items-center space-x-2">
                  <CheckCircleIcon v-if="testResult.success" class="h-5 w-5 text-green-500" />
                  <XCircleIcon v-else class="h-5 w-5 text-red-500" />
                  <span :class="testResult.success ? 'text-green-700' : 'text-red-700'" class="text-sm">
                    {{ testResult.message }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="submitting" class="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  {{ submitting ? 'Saving...' : (editingServer ? 'Update Server' : 'Create Server') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Test Email Modal -->
    <div v-if="showTestEmailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Send Test Email
          </h3>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              Send a test email to verify your Postal API server is working correctly.
            </p>
            <p class="text-sm text-gray-500">
              Server: <strong>{{ selectedServerForTest?.name }}</strong> ({{ selectedServerForTest?.domain }})
            </p>
          </div>

          <form @submit.prevent="sendTestEmail" class="space-y-4">
            <div>
              <label for="test-email" class="block text-sm font-medium text-gray-700">
                To Email Address *
              </label>
              <input
                id="test-email"
                v-model="testEmailTo"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="test@example.com"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeTestEmailModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="sendingTestEmail || !testEmailTo"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="sendingTestEmail">Sending...</span>
                <span v-else>Send Test Email</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  PlusIcon,
  ServerIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import { postalApi, type PostalApiServer, type CreatePostalServerData } from '@/services/postal.api'
import { getToast } from '@/services/toast'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'

const showAddModal = ref(false)
const editingServer = ref<any>(null)
const servers = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const testing = ref(false)
const testResult = ref<any>(null)
const testingServer = ref<string | null>(null)
const testResults = ref<Record<string, any>>({})
const showApiKey = ref(false)
const showTestEmailModal = ref(false)
const selectedServerForTest = ref<any>(null)
const testEmailTo = ref('')
const sendingTestEmail = ref(false)

const stats = ref({
  total: 0,
  active: 0,
  emailsSentToday: 0,
  webhooksActive: 0
})

const form = ref<CreatePostalServerData>({
  name: '',
  domain: '',
  api_key: '',
  from_email: '',
  from_name: '',
  priority: 5,
  daily_limit: undefined,
  hourly_limit: undefined,
  track_opens: true,
  track_clicks: true,
  is_active: true,
  is_shared: false,
  webhook_settings: {
    enabled: true,
    events: ['MessageSent', 'MessageDelivered', 'MessageDeliveryFailed', 'MessageBounced', 'MessageLinkClicked', 'MessageLoaded']
  }
})

const authStore = useAuthStore()

const isAdmin = computed(() => {
  return authStore.isAdmin
})

const canTest = computed(() => {
  return form.value.domain && form.value.api_key
})

const showModal = computed(() => {
  return showAddModal.value || !!editingServer.value
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadServers()
  }
})

// Watch for authentication changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadServers()
  } else {
    servers.value = []
    calculateStats()
  }
})

const loadServers = async () => {
  if (!authStore.isAuthenticated) {
    servers.value = []
    calculateStats()
    return
  }
  
  loading.value = true
  try {
    const response = await postalApi.getServers()
    servers.value = response || []
    calculateStats()
  } catch (error: any) {
    getToast().error('Failed to load postal servers')
    servers.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.value = {
    total: servers.value.length,
    active: servers.value.filter(s => s.is_active).length,
    emailsSentToday: servers.value.reduce((sum, s) => sum + (s.emails_sent_today || 0), 0),
    webhooksActive: servers.value.filter(s => s.webhook_settings?.enabled).length
  }
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    getToast().error('You must be logged in to perform this action')
    return
  }
  
  submitting.value = true
  
  try {
    if (editingServer.value) {
      // Update existing server
      await postalApi.updateServer({
        id: editingServer.value.id,
        ...form.value
      })
      getToast().success('Postal server updated successfully')
    } else {
      // Create new server
      await postalApi.createServer(form.value as CreatePostalServerData)
      getToast().success('Postal server created successfully')
    }
    
    closeModal()
    loadServers()
  } catch (error: any) {
    getToast().error(error.response?.data?.message || 'Failed to save postal server')
  } finally {
    submitting.value = false
  }
}

const testConnection = async () => {
  if (!authStore.isAuthenticated) {
    getToast().error('You must be logged in to perform this action')
    return
  }
  
  if (!canTest.value) return
  
  testing.value = true
  testResult.value = null
  
  try {
    // Use the backend API to test the connection
    const result = await postalApi.testConnectionBeforeCreate({
      domain: form.value.domain,
      api_key: form.value.api_key
    })
    
    testResult.value = result
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: error.response?.data?.message || 'Connection test failed - check domain and API key'
    }
  } finally {
    testing.value = false
  }
}

const testServer = async (server: any) => {
  if (!authStore.isAuthenticated) {
    getToast().error('You must be logged in to perform this action')
    return
  }
  
  testingServer.value = server.id
  testResults.value[server.id] = null
  
  try {
    const result = await postalApi.testConnection(server.id)
    testResults.value[server.id] = result
  } catch (error: any) {
    testResults.value[server.id] = null
    getToast().error('Failed to test server connection')
  } finally {
    testingServer.value = null
  }
}

const openTestEmailModal = (server: any) => {
  selectedServerForTest.value = server
  testEmailTo.value = ''
  showTestEmailModal.value = true
}

const sendTestEmail = async () => {
  if (!selectedServerForTest.value || !testEmailTo.value) {
    return
  }
  
  sendingTestEmail.value = true
  
  try {
    const result = await postalApi.sendTestEmail(selectedServerForTest.value.id, testEmailTo.value)
    
    if (result.success) {
      getToast().success('Test email sent successfully!')
      showTestEmailModal.value = false
      selectedServerForTest.value = null
      testEmailTo.value = ''
    } else {
      getToast().error(result.message || 'Failed to send test email')
    }
  } catch (error: any) {
    getToast().error(error.response?.data?.message || 'Failed to send test email')
  } finally {
    sendingTestEmail.value = false
  }
}

const closeTestEmailModal = () => {
  showTestEmailModal.value = false
  selectedServerForTest.value = null
  testEmailTo.value = ''
}

const editServer = (server: any) => {
  editingServer.value = server
  form.value = { ...server }
  showAddModal.value = true
}

const deleteServer = async (server: any) => {
  if (!authStore.isAuthenticated) {
    getToast().error('You must be logged in to perform this action')
    return
  }
  
  const confirmed = await useConfirm().confirm({
    title: 'Delete Postal Server',
    message: `Are you sure you want to delete "${server.name}"? This action cannot be undone.`,
    type: 'danger',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })
  
  if (!confirmed) {
    return
  }
  
  try {
    await postalApi.deleteServer(server.id)
    getToast().success('Postal server deleted successfully')
    loadServers()
  } catch (error: any) {
    getToast().error(error.response?.data?.message || 'Failed to delete postal server')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingServer.value = null
  form.value = {
    name: '',
    domain: '',
    api_key: '',
    from_email: '',
    from_name: '',
    priority: 5,
    daily_limit: undefined,
    hourly_limit: undefined,
    track_opens: true,
    track_clicks: true,
    is_active: true,
    is_shared: false,
    webhook_settings: {
      enabled: true,
      events: ['MessageSent', 'MessageDelivered', 'MessageDeliveryFailed', 'MessageBounced', 'MessageLinkClicked', 'MessageLoaded']
    }
  }
  testResult.value = null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
