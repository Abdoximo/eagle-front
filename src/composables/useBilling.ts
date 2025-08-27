import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { CreditBalance, PaymentRecord, CreditPackage } from '@/types/settings'

export function useBilling() {
  const settingsStore = useSettingsStore()
  
  // Local state
  const error = ref<string | null>(null)

  // Computed properties from store
  const creditBalance = computed(() => settingsStore.creditBalance)
  const paymentHistory = computed(() => settingsStore.paymentHistory)
  const creditPackages = computed(() => settingsStore.creditPackages)
  const billingLoading = computed(() => settingsStore.billingLoading)

  // Derived computeds
  const hasCredits = computed(() => (creditBalance.value?.current || 0) > 0)
  const creditUsagePercentage = computed(() => {
    const balance = creditBalance.value
    if (!balance || balance.total_purchased === 0) return 0
    return Math.round((balance.total_used / balance.total_purchased) * 100)
  })

  // Methods
  const fetchCreditBalance = async () => {
    try {
      error.value = null
      await settingsStore.fetchCreditBalance()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch credit balance'
      throw err
    }
  }

  const fetchPaymentHistory = async (page: number = 1) => {
    try {
      error.value = null
      await settingsStore.fetchPaymentHistory()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch payment history'
      throw err
    }
  }

  const fetchCreditPackages = async () => {
    try {
      error.value = null
      await settingsStore.fetchCreditPackages()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch credit packages'
      throw err
    }
  }

  const purchaseCredits = async (packageData: CreditPackage) => {
    try {
      error.value = null
      await settingsStore.purchaseCredits(packageData)
    } catch (err: any) {
      error.value = err.message || 'Failed to initiate purchase'
      throw err
    }
  }

  const downloadInvoice = async (paymentId: number) => {
    try {
      error.value = null
      await settingsStore.downloadInvoice(paymentId)
    } catch (err: any) {
      error.value = err.message || 'Failed to download invoice'
      throw err
    }
  }

  // Utility functions
  const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const getPaymentStatusColor = (status: string): string => {
    const colors = {
      completed: 'green',
      pending: 'yellow',
      failed: 'red',
      refunded: 'gray'
    }
    return colors[status as keyof typeof colors] || 'gray'
  }

  const calculateSavings = (packageData: CreditPackage, basePackage?: CreditPackage): number => {
    if (!basePackage) return 0
    const currentRate = packageData.price / packageData.credits
    const baseRate = basePackage.price / basePackage.credits
    return Math.round(((baseRate - currentRate) / baseRate) * 100)
  }

  // Credit usage analytics
  const getCreditUsageStats = () => {
    const balance = creditBalance.value
    if (!balance) return null

    return {
      remaining: balance.current,
      used: balance.total_used,
      purchased: balance.total_purchased,
      usagePercentage: creditUsagePercentage.value,
      remainingPercentage: Math.round((balance.current / balance.total_purchased) * 100)
    }
  }

  // Payment analytics
  const getPaymentStats = () => {
    const payments = paymentHistory.value
    if (!payments.length) return null

    const totalSpent = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalCredits = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.credits_purchased, 0)

    const averageOrder = payments.length > 0 ? totalSpent / payments.length : 0

    return {
      totalSpent,
      totalCredits,
      averageOrder,
      totalTransactions: payments.length,
      successfulTransactions: payments.filter(p => p.status === 'completed').length
    }
  }

  // Recommendations
  const getRecommendedPackage = (): CreditPackage | null => {
    const packages = creditPackages.value
    if (!packages.length) return null

    // Find the package marked as popular
    const popularPackage = packages.find(p => p.popular)
    if (popularPackage) return popularPackage

    // Otherwise return the best value (lowest price per credit)
    return packages.reduce((best, current) => 
      current.price_per_credit < best.price_per_credit ? current : best
    )
  }

  const shouldRecommendUpgrade = (): boolean => {
    const balance = creditBalance.value
    if (!balance) return false

    // Recommend upgrade if less than 10% credits remaining
    const remainingPercentage = (balance.current / balance.total_purchased) * 100
    return remainingPercentage < 10
  }

  // Initialize data
  const initialize = async () => {
    await Promise.allSettled([
      fetchCreditBalance(),
      fetchPaymentHistory(),
      fetchCreditPackages()
    ])
  }

  return {
    // State
    creditBalance,
    paymentHistory,
    creditPackages,
    billingLoading,
    error,

    // Computed
    hasCredits,
    creditUsagePercentage,

    // Methods
    fetchCreditBalance,
    fetchPaymentHistory,
    fetchCreditPackages,
    purchaseCredits,
    downloadInvoice,
    initialize,

    // Utilities
    formatCurrency,
    getPaymentStatusColor,
    calculateSavings,
    getCreditUsageStats,
    getPaymentStats,
    getRecommendedPackage,
    shouldRecommendUpgrade
  }
}

// Specialized hook for credit package selection
export function useCreditPackageSelection() {
  const selectedPackage = ref<CreditPackage | null>(null)
  const showCustomAmount = ref(false)
  const customCredits = ref(0)
  const customPrice = ref(0)

  const selectPackage = (pkg: CreditPackage) => {
    selectedPackage.value = pkg
    showCustomAmount.value = false
  }

  const selectCustomAmount = () => {
    selectedPackage.value = null
    showCustomAmount.value = true
  }

  const getCustomPackage = (): CreditPackage | null => {
    if (!showCustomAmount.value || !customCredits.value || !customPrice.value) {
      return null
    }

    return {
      credits: customCredits.value,
      price: customPrice.value,
      price_per_credit: customPrice.value / customCredits.value,
      popular: false
    }
  }

  const reset = () => {
    selectedPackage.value = null
    showCustomAmount.value = false
    customCredits.value = 0
    customPrice.value = 0
  }

  return {
    selectedPackage,
    showCustomAmount,
    customCredits,
    customPrice,
    selectPackage,
    selectCustomAmount,
    getCustomPackage,
    reset
  }
}