<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- General Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Contacts per List
            </label>
            <input
              v-model.number="form.max_contacts_per_list"
              type="number"
              min="1000"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Campaigns per Month
            </label>
            <input
              v-model.number="form.max_campaigns_per_month"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Credits for New Users
            </label>
            <input
              v-model.number="form.default_credits_new_user"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Rate Limit (emails/hour)
            </label>
            <input
              v-model.number="form.smtp_rate_limit"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div class="flex items-start space-x-3">
            <input
              v-model="form.maintenance_mode"
              type="checkbox"
              id="maintenance"
              class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <label for="maintenance" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Temporarily disable the platform for maintenance
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <input
              v-model="form.registration_enabled"
              type="checkbox"
              id="registration"
              class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <label for="registration" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Registration
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Allow new users to register accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stripe Configuration -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Stripe Payment Settings</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Configure Stripe for credit purchases</p>
          </div>
          <div class="flex items-center space-x-3">
            <input
              v-model="form.stripe_enabled"
              type="checkbox"
              id="stripe-enabled"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="stripe-enabled" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Stripe
            </label>
          </div>
        </div>

        <div v-if="form.stripe_enabled" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stripe Public Key <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.stripe_public_key"
              type="text"
              placeholder="pk_live_..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your Stripe publishable key (starts with pk_)
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stripe Secret Key <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.stripe_secret_key"
                :type="showStripeSecret ? 'text' : 'password'"
                placeholder="sk_live_..."
                class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                @click="showStripeSecret = !showStripeSecret"
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showStripeSecret" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your Stripe secret key (starts with sk_) - stored securely
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Webhook Endpoint Secret
            </label>
            <div class="relative">
              <input
                v-model="form.stripe_webhook_secret"
                :type="showWebhookSecret ? 'text' : 'password'"
                placeholder="whsec_..."
                class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                @click="showWebhookSecret = !showWebhookSecret"
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showWebhookSecret" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Webhook endpoint secret for payment verification
            </p>
          </div>

          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div class="flex items-start">
              <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Webhook Configuration Required
                </h4>
                <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Add this webhook URL in your Stripe dashboard:<br>
                  <code class="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded text-xs">
                    {{ webhookUrl }}
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Packages -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Credit Packages</h3>
          <button
            @click="addCreditPackage"
            type="button"
            class="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus class="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(pkg, index) in form.credit_packages"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credits
              </label>
              <input
                v-model.number="pkg.credits"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                v-model.number="pkg.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Per Credit
              </label>
              <input
                :value="(pkg.price / pkg.credits).toFixed(4)"
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500"
              />
            </div>
            <div class="flex items-end justify-between">
              <div class="flex items-center space-x-2">
                <input
                  v-model="pkg.popular"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700 dark:text-gray-300">Popular</label>
              </div>
              <button
                @click="removeCreditPackage(index)"
                type="button"
                class="p-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Eye, EyeOff, AlertTriangle, Plus, Trash2 } from 'lucide-vue-next'
import { adminService } from '@/services/admin'
import type { AdminSettings } from '@/services/admin'

const loading = ref(false)
const showStripeSecret = ref(false)
const showWebhookSecret = ref(false)

const form = ref<AdminSettings>({
  max_contacts_per_list: 50000,
  max_campaigns_per_month: 100,
  default_credits_new_user: 100,
  smtp_rate_limit: 100,
  maintenance_mode: false,
  registration_enabled: true,
  stripe_enabled: false,
  stripe_public_key: '',
  stripe_secret_key: '',
  stripe_webhook_secret: '',
  credit_packages: [
    { credits: 1000, price: 9.99, price_per_credit: 0.01, popular: false },
    { credits: 5000, price: 39.99, price_per_credit: 0.008, popular: true },
    { credits: 10000, price: 69.99, price_per_credit: 0.007, popular: false }
  ]
})

const webhookUrl = computed(() => {
  return `${window.location.origin}/api/webhooks/stripe`
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await adminService.updateSettings(form.value)
    // Show success message
  } catch (error) {
    console.error('Settings save error:', error)
  } finally {
    loading.value = false
  }
}

const addCreditPackage = () => {
  form.value.credit_packages.push({
    credits: 1000,
    price: 10,
    price_per_credit: 0.01,
    popular: false
  })
}

const removeCreditPackage = (index: number) => {
  form.value.credit_packages.splice(index, 1)
}

const resetForm = async () => {
  try {
    const response = await adminService.getSettings()
    form.value = response.settings
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

onMounted(resetForm)
</script>