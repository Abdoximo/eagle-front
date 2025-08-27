import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { creditsApi } from '@/services/credits.api'
import { showSuccess, showError } from '@/services/toast'
import type { Credit, CreditPackage, Payment, CreatePaymentData } from '@/types/credits'
import { useAuthStore } from './auth'
import { usePagination } from '@/composables/usePagination'

export const useCreditsStore = defineStore('credits', () => {
  const authStore = useAuthStore()

  // State
  const balance = ref<CreditBalance | null>(null)
  const creditHistory = ref<Credit[]>([])
  const payments = ref<Payment[]>([])
  const packages = ref<CreditPackage[]>([])
  const loading = ref(false)
  const processingPayment = ref(false)
  const creditPagination = usePagination()
  const paymentPagination = usePagination()

  // Getters
  const currentCredits = computed(() => balance.value?.credits || authStore.userCredits)
  const totalPurchased = computed(() => balance.value?.total_purchased || 0)
  const totalUsed = computed(() => balance.value?.total_used || 0)
  const lastPurchase = computed(() => balance.value?.last_purchase)
  const completedPayments = computed(() => payments.value.filter(p => p.status === 'completed'))
  const pendingPayments = computed(() => payments.value.filter(p => p.status === 'pending'))

  // Actions
  const fetchCreditBalance = async () => {
    try {
      const response = await creditsApi.getCreditBalance()
      balance.value = response
      return response
    } catch (error: any) {
      showError('Failed to load credit balance')
      throw error
    }
  }

  const fetchCreditHistory = async (params?: { page?: number }) => {
    try {
      loading.value = true
      const response = await creditsApi.getCreditHistory(params)
      creditHistory.value = response.credit_history
      creditPagination.updateMeta(response.pagination)
    } catch (error: any) {
      showError('Failed to load credit history')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchPayments = async (params?: { page?: number }) => {
    try {
      loading.value = true
      const response = await creditsApi.getPayments(params)
      payments.value = response.payments
      paymentPagination.updateMeta(response.pagination)
    } catch (error: any) {
      showError('Failed to load payments')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCreditPackages = async () => {
    try {
      const response = await creditsApi.getCreditPackages()
      packages.value = response.packages
    } catch (error: any) {
      showError('Failed to load credit packages')
      throw error
    }
  }

  const purchaseCredits = async (credits: number, amount: number) => {
    try {
      processingPayment.value = true
      const response = await creditsApi.purchaseCredits({ credits, amount })
      
      // Redirect to Stripe checkout
      window.location.href = response.checkout_url
      
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process payment'
      showError(message)
      throw error
    } finally {
      processingPayment.value = false
    }
  }

  const downloadInvoice = async (paymentId: number) => {
    try {
      await creditsApi.downloadInvoice(paymentId)
      showSuccess('Invoice downloaded')
    } catch (error: any) {
      showError('Failed to download invoice')
      throw error
    }
  }

  const updateCreditsFromPayment = (newCredits: number) => {
    authStore.updateCredits(newCredits)
    if (balance.value) {
      balance.value.credits = newCredits
    }
  }

  const deductCredits = (amount: number) => {
    const# Vue.js Frontend - Pinia Stores

## 🗄️ Stores Pinia

### src/stores/auth.ts

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/auth.api'
import type { User, LoginCredentials, RegisterData, UpdateProfileData, UpdatePasswordData } from '@/types/auth'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMarketer = computed(() => user.value?.role === 'marketer' || isAdmin.value)
  const userCredits = computed(() => user.value?.credits || 0)

  // Actions
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        // Clear invalid stored data
        clearAuth()
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      const response = await authApi.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      toast.success(response.message || 'Login successful')
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    try {
      loading.value = true
      const response = await authApi.register(data)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      toast.success(response.message || 'Registration successful')
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.me()
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      // If refresh fails, logout
      clearAuth()
      router.push('/login')
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      loading.value = true
      const response = await authApi.updateProfile(data)
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
      toast.success(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (data: UpdatePasswordData) => {
    try {
      loading.value = true
      const response = await authApi.updatePassword(data)
      toast.success(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password update failed'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateCredits = (newCredits: number) => {
    if (user.value) {
      user.value.credits = newCredits
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isMarketer,
    userCredits,
    
    // Actions
    initAuth,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    updatePassword,
    updateCredits,
    clearAuth,
  }
})