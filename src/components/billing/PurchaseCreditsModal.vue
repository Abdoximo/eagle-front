<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Purchase Credits</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Credit Packages -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Choose a credit package:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                v-for="package_ in creditPackages" 
                :key="package_.id"
                @click="selectedPackage = package_"
                :class="[
                  'relative cursor-pointer border-2 rounded-lg p-4 transition-all',
                  selectedPackage?.id === package_.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]"
              >
                <div v-if="package_.popular" 
                     class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Most Popular
                </div>
                
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ formatNumber(package_.credits) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Credits</div>
                  <div class="text-xl font-bold text-blue-600">${{ package_.price }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    ${{ (package_.price / package_.credits).toFixed(3) }} per credit
                  </div>
                  <div v-if="package_.bonus > 0" class="text-sm text-green-600 font-medium mt-2">
                    +{{ package_.bonus }} bonus credits!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Amount -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Or enter custom amount:
              </label>
              <button 
                @click="showCustom = !showCustom"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                {{ showCustom ? 'Hide' : 'Custom Amount' }}
              </button>
            </div>
            
            <div v-if="showCustom" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Credits</label>
                <input
                  v-model.number="customCredits"
                  type="number"
                  min="100"
                  step="100"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="1000"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Price ($)</label>
                <input
                  v-model.number="customPrice"
                  type="number"
                  min="10"
                  step="0.01"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="10.00"
                />
              </div>
            </div>
          </div>

          <!-- Billing Information -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Billing Information:</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">First Name</label>
                <input
                  v-model="billingInfo.firstName"
                  type="text"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Last Name</label>
                <input
                  v-model="billingInfo.lastName"
                  type="text"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input
                  v-model="billingInfo.email"
                  type="email"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Address</label>
                <input
                  v-model="billingInfo.address"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">City</label>
                <input
                  v-model="billingInfo.city"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Country</label>
                <select
                  v-model="billingInfo.country"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Credits:</span>
                <span class="font-medium">{{ formatNumber(finalCredits) }}</span>
              </div>
              <div v-if="finalBonus > 0" class="flex justify-between text-green-600">
                <span>Bonus Credits:</span>
                <span class="font-medium">+{{ formatNumber(finalBonus) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span class="font-medium">${{ finalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Tax:</span>
                <span class="font-medium">$0.00</span>
              </div>
              <hr class="border-gray-200 dark:border-gray-600">
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${{ finalPrice.toFixed(2) }}</span>
              </div>
              <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                You will receive {{ formatNumber(finalCredits + finalBonus) }} total credits
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handlePurchase"
              :disabled="loading || !canPurchase"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Processing...</span>
              <span v-else>Purchase Credits</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { billingAPI } from '@/services/billing.api'
import { showSuccess, showError } from '@/services/toast'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits<{
  close: []
  purchased: [data: any]
}>()

const loading = ref(false)
const showCustom = ref(false)
const selectedPackage = ref(null)
const customCredits = ref(1000)
const customPrice = ref(10)

const billingInfo = ref({
  firstName: '',
  lastName: '',
  email: authStore.user?.email || '',
  address: '',
  city: '',
  country: ''
})

const creditPackages = ref([
  { id: 1, credits: 1000, price: 10, bonus: 0, popular: false },
  { id: 2, credits: 5000, price: 45, bonus: 500, popular: true },
  { id: 3, credits: 10000, price: 80, bonus: 2000, popular: false },
  { id: 4, credits: 25000, price: 180, bonus: 7500, popular: false }
])

const finalCredits = computed(() => {
  if (showCustom.value) {
    return customCredits.value || 0
  }
  return selectedPackage.value?.credits || 0
})

const finalPrice = computed(() => {
  if (showCustom.value) {
    return customPrice.value || 0
  }
  return selectedPackage.value?.price || 0
})

const finalBonus = computed(() => {
  if (showCustom.value) {
    return 0
  }
  return selectedPackage.value?.bonus || 0
})

const canPurchase = computed(() => {
  return (selectedPackage.value || (showCustom.value && customCredits.value && customPrice.value)) &&
         billingInfo.value.firstName &&
         billingInfo.value.lastName &&
         billingInfo.value.email
})

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num || 0)
}

const handlePurchase = async () => {
  if (!canPurchase.value) return

  loading.value = true
  try {
    const purchaseData = {
      credits: finalCredits.value,
      price: finalPrice.value,
      bonus: finalBonus.value,
      billing_info: billingInfo.value
    }

    const result = await billingAPI.purchaseCredits(purchaseData)
    
    emit('purchased', {
      credits: finalCredits.value + finalBonus.value,
      invoice: result.invoice
    })
  } catch (error: any) {
    console.error('Purchase failed:', error)
    showError(error.response?.data?.message || 'Purchase failed')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Auto-select most popular package
  selectedPackage.value = creditPackages.value.find(p => p.popular) || creditPackages.value[0]
})
</script>
