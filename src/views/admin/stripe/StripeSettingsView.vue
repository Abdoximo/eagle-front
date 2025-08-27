<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <CreditCard class="w-8 h-8 mr-3 text-indigo-600" />
                Stripe Payment Settings
              </h1>
              <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Configure your Stripe account, API credentials, and payment processing
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- Connection Status -->
              <div class="flex items-center space-x-2">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  stripeConnected ? 'bg-green-500' : 'bg-red-500'
                ]"></div>
                <span :class="[
                  'text-sm font-medium',
                  stripeConnected ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                ]">
                  {{ stripeConnected ? 'Connected' : 'Disconnected' }}
                </span>
              </div>
              
              <button
                @click="testConnection"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Zap class="w-4 h-4 mr-2" />
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tab Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- API Credentials Tab -->
          <div v-if="activeTab === 'credentials'">
            <StripeCredentials 
              :credentials="credentials"
              :loading="loading"
              @save="saveCredentials"
              @test="testCredentials"
            />
          </div>

          <!-- Webhook Configuration Tab -->
          <div v-else-if="activeTab === 'webhooks'">
            <StripeWebhooks
              :webhooks="webhooks"
              :loading="loading"
              @create="createWebhook"
              @update="updateWebhook"
              @delete="deleteWebhook"
              @test="testWebhook"
            />
          </div>

          <!-- Payment Settings Tab -->
          <div v-else-if="activeTab === 'payments'">
            <StripePaymentSettings
              :settings="paymentSettings"
              :loading="loading"
              @save="savePaymentSettings"
            />
          </div>

          <!-- Billing Plans Tab -->
          <div v-else-if="activeTab === 'plans'">
            <StripeBillingPlans
              :plans="billingPlans"
              :loading="loading"
              @create="createBillingPlan"
              @update="updateBillingPlan"
              @delete="deleteBillingPlan"
            />
          </div>

          <!-- Transaction Logs Tab -->
          <div v-else-if="activeTab === 'logs'">
            <StripeTransactionLogs
              :transactions="transactions"
              :loading="loading"
              @refresh="fetchTransactions"
              @export="exportTransactions"
            />
          </div>

          <!-- Account Overview Tab -->
          <div v-else>
            <StripeAccountOverview
              :account="stripeAccount"
              :loading="loading"
              @refresh="fetchAccountInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  CreditCard, Key, Webhook, Settings, CreditCard as CreditCardIcon, 
  FileText, Zap, User
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useStripeAdminStore } from '@/stores/admin/stripe'

// Components
import StripeCredentials from '@/components/admin/stripe/StripeCredentials.vue'
import StripeWebhooks from '@/components/admin/stripe/StripeWebhooks.vue'
import StripePaymentSettings from '@/components/admin/stripe/StripePaymentSettings.vue'
import StripeBillingPlans from '@/components/admin/stripe/StripeBillingPlans.vue'
import StripeTransactionLogs from '@/components/admin/stripe/StripeTransactionLogs.vue'
import StripeAccountOverview from '@/components/admin/stripe/StripeAccountOverview.vue'

const toast = useToast()
const stripeStore = useStripeAdminStore()

// State
const activeTab = ref('overview')
const loading = ref(false)

// Computed
const stripeConnected = computed(() => stripeStore.isConnected)
const credentials = computed(() => stripeStore.credentials)
const webhooks = computed(() => stripeStore.webhooks)
const paymentSettings = computed(() => stripeStore.paymentSettings)
const billingPlans = computed(() => stripeStore.billingPlans)
const transactions = computed(() => stripeStore.transactions)
const stripeAccount = computed(() => stripeStore.accountInfo)

// Tab configuration
const tabs = [
  { id: 'overview', name: 'Account Overview', icon: User },
  { id: 'credentials', name: 'API Credentials', icon: Key },
  { id: 'webhooks', name: 'Webhooks', icon: Webhook },
  { id: 'payments', name: 'Payment Settings', icon: Settings },
  { id: 'plans', name: 'Billing Plans', icon: CreditCardIcon },
  { id: 'logs', name: 'Transaction Logs', icon: FileText }
]

// Methods
const testConnection = async () => {
  try {
    loading.value = true
    await stripeStore.testConnection()
    toast.success('Stripe connection test successful!')
  } catch (error: any) {
    toast.error(error.message || 'Connection test failed')
  } finally {
    loading.value = false
  }
}

const saveCredentials = async (credentialData: any) => {
  try {
    loading.value = true
    await stripeStore.saveCredentials(credentialData)
    toast.success('Credentials saved successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to save credentials')
  } finally {
    loading.value = false
  }
}

const testCredentials = async (credentialData: any) => {
  try {
    loading.value = true
    await stripeStore.testCredentials(credentialData)
    toast.success('Credentials test successful!')
  } catch (error: any) {
    toast.error(error.message || 'Credentials test failed')
  } finally {
    loading.value = false
  }
}

const createWebhook = async (webhookData: any) => {
  try {
    loading.value = true
    await stripeStore.createWebhook(webhookData)
    toast.success('Webhook created successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to create webhook')
  } finally {
    loading.value = false
  }
}

const updateWebhook = async (id: string, webhookData: any) => {
  try {
    loading.value = true
    await stripeStore.updateWebhook(id, webhookData)
    toast.success('Webhook updated successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update webhook')
  } finally {
    loading.value = false
  }
}

const deleteWebhook = async (id: string) => {
  if (confirm('Are you sure you want to delete this webhook?')) {
    try {
      loading.value = true
      await stripeStore.deleteWebhook(id)
      toast.success('Webhook deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete webhook')
    } finally {
      loading.value = false
    }
  }
}

const testWebhook = async (id: string) => {
  try {
    loading.value = true
    await stripeStore.testWebhook(id)
    toast.success('Webhook test sent successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Webhook test failed')
  } finally {
    loading.value = false
  }
}

const savePaymentSettings = async (settings: any) => {
  try {
    loading.value = true
    await stripeStore.savePaymentSettings(settings)
    toast.success('Payment settings saved successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to save payment settings')
  } finally {
    loading.value = false
  }
}

const createBillingPlan = async (planData: any) => {
  try {
    loading.value = true
    await stripeStore.createBillingPlan(planData)
    toast.success('Billing plan created successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to create billing plan')
  } finally {
    loading.value = false
  }
}

const updateBillingPlan = async (id: string, planData: any) => {
  try {
    loading.value = true
    await stripeStore.updateBillingPlan(id, planData)
    toast.success('Billing plan updated successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update billing plan')
  } finally {
    loading.value = false
  }
}

const deleteBillingPlan = async (id: string) => {
  if (confirm('Are you sure you want to delete this billing plan?')) {
    try {
      loading.value = true
      await stripeStore.deleteBillingPlan(id)
      toast.success('Billing plan deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete billing plan')
    } finally {
      loading.value = false
    }
  }
}

const fetchTransactions = async () => {
  try {
    loading.value = true
    await stripeStore.fetchTransactions()
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch transactions')
  } finally {
    loading.value = false
  }
}

const exportTransactions = async () => {
  try {
    loading.value = true
    await stripeStore.exportTransactions()
    toast.success('Transaction export started!')
  } catch (error: any) {
    toast.error(error.message || 'Failed to export transactions')
  } finally {
    loading.value = false
  }
}

const fetchAccountInfo = async () => {
  try {
    loading.value = true
    await stripeStore.fetchAccountInfo()
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch account info')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchAccountInfo()
})
</script> 