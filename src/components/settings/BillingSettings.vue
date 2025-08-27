<template>
  <div class="space-y-6">
    <!-- Current Balance Card -->
    <SettingsCard :title="$t('settings.billing.currentBalance')">
      <div class="text-center py-8">
        <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {{ creditBalance?.current?.toLocaleString() || 0 }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {{ $t('settings.billing.credits') }}
        </div>
        
        <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <div>{{ $t('settings.billing.totalPurchased') }}: {{ creditBalance?.total_purchased?.toLocaleString() || 0 }}</div>
          <div>{{ $t('settings.billing.totalUsed') }}: {{ creditBalance?.total_used?.toLocaleString() || 0 }}</div>
        </div>
        
        <button
          @click="showPurchaseModal = true"
          :disabled="billingLoading"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
        >
          <CreditCard class="w-5 h-5 mr-2" />
          {{ $t('settings.billing.buyCredits') }}
        </button>
      </div>
    </SettingsCard>

    <!-- Payment History -->
    <SettingsCard :title="$t('settings.billing.paymentHistory')" :loading="billingLoading">
      <div v-if="paymentHistory.length === 0" class="text-center py-8">
        <Receipt class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('settings.billing.noPayments') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('settings.billing.noPaymentsDescription') }}
        </p>
      </div>
      
      <div v-else class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('settings.billing.date') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('settings.billing.amount') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('settings.billing.credits') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('settings.billing.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ $t('settings.billing.invoice') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="payment in paymentHistory" :key="payment.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(payment.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  €{{ payment.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ payment.credits_purchased.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="payment.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    v-if="payment.invoice_pdf"
                    @click="downloadInvoice(payment.id)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    :title="$t('settings.billing.downloadInvoice')"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SettingsCard>

    <!-- Purchase Modal -->
    <PurchaseCreditsModal
      v-if="showPurchaseModal"
      :packages="creditPackages"
      @close="showPurchaseModal = false"
      @purchase="handlePurchase"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { CreditCard, Receipt, Download } from 'lucide-vue-next'

// Composables
import { useBilling } from '@/composables/settings/useBilling'
import { useDateFormatter } from '@/composables/useDateFormatter'

// Components
import SettingsCard from '@/components/ui/SettingsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import PurchaseCreditsModal from '@/components/settings/billing/PurchaseCreditsModal.vue'

// Types
import type { CreditPackage } from '@/types/settings'

const { t } = useI18n()
const toast = useToast()
const { formatDate } = useDateFormatter()

// Composables
const {
  creditBalance,
  paymentHistory,
  creditPackages,
  billingLoading,
  fetchCreditBalance,
  fetchPaymentHistory,
  fetchCreditPackages,
  purchaseCredits,
  downloadInvoice: downloadInvoiceFile
} = useBilling()

// Local state
const showPurchaseModal = ref(false)

// Methods
const handlePurchase = async (selectedPackage: CreditPackage) => {
  try {
    await purchaseCredits(selectedPackage)
    showPurchaseModal.value = false
    toast.success(t('settings.billing.purchaseInitiated'))
  } catch (error) {
    toast.error(t('settings.billing.purchaseError'))
  }
}

const downloadInvoice = async (paymentId: number) => {
  try {
    await downloadInvoiceFile(paymentId)
    toast.success(t('settings.billing.invoiceDownloaded'))
  } catch (error) {
    toast.error(t('settings.billing.invoiceError'))
  }
}

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchCreditBalance(),
    fetchPaymentHistory(),
    fetchCreditPackages()
  ])
})
</script>