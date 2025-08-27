<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Billing & Credits</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your credits and billing history</p>
          </div>
          <div class="flex items-center space-x-3">
            <button 
              @click="showPurchaseModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard class="w-4 h-4 mr-2 inline" />
              Buy Credits
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Current Balance -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">Current Balance</h2>
            <p class="text-blue-100">Available credits for campaigns and templates</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold">{{ formatNumber(userCredits) }}</div>
            <div class="text-blue-100">Credits</div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TrendingUp class="w-8 h-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Credits Purchased</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.credits_purchased) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TrendingDown class="w-8 h-8 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Credits Used</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.credits_used) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSign class="w-8 h-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatNumber(stats.total_spent) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Packages -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Credit Packages</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Purchase credits for campaigns and premium templates</p>
        </div>
        <div class="p-6">
          <div v-if="packages.length === 0" class="text-center py-8">
            <CreditCard class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">No credit packages available</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="pkg in packages" :key="pkg.id" 
                 class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                 @click="showPurchaseModal = true">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ formatNumber(pkg.credits) }} Credits
                </div>
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  ${{ pkg.price }}
                </div>
                <div v-if="pkg.bonus > 0" class="text-sm text-green-600 dark:text-green-400 mb-3">
                  +{{ pkg.bonus }} Bonus Credits
                </div>
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Credit Transactions -->
          <div v-if="activeTab === 'transactions'" class="space-y-4">
            <div v-if="transactions.length === 0" class="text-center py-8">
              <History class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
            
            <div v-for="transaction in transactions" :key="transaction.id" 
                 class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div class="flex items-center space-x-4">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                ]">
                  <component :is="transaction.amount > 0 ? Plus : Minus" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p :class="[
                  'font-bold',
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ transaction.amount > 0 ? '+' : '' }}{{ formatNumber(transaction.amount) }} credits
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Balance: {{ formatNumber(transaction.balance_after) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Invoices -->
          <div v-if="activeTab === 'invoices'" class="space-y-4">
            <div v-if="invoices.length === 0" class="text-center py-8">
              <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No invoices found</p>
            </div>
            
            <div v-for="invoice in invoices" :key="invoice.id" 
                 class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <FileText class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ invoice.invoice_number }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ getInvoiceTypeLabel(invoice.type) }}</p>
                  <p class="text-xs text-gray-400">{{ formatDate(invoice.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900 dark:text-white">${{ formatNumber(invoice.total_amount) }}</p>
                <StatusBadge :status="invoice.status" />
                <div class="mt-2">
                  <button 
                    @click="downloadInvoice(invoice)"
                    class="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Download class="w-4 h-4 mr-1 inline" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Credits Modal -->
    <PurchaseCreditsModal
      v-if="showPurchaseModal"
      @close="showPurchaseModal = false"
      @purchased="handleCreditsPurchased"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  CreditCard, TrendingUp, TrendingDown, DollarSign, History, 
  FileText, Plus, Minus, Download
} from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import PurchaseCreditsModal from '@/components/billing/PurchaseCreditsModal.vue'
import { useAuthStore } from '@/stores/auth'
import { creditsApi } from '@/services/credits.api'
import { billingAPI } from '@/services/billing.api'
import { showSuccess, showError } from '@/services/toast'

const authStore = useAuthStore()

const showPurchaseModal = ref(false)
const activeTab = ref('transactions')
const loading = ref(false)

const stats = ref({
  credits_purchased: 0,
  credits_used: 0,
  total_spent: 0
})

const transactions = ref([])
const invoices = ref([])
const packages = ref([])

const tabs = [
  { id: 'transactions', name: 'Transactions', icon: History },
  { id: 'invoices', name: 'Invoices', icon: FileText }
]

const userCredits = computed(() => authStore.userCredits || 0)

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num || 0)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInvoiceTypeLabel = (type: string): string => {
  const labels = {
    'credit_purchase': 'Credit Purchase',
    'template_purchase': 'Template Purchase',
    'campaign_cost': 'Campaign Cost',
    'subscription': 'Subscription'
  }
  return labels[type] || type
}

const loadBillingData = async () => {
  loading.value = true
  try {
    // Load credit history, balance, and packages using the working API
    const [historyData, balanceData, packagesData] = await Promise.all([
      creditsApi.getCreditHistory(),
      creditsApi.getCreditBalance(),
      creditsApi.getCreditPackages()
    ])
    
    // Process transactions
    transactions.value = historyData.credit_history || []
    
    // Calculate stats from the actual data
    const creditTransactions = transactions.value
    const purchaseCredits = creditTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const usedCredits = creditTransactions
      .filter(t => ['template_purchase', 'campaign_cost', 'usage'].includes(t.type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    stats.value = {
      credits_purchased: purchaseCredits,
      credits_used: usedCredits,
      total_spent: 0 // We'll calculate this from invoices later
    }
    
    // Set packages
    packages.value = packagesData.packages || []
    
    // For now, keep invoices empty - we can add this later if needed
    invoices.value = []
    
  } catch (error) {
    console.error('Failed to load billing data:', error)
    showError('Failed to load billing data')
  } finally {
    loading.value = false
  }
}

const handleCreditsPurchased = async (purchaseData: any) => {
  showPurchaseModal.value = false
  showSuccess(`Successfully purchased ${purchaseData.credits} credits!`)
  await Promise.all([
    authStore.refreshUser(),
    loadBillingData()
  ])
}

const downloadInvoice = async (invoice: any) => {
  try {
    const blob = await billingAPI.downloadInvoice(invoice.id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.invoice_number}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download invoice:', error)
    showError('Failed to download invoice')
  }
}

onMounted(() => {
  loadBillingData()
})
</script>
