import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { settingsApi } from '@/services/api/settings'
import type { 
  UserSettings, 
  AdminSettings, 
  SystemStats, 
  CreditPackage,
  SmtpServerData,
  PaymentRecord,
  CreditBalance,
  UserPreferences
} from '@/types/settings'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const userSettings = ref<UserSettings | null>(null)
  const adminSettings = ref<AdminSettings | null>(null)
  const systemStats = ref<SystemStats | null>(null)
  const smtpServers = ref<SmtpServerData[]>([])
  const creditPackages = ref<CreditPackage[]>([])
  const paymentHistory = ref<PaymentRecord[]>([])
  const creditBalance = ref<CreditBalance | null>(null)
  const preferences = ref<UserPreferences | null>(null)
  
  // Loading states
  const loading = ref(false)
  const smtpLoading = ref(false)
  const billingLoading = ref(false)
  const adminLoading = ref(false)

  // Getters
  const isAdmin = computed(() => {
    // This would come from auth store
    return true // placeholder
  })

  const availableSmtpServers = computed(() => {
    return smtpServers.value.filter(server => server.is_active)
  })

  const totalCredits = computed(() => {
    return creditBalance.value?.current || 0
  })

  // Actions

  // User Settings
  async function fetchUserSettings() {
    loading.value = true
    try {
      const response = await settingsApi.getUserSettings()
      userSettings.value = response.data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateUserSettings(settings: Partial<UserSettings>) {
    loading.value = true
    try {
      const response = await settingsApi.updateUserSettings(settings)
      userSettings.value = { ...userSettings.value, ...response.data }
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // Profile Management
  async function updateProfile(profileData: any) {
    loading.value = true
    try {
      const response = await settingsApi.updateProfile(profileData)
      // Update user data in auth store or local state
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePassword(passwordData: any) {
    loading.value = true
    try {
      const response = await settingsApi.updatePassword(passwordData)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // SMTP Management
  async function fetchSmtpServers() {
    smtpLoading.value = true
    try {
      const response = await settingsApi.getSmtpServers()
      smtpServers.value = response.data
    } catch (error) {
      throw error
    } finally {
      smtpLoading.value = false
    }
  }

  async function addSmtpServer(serverData: Omit<SmtpServerData, 'id'>) {
    smtpLoading.value = true
    try {
      const response = await settingsApi.createSmtpServer(serverData)
      smtpServers.value.push(response.data)
      return response
    } catch (error) {
      throw error
    } finally {
      smtpLoading.value = false
    }
  }

  async function updateSmtpServer(id: number, serverData: Partial<SmtpServerData>) {
    smtpLoading.value = true
    try {
      const response = await settingsApi.updateSmtpServer(id, serverData)
      const index = smtpServers.value.findIndex(s => s.id === id)
      if (index !== -1) {
        smtpServers.value[index] = { ...smtpServers.value[index], ...response.data }
      }
      return response
    } catch (error) {
      throw error
    } finally {
      smtpLoading.value = false
    }
  }

  async function deleteSmtpServer(id: number) {
    smtpLoading.value = true
    try {
      await settingsApi.deleteSmtpServer(id)
      smtpServers.value = smtpServers.value.filter(s => s.id !== id)
    } catch (error) {
      throw error
    } finally {
      smtpLoading.value = false
    }
  }

  async function testSmtpServer(id: number) {
    try {
      const response = await settingsApi.testSmtpServer(id)
      return response
    } catch (error) {
      throw error
    }
  }

  // Billing Management
  async function fetchCreditBalance() {
    billingLoading.value = true
    try {
      const response = await settingsApi.getCreditBalance()
      creditBalance.value = response.data
    } catch (error) {
      throw error
    } finally {
      billingLoading.value = false
    }
  }

  async function fetchPaymentHistory() {
    billingLoading.value = true
    try {
      const response = await settingsApi.getPaymentHistory()
      paymentHistory.value = response.data
    } catch (error) {
      throw error
    } finally {
      billingLoading.value = false
    }
  }

  async function purchaseCredits(packageData: CreditPackage) {
    billingLoading.value = true
    try {
      const response = await settingsApi.createStripeSession(packageData)
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url
      return response
    } catch (error) {
      throw error
    } finally {
      billingLoading.value = false
    }
  }

  // Admin Management
  async function fetchAdminSettings() {
    if (!isAdmin.value) return
    
    adminLoading.value = true
    try {
      const response = await settingsApi.getAdminSettings()
      adminSettings.value = response.data
    } catch (error) {
      throw error
    } finally {
      adminLoading.value = false
    }
  }

  async function updateAdminSettings(settings: Partial<AdminSettings>) {
    if (!isAdmin.value) return
    
    adminLoading.value = true
    try {
      const response = await settingsApi.updateAdminSettings(settings)
      adminSettings.value = { ...adminSettings.value, ...response.data }
      return response
    } catch (error) {
      throw error
    } finally {
      adminLoading.value = false
    }
  }

  async function fetchSystemStats() {
    if (!isAdmin.value) return
    
    try {
      const response = await settingsApi.getSystemStats()
      systemStats.value = response.data
    } catch (error) {
      throw error
    }
  }

  async function fetchCreditPackages() {
    try {
      const response = await settingsApi.getCreditPackages()
      creditPackages.value = response.data
    } catch (error) {
      throw error
    }
  }

  async function addCreditPackage(packageData: Omit<CreditPackage, 'id'>) {
    if (!isAdmin.value) return
    
    adminLoading.value = true
    try {
      const response = await settingsApi.createCreditPackage(packageData)
      creditPackages.value.push(response.data)
      return response
    } catch (error) {
      throw error
    } finally {
      adminLoading.value = false
    }
  }

  async function removeCreditPackage(packageId: number) {
    if (!isAdmin.value) return
    
    adminLoading.value = true
    try {
      await settingsApi.deleteCreditPackage(packageId)
      creditPackages.value = creditPackages.value.filter(p => p.credits !== packageId)
    } catch (error) {
      throw error
    } finally {
      adminLoading.value = false
    }
  }

  // Preferences Management
  async function fetchPreferences() {
    try {
      const response = await settingsApi.getPreferences()
      preferences.value = response.data
    } catch (error) {
      throw error
    }
  }

  async function updatePreferences(preferencesData: Partial<UserPreferences>) {
    loading.value = true
    try {
      const response = await settingsApi.updatePreferences(preferencesData)
      preferences.value = { ...preferences.value, ...response.data }
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // Utility Actions
  async function downloadInvoice(paymentId: number) {
    try {
      const response = await settingsApi.downloadInvoice(paymentId)
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${paymentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }

  // Reset functions
  function resetSettings() {
    userSettings.value = null
    adminSettings.value = null
    systemStats.value = null
    smtpServers.value = []
    creditPackages.value = []
    paymentHistory.value = []
    creditBalance.value = null
    preferences.value = null
  }

  return {
    // State
    userSettings,
    adminSettings,
    systemStats,
    smtpServers,
    creditPackages,
    paymentHistory,
    creditBalance,
    preferences,
    
    // Loading states
    loading,
    smtpLoading,
    billingLoading,
    adminLoading,
    
    // Getters
    isAdmin,
    availableSmtpServers,
    totalCredits,
    
    // Actions
    fetchUserSettings,
    updateUserSettings,
    updateProfile,
    updatePassword,
    
    fetchSmtpServers,
    addSmtpServer,
    updateSmtpServer,
    deleteSmtpServer,
    testSmtpServer,
    
    fetchCreditBalance,
    fetchPaymentHistory,
    purchaseCredits,
    downloadInvoice,
    
    fetchAdminSettings,
    updateAdminSettings,
    fetchSystemStats,
    fetchCreditPackages,
    addCreditPackage,
    removeCreditPackage,
    
    fetchPreferences,
    updatePreferences,
    
    resetSettings
  }
})