import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/admin.api'
import { showSuccess, showError } from '@/services/toast'
import type { 
  AdminDashboardData, 
  UserWithStats, 
  UpdateUserData, 
  SystemStats,
  RevenueReport,
  UsageReport,
  CampaignsReport,
  GlobalSettings
} from '@/types/admin'
import type { SmtpServer } from '@/types/smtp'
import type { EmailTemplate } from '@/types/templates'
import { usePagination } from '@/composables/usePagination'

export const useAdminStore = defineStore('admin', () => {
  // State
  const dashboardData = ref<AdminDashboardData | null>(null)
  const users = ref<UserWithStats[]>([])
  const currentUser = ref<UserWithStats | null>(null)
  const smtpServers = ref<SmtpServer[]>([])
  const templates = ref<EmailTemplate[]>([])
  const settings = ref<SystemStats | null>(null)
  const usageReport = ref<UsageReport | null>(null)
  const revenueReport = ref<RevenueReport | null>(null)
  const campaignsReport = ref<CampaignsReport | null>(null)
  const loading = ref(false)
  const usersPagination = usePagination()
  const templatesPagination = usePagination()

  // Getters
  const totalUsers = computed(() => dashboardData.value?.stats.total_users || 0)
  const activeUsers = computed(() => dashboardData.value?.stats.active_users || 0)
  const totalRevenue = computed(() => dashboardData.value?.stats.total_revenue || 0)
  const revenueThisMonth = computed(() => dashboardData.value?.stats.revenue_this_month || 0)
  const adminUsers = computed(() => (users.value || []).filter(u => u.role === 'admin'))
  const regularUsers = computed(() => (users.value || []).filter(u => u.role === 'user'))
  const marketerUsers = computed(() => (users.value || []).filter(u => u.role === 'marketer'))
  const bannedUsers = computed(() => (users.value || []).filter(u => !u.is_active))

  // Actions
  const ensureInitialized = () => {
    if (!users.value) users.value = []
    if (!smtpServers.value) smtpServers.value = []
    if (!templates.value) templates.value = []
  }

  const fetchDashboard = async () => {
    try {
      loading.value = true
      const response = await adminApi.getDashboard()
      dashboardData.value = response
    } catch (error: any) {
      showError('Failed to load dashboard data')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async (params?: { page?: number; search?: string; role?: string; status?: string }) => {
    try {
      loading.value = true
      const response = await adminApi.getUsers(params)
      
      // Handle actual backend response format: { users: [...], pagination: {...} }
      users.value = (response as any)?.users || (response as any)?.data || []
      usersPagination.updateMeta(response.pagination)
    } catch (error: any) {
      showError('Failed to load users')
      // Ensure users is always an array even on error
      if (!users.value) {
        users.value = []
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id: number) => {
    try {
      loading.value = true
      const response = await adminApi.getUserDetails(id)
      currentUser.value = response.data
      return response
    } catch (error: any) {
      showError('Failed to load user details')
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: UpdateUserData) => {
    try {
      loading.value = true
      const response = await adminApi.updateUser(id, data)
      
      const index = users.value.findIndex(u => u.id === id)
      if (index > -1) {
        users.value[index] = response.data
      }
      
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
      }
      
      showSuccess(response.message)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: string
    status: string
    credits: number
  }) => {
    try {
      loading.value = true
      ensureInitialized() // Ensure arrays are initialized
      
      const response = await adminApi.createUser(userData)

      
      // Handle both possible response formats from backend
      const user = (response as any)?.data || (response as any)?.user || response
      
      // Add new user to the list
      users.value.unshift(user)
      
      showSuccess(response.message || 'User created successfully')
      return user
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const enableUser = async (id: number) => {
    try {
      loading.value = true
      const response = await adminApi.enableUser(id)
      
      const user = users.value.find(u => u.id === id)
      if (user) {
        user.status = 'active'
      }
      
      showSuccess(response.message || 'User enabled successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to enable user'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const disableUser = async (id: number) => {
    try {
      loading.value = true
      const response = await adminApi.disableUser(id)
      
      const user = users.value.find(u => u.id === id)
      if (user) {
        user.status = 'disabled'
      }
      
      showSuccess(response.message || 'User disabled successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to disable user'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const addUserCredits = async (id: number, data: { amount: number; reason: string }) => {
    try {
      loading.value = true
      const response = await adminApi.addUserCredits(id, data)
      
      const user = users.value.find(u => u.id === id)
      if (user) {
        user.credits = response.new_balance
      }
      
      showSuccess(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add credits'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const bulkUserAction = async (action: string, userIds: number[]) => {
    try {
      loading.value = true
      const response = await adminApi.bulkUserAction(action, userIds)
      
      // Update users in the list based on action
      userIds.forEach(id => {
        const user = users.value.find(u => u.id === id)
        if (user) {
          switch (action) {
            case 'enable':
              user.status = 'active'
              break
            case 'disable':
              user.status = 'disabled'
              break
            case 'delete':
              users.value = users.value.filter(u => u.id !== id)
              break
          }
        }
      })
      
      showSuccess(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to perform bulk action'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const exportUsers = async () => {
    try {
      loading.value = true
      const response = await adminApi.exportUsers()
      
      // Create download link
      const blob = new Blob([response], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      showSuccess('Users exported successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to export users'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const banUser = async (id: number) => {
    return disableUser(id) // Alias for backward compatibility
  }

  const unbanUser = async (id: number) => {
    return enableUser(id) // Alias for backward compatibility
  }

  const addCredits = async (id: number, amount: number, reason: string) => {
    return addUserCredits(id, { amount, reason }) // Alias for backward compatibility
  }

  const fetchAdminSmtpServers = async () => {
    try {
      loading.value = true
      const response = await adminApi.getAdminSmtpServers()
      smtpServers.value = response.smtp_servers
    } catch (error: any) {
      showError('Failed to load SMTP servers')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchAdminTemplates = async (params?: { page?: number; search?: string; type?: string }) => {
    try {
      loading.value = true
      const response = await adminApi.getAdminTemplates(params)
      templates.value = response.data
      templatesPagination.updateMeta(response.pagination)
    } catch (error: any) {
      showError('Failed to load templates')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await adminApi.getSettings()
      settings.value = response.settings
    } catch (error: any) {
      showError('Failed to load settings')
      throw error
    }
  }

  const updateSettings = async (data: Partial<SystemStats>) => {
    try {
      loading.value = true
      const response = await adminApi.updateSettings(data)
      settings.value = response.settings
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update settings'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUsageReport = async (period = '30d') => {
    try {
      loading.value = true
      const response = await adminApi.getUsageReport({ period })
      usageReport.value = response.report
    } catch (error: any) {
      showError('Failed to load usage report')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchRevenueReport = async (period = '30d') => {
    try {
      loading.value = true
      const response = await adminApi.getRevenueReport({ period })
      revenueReport.value = response.report
    } catch (error: any) {
      showError('Failed to load revenue report')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCampaignsReport = async (period = '30d') => {
    try {
      loading.value = true
      const response = await adminApi.getCampaignsReport({ period })
      campaignsReport.value = response.report
    } catch (error: any) {
      showError('Failed to load campaigns report')
      throw error
    } finally {
      loading.value = false
    }
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  return {
    // State
    dashboardData,
    users,
    currentUser,
    smtpServers,
    templates,
    settings,
    usageReport,
    revenueReport,
    campaignsReport,
    loading,
    usersPagination,
    templatesPagination,
    
    // Getters
    totalUsers,
    activeUsers,
    totalRevenue,
    revenueThisMonth,
    adminUsers,
    regularUsers,
    marketerUsers,
    bannedUsers,
    
    // Actions
    ensureInitialized,
    fetchDashboard,
    fetchUsers,
    fetchUser,
    updateUser,
    createUser,
    enableUser,
    disableUser,
    addUserCredits,
    bulkUserAction,
    exportUsers,
    fetchAdminSmtpServers,
    fetchAdminTemplates,
    fetchSettings,
    updateSettings,
    fetchUsageReport,
    fetchRevenueReport,
    fetchCampaignsReport,
    clearCurrentUser,
  }
})