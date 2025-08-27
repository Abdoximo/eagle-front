<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">API Credentials</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage your Stripe API keys and configuration settings
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <select 
          v-model="selectedEnvironment"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="test">Test Environment</option>
          <option value="live">Live Environment</option>
        </select>
      </div>
    </div>

    <!-- Environment Warning -->
    <div v-if="selectedEnvironment === 'live'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
        <div>
          <p class="text-sm font-medium text-red-800 dark:text-red-200">Live Environment</p>
          <p class="text-sm text-red-700 dark:text-red-300">
            You are configuring production credentials. Handle with extreme care.
          </p>
        </div>
      </div>
    </div>

    <!-- Credentials Form -->
    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Publishable Key -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Publishable Key
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="form.publishable_key"
            :type="showKeys.publishable ? 'text' : 'password'"
            placeholder="pk_test_..."
            class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="button"
            @click="showKeys.publishable = !showKeys.publishable"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Eye v-if="!showKeys.publishable" class="w-4 h-4 text-gray-400" />
            <EyeOff v-else class="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Your publishable API key (client-side)
        </p>
      </div>

      <!-- Secret Key -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Secret Key
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="form.secret_key"
            :type="showKeys.secret ? 'text' : 'password'"
            placeholder="sk_test_..."
            class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="button"
            @click="showKeys.secret = !showKeys.secret"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Eye v-if="!showKeys.secret" class="w-4 h-4 text-gray-400" />
            <EyeOff v-else class="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Your secret API key (server-side only)
        </p>
      </div>

      <!-- Webhook Endpoint Secret -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Webhook Endpoint Secret
        </label>
        <div class="relative">
          <input
            v-model="form.webhook_secret"
            :type="showKeys.webhook ? 'text' : 'password'"
            placeholder="whsec_..."
            class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            @click="showKeys.webhook = !showKeys.webhook"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Eye v-if="!showKeys.webhook" class="w-4 h-4 text-gray-400" />
            <EyeOff v-else class="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Used to verify webhook signatures
        </p>
      </div>

      <!-- Additional Settings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Currency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Currency
          </label>
          <select
            v-model="form.default_currency"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="usd">USD - US Dollar</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - British Pound</option>
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="aud">AUD - Australian Dollar</option>
          </select>
        </div>

        <!-- Payment Methods -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Allowed Payment Methods
          </label>
          <div class="space-y-2">
            <label v-for="method in paymentMethods" :key="method.value" class="flex items-center">
              <input
                v-model="form.payment_methods"
                :value="method.value"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ method.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div v-if="connectionStatus" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-2 h-2 rounded-full',
              connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ connectionStatus.connected ? 'Connected' : 'Not Connected' }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Last tested: {{ connectionStatus.last_tested ? formatDate(connectionStatus.last_tested) : 'Never' }}
          </div>
        </div>
        
        <div v-if="connectionStatus.account_info" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Account:</strong> {{ connectionStatus.account_info.business_name || connectionStatus.account_info.email }}</p>
          <p><strong>Country:</strong> {{ connectionStatus.account_info.country }}</p>
          <p><strong>Status:</strong> {{ connectionStatus.account_info.charges_enabled ? 'Active' : 'Pending' }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="handleTest"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Zap class="w-4 h-4 mr-2" />
            Test Connection
          </button>
          
          <button
            type="button"
            @click="generateWebhookUrl"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Link class="w-4 h-4 mr-2" />
            Get Webhook URL
          </button>
        </div>

        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Reset
          </button>
          
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Save class="w-4 h-4 mr-2" />
            {{ loading ? 'Saving...' : 'Save Credentials' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Webhook URL Modal -->
    <div v-if="showWebhookModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Webhook Endpoint URL</h3>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <code class="text-sm text-gray-800 dark:text-gray-200 break-all">
            {{ webhookUrl }}
          </code>
        </div>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Copy this URL and add it to your Stripe webhook endpoints in the Stripe Dashboard.
        </p>
        
        <div class="flex items-center justify-end space-x-3">
          <button
            @click="showWebhookModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Close
          </button>
          
          <button
            @click="copyWebhookUrl"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            <Copy class="w-4 h-4 mr-2" />
            Copy URL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { 
  Eye, EyeOff, Save, Zap, Link, Copy, AlertTriangle
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

interface Props {
  credentials?: any
  loading?: boolean
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'test', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()
const toast = useToast()

// State
const selectedEnvironment = ref('test')
const showWebhookModal = ref(false)
const webhookUrl = ref('')

const showKeys = reactive({
  publishable: false,
  secret: false,
  webhook: false
})

const form = reactive({
  publishable_key: '',
  secret_key: '',
  webhook_secret: '',
  default_currency: 'usd',
  payment_methods: ['card']
})

const paymentMethods = [
  { value: 'card', label: 'Credit/Debit Cards' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'apple_pay', label: 'Apple Pay' },
  { value: 'google_pay', label: 'Google Pay' }
]

// Computed
const connectionStatus = computed(() => props.credentials?.connection_status)

// Methods
const handleSave = () => {
  emit('save', {
    ...form,
    environment: selectedEnvironment.value
  })
}

const handleTest = () => {
  emit('test', {
    ...form,
    environment: selectedEnvironment.value
  })
}

const resetForm = () => {
  Object.assign(form, {
    publishable_key: '',
    secret_key: '',
    webhook_secret: '',
    default_currency: 'usd',
    payment_methods: ['card']
  })
}

const generateWebhookUrl = () => {
  // Generate webhook URL based on current domain
  const baseUrl = window.location.origin
  webhookUrl.value = `${baseUrl}/api/webhooks/stripe`
  showWebhookModal.value = true
}

const copyWebhookUrl = async () => {
  try {
    await navigator.clipboard.writeText(webhookUrl.value)
    toast.success('Webhook URL copied to clipboard!')
    showWebhookModal.value = false
  } catch (error) {
    toast.error('Failed to copy to clipboard')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Watch for credentials changes
watch(() => props.credentials, (newCredentials) => {
  if (newCredentials) {
    Object.assign(form, {
      publishable_key: newCredentials.publishable_key || '',
      secret_key: newCredentials.secret_key || '',
      webhook_secret: newCredentials.webhook_secret || '',
      default_currency: newCredentials.default_currency || 'usd',
      payment_methods: newCredentials.payment_methods || ['card']
    })
    selectedEnvironment.value = newCredentials.environment || 'test'
  }
}, { immediate: true })
</script> 