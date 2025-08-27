<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
        </div>
      </div>
    </div>

    <!-- Account Status -->
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Account Overview</h2>
        <button
          @click="$emit('refresh')"
          class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <!-- Account Info Cards -->
      <div v-if="account" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Account Status -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div :class="[
              'p-3 rounded-full',
              account.charges_enabled ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
            ]">
              <Shield :class="[
                'w-6 h-6',
                account.charges_enabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
              ]" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Account Status</h3>
              <p :class="[
                'text-sm font-medium',
                account.charges_enabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
              ]">
                {{ account.charges_enabled ? 'Active' : 'Pending Verification' }}
              </p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Charges:</span>
              <span :class="account.charges_enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ account.charges_enabled ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Payouts:</span>
              <span :class="account.payouts_enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ account.payouts_enabled ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Account Details -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Building class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Business Info</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.type || 'Individual' }}</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Country:</span>
              <span class="text-gray-900 dark:text-white">{{ account.country || 'N/A' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Currency:</span>
              <span class="text-gray-900 dark:text-white">{{ account.default_currency?.toUpperCase() || 'USD' }}</span>
            </div>
            <div v-if="account.business_name" class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Business:</span>
              <span class="text-gray-900 dark:text-white truncate">{{ account.business_name }}</span>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Settings class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Configuration</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Payment methods & settings</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Dashboard:</span>
              <a 
                :href="account.dashboard_url" 
                target="_blank"
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Open <ExternalLink class="w-3 h-3 inline ml-1" />
              </a>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Created:</span>
              <span class="text-gray-900 dark:text-white">{{ formatDate(account.created) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Account State -->
      <div v-else class="text-center py-12">
        <CreditCard class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Stripe Account Connected</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Connect your Stripe account to start processing payments
        </p>
        <router-link
          to="#"
          @click="$router.push({ name: 'admin.stripe.settings', hash: '#credentials' })"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Key class="w-4 h-4 mr-2" />
          Configure Credentials
        </router-link>
      </div>

      <!-- Payment Methods Overview -->
      <div v-if="account" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="method in paymentMethods" 
            :key="method.type"
            class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <component :is="method.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ method.name }}</div>
              <div :class="[
                'text-xs',
                method.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              ]">
                {{ method.enabled ? 'Enabled' : 'Disabled' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div v-if="account && recentActivity.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        
        <div class="space-y-3">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center">
              <div :class="[
                'p-2 rounded-full mr-3',
                activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900/20' :
                activity.type === 'payout' ? 'bg-blue-100 dark:bg-blue-900/20' :
                'bg-gray-100 dark:bg-gray-600'
              ]">
                <DollarSign v-if="activity.type === 'payment'" class="w-4 h-4 text-green-600 dark:text-green-400" />
                <TrendingUp v-else-if="activity.type === 'payout'" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <AlertCircle v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.description }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(activity.created_at) }}</div>
              </div>
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ activity.amount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  RefreshCw, Shield, Building, Settings, ExternalLink, CreditCard, 
  Key, DollarSign, TrendingUp, AlertCircle, Smartphone, Globe
} from 'lucide-vue-next'

interface Props {
  account?: any
  loading?: boolean
}

interface Emits {
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<Emits>()

// Computed
const paymentMethods = computed(() => [
  {
    type: 'card',
    name: 'Cards',
    icon: CreditCard,
    enabled: true
  },
  {
    type: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Building,
    enabled: props.account?.capabilities?.bank_transfer_payments === 'active'
  },
  {
    type: 'apple_pay',
    name: 'Apple Pay',
    icon: Smartphone,
    enabled: props.account?.capabilities?.apple_pay_domains === 'active'
  },
  {
    type: 'google_pay',
    name: 'Google Pay',
    icon: Globe,
    enabled: props.account?.capabilities?.google_pay === 'active'
  }
])

const recentActivity = computed(() => {
  // Mock recent activity - in real implementation, this would come from props or API
  return [
    {
      id: 1,
      type: 'payment',
      description: 'Payment received from customer',
      amount: '$49.99',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: 'payout',
      description: 'Payout to bank account',
      amount: '$1,249.50',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: 'payment',
      description: 'Subscription payment',
      amount: '$29.99',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 