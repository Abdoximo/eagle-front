import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showError } from '@/services/toast'

// API service for Stripe admin operations
const stripeAdminApi = {
  // Credentials
  async getCredentials() {
    return fetch('/api/admin/stripe/credentials').then(res => res.json())
  },
  
  async saveCredentials(data: any) {
    return fetch('/api/admin/stripe/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async testCredentials(data: any) {
    return fetch('/api/admin/stripe/credentials/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async testConnection() {
    return fetch('/api/admin/stripe/connection/test').then(res => res.json())
  },
  
  // Webhooks
  async getWebhooks() {
    return fetch('/api/admin/stripe/webhooks').then(res => res.json())
  },
  
  async createWebhook(data: any) {
    return fetch('/api/admin/stripe/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async updateWebhook(id: string, data: any) {
    return fetch(`/api/admin/stripe/webhooks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async deleteWebhook(id: string) {
    return fetch(`/api/admin/stripe/webhooks/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  async testWebhook(id: string) {
    return fetch(`/api/admin/stripe/webhooks/${id}/test`, {
      method: 'POST'
    }).then(res => res.json())
  },
  
  // Payment Settings
  async getPaymentSettings() {
    return fetch('/api/admin/stripe/payment-settings').then(res => res.json())
  },
  
  async savePaymentSettings(data: any) {
    return fetch('/api/admin/stripe/payment-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  // Billing Plans
  async getBillingPlans() {
    return fetch('/api/admin/stripe/billing-plans').then(res => res.json())
  },
  
  async createBillingPlan(data: any) {
    return fetch('/api/admin/stripe/billing-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async updateBillingPlan(id: string, data: any) {
    return fetch(`/api/admin/stripe/billing-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  async deleteBillingPlan(id: string) {
    return fetch(`/api/admin/stripe/billing-plans/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  // Transactions
  async getTransactions(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return fetch(`/api/admin/stripe/transactions${query}`).then(res => res.json())
  },
  
  async exportTransactions(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return fetch(`/api/admin/stripe/transactions/export${query}`).then(res => res.json())
  },
  
  // Account Info
  async getAccountInfo() {
    return fetch('/api/admin/stripe/account').then(res => res.json())
  }
}

export const useStripeAdminStore = defineStore('stripeAdmin', () => {
  // State
  const loading = ref(false)
  const credentials = ref<any>(null)
  const webhooks = ref<any[]>([])
  const paymentSettings = ref<any>(null)
  const billingPlans = ref<any[]>([])
  const transactions = ref<any[]>([])
  const accountInfo = ref<any>(null)
  const isConnected = ref(false)
  
  // Actions
  const fetchCredentials = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getCredentials()
      credentials.value = response.credentials
      isConnected.value = response.credentials?.connection_status?.connected || false
    } catch (error: any) {
      showError('Failed to fetch credentials')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const saveCredentials = async (data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.saveCredentials(data)
      credentials.value = response.credentials
      isConnected.value = response.credentials?.connection_status?.connected || false
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save credentials'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const testCredentials = async (data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.testCredentials(data)
      
      // Update connection status
      if (credentials.value) {
        credentials.value.connection_status = response.connection_status
      }
      isConnected.value = response.connection_status?.connected || false
      
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Credentials test failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const testConnection = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.testConnection()
      isConnected.value = response.connected || false
      
      if (credentials.value) {
        credentials.value.connection_status = response
      }
      
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Connection test failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const fetchWebhooks = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getWebhooks()
      webhooks.value = response.webhooks || []
    } catch (error: any) {
      showError('Failed to fetch webhooks')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const createWebhook = async (data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.createWebhook(data)
      webhooks.value.push(response.webhook)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create webhook'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const updateWebhook = async (id: string, data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.updateWebhook(id, data)
      const index = webhooks.value.findIndex(w => w.id === id)
      if (index > -1) {
        webhooks.value[index] = response.webhook
      }
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update webhook'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const deleteWebhook = async (id: string) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.deleteWebhook(id)
      const index = webhooks.value.findIndex(w => w.id === id)
      if (index > -1) {
        webhooks.value.splice(index, 1)
      }
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete webhook'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const testWebhook = async (id: string) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.testWebhook(id)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Webhook test failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const fetchPaymentSettings = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getPaymentSettings()
      paymentSettings.value = response.settings
    } catch (error: any) {
      showError('Failed to fetch payment settings')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const savePaymentSettings = async (data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.savePaymentSettings(data)
      paymentSettings.value = response.settings
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save payment settings'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const fetchBillingPlans = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getBillingPlans()
      billingPlans.value = response.plans || []
    } catch (error: any) {
      showError('Failed to fetch billing plans')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const createBillingPlan = async (data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.createBillingPlan(data)
      billingPlans.value.push(response.plan)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create billing plan'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const updateBillingPlan = async (id: string, data: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.updateBillingPlan(id, data)
      const index = billingPlans.value.findIndex(p => p.id === id)
      if (index > -1) {
        billingPlans.value[index] = response.plan
      }
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update billing plan'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const deleteBillingPlan = async (id: string) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.deleteBillingPlan(id)
      const index = billingPlans.value.findIndex(p => p.id === id)
      if (index > -1) {
        billingPlans.value.splice(index, 1)
      }
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete billing plan'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const fetchTransactions = async (params?: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getTransactions(params)
      transactions.value = response.transactions || []
      return response
    } catch (error: any) {
      showError('Failed to fetch transactions')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const exportTransactions = async (params?: any) => {
    try {
      loading.value = true
      const response = await stripeAdminApi.exportTransactions(params)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to export transactions'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const fetchAccountInfo = async () => {
    try {
      loading.value = true
      const response = await stripeAdminApi.getAccountInfo()
      accountInfo.value = response.account
      isConnected.value = response.account?.charges_enabled || false
    } catch (error: any) {
      showError('Failed to fetch account info')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    loading,
    credentials,
    webhooks,
    paymentSettings,
    billingPlans,
    transactions,
    accountInfo,
    isConnected,
    
    // Actions
    fetchCredentials,
    saveCredentials,
    testCredentials,
    testConnection,
    fetchWebhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,
    fetchPaymentSettings,
    savePaymentSettings,
    fetchBillingPlans,
    createBillingPlan,
    updateBillingPlan,
    deleteBillingPlan,
    fetchTransactions,
    exportTransactions,
    fetchAccountInfo
  }
}) 