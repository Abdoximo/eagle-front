<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Payment Settings</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Configure payment processing options and checkout settings
      </p>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- General Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">General Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Checkout Mode
            </label>
            <select
              v-model="form.checkout_mode"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="payment">One-time Payment</option>
              <option value="subscription">Subscription</option>
              <option value="setup">Setup Future Payments</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Accepted Payment Methods</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label v-for="method in paymentMethods" :key="method.value" class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
            <input
              v-model="form.payment_methods"
              :value="method.value"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <component :is="method.icon" class="w-5 h-5 ml-3 mr-2 text-gray-600 dark:text-gray-400" />
            <div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ method.label }}</span>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ method.description }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Security & Fraud Prevention</h3>
        
        <div class="space-y-4">
          <label class="flex items-center">
            <input
              v-model="form.require_cvc"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-white">Require CVC verification</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="form.require_postal_code"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-white">Require postal code verification</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="form.enable_3d_secure"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-white">Enable 3D Secure authentication</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="form.enable_radar"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-900 dark:text-white">Enable Stripe Radar fraud detection</span>
          </label>
        </div>
      </div>

      <!-- Checkout Customization -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Checkout Customization</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name
            </label>
            <input
              v-model="form.business_name"
              type="text"
              placeholder="Your Business Name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Support Email
            </label>
            <input
              v-model="form.support_email"
              type="email"
              placeholder="support@yourbusiness.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Success URL
            </label>
            <input
              v-model="form.success_url"
              type="url"
              placeholder="https://yourdomain.com/success"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cancel URL
            </label>
            <input
              v-model="form.cancel_url"
              type="url"
              placeholder="https://yourdomain.com/cancel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Save, CreditCard, Smartphone, Building, Globe } from 'lucide-vue-next'

interface Props {
  settings?: any
  loading?: boolean
}

interface Emits {
  (e: 'save', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const form = reactive({
  default_currency: 'usd',
  checkout_mode: 'payment',
  payment_methods: ['card'],
  require_cvc: true,
  require_postal_code: false,
  enable_3d_secure: true,
  enable_radar: true,
  business_name: '',
  support_email: '',
  success_url: '',
  cancel_url: ''
})

const paymentMethods = [
  {
    value: 'card',
    label: 'Credit/Debit Cards',
    description: 'Visa, Mastercard, Amex, etc.',
    icon: CreditCard
  },
  {
    value: 'apple_pay',
    label: 'Apple Pay',
    description: 'iOS and macOS devices',
    icon: Smartphone
  },
  {
    value: 'google_pay',
    label: 'Google Pay',
    description: 'Android devices and web',
    icon: Globe
  },
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    description: 'Direct bank payments',
    icon: Building
  }
]

const handleSave = () => {
  emit('save', { ...form })
}

// Watch for settings changes
watch(() => props.settings, (newSettings) => {
  if (newSettings) {
    Object.assign(form, {
      default_currency: newSettings.default_currency || 'usd',
      checkout_mode: newSettings.checkout_mode || 'payment',
      payment_methods: newSettings.payment_methods || ['card'],
      require_cvc: newSettings.require_cvc ?? true,
      require_postal_code: newSettings.require_postal_code ?? false,
      enable_3d_secure: newSettings.enable_3d_secure ?? true,
      enable_radar: newSettings.enable_radar ?? true,
      business_name: newSettings.business_name || '',
      support_email: newSettings.support_email || '',
      success_url: newSettings.success_url || '',
      cancel_url: newSettings.cancel_url || ''
    })
  }
}, { immediate: true })
</script> 