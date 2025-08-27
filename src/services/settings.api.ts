import api from './api'
import type { 
  ApiResponse, 
  PaginatedResponse,
  UserSettings,
  AdminSettings,
  SystemStats,
  SmtpServerData,
  CreditPackage,
  PaymentRecord,
  CreditBalance,
  UserPreferences,
  ProfileFormData,
  PasswordFormData
} from '@/types/settings'

export const settingsApi = {
  // Profile Management
  async updateProfile(data: ProfileFormData): Promise<{ user: any }> {
    return api.put('/user/profile', data)
  },

  async updatePassword(data: PasswordFormData): Promise<{ message: string }> {
    return api.put('/user/password', data)
  },

  // User Settings
  async getUserSettings(): Promise<{ settings: UserSettings }> {
    return api.get('/user/settings')
  },

  async updateUserSettings(data: Partial<UserSettings>): Promise<{ settings: UserSettings }> {
    return api.put('/user/settings', data)
  },

  async getUserStats(): Promise<{
    stats: {
      credits: number
      campaigns_count: number
      contacts_count: number
      emails_sent_total: number
      emails_sent_this_month: number
      campaigns_this_month: number
    }
  }> {
    return api.get('/user/stats')
  },

  async getUserActivity(): Promise<{
    credit_history: any[]
    campaign_activity: any[]
  }> {
    return api.get('/user/activity')
  },

  // SMTP Server Management
  async getSmtpServers(): Promise<{ smtp_servers: SmtpServerData[] }> {
    return api.get('/smtp-servers')
  },

  async createSmtpServer(data: Omit<SmtpServerData, 'id'>): Promise<{ 
    message: string
    smtp_server: SmtpServerData 
  }> {
    return api.post('/smtp-servers', data)
  },

  async getSmtpServer(id: number): Promise<{ smtp_server: SmtpServerData }> {
    return api.get(`/smtp-servers/${id}`)
  },

  async updateSmtpServer(id: number, data: Partial<SmtpServerData>): Promise<{ 
    message: string
    smtp_server: SmtpServerData 
  }> {
    return api.put(`/smtp-servers/${id}`, data)
  },

  async deleteSmtpServer(id: number): Promise<{ message: string }> {
    return api.delete(`/smtp-servers/${id}`)
  },

  async testSmtpServer(id: number): Promise<{ 
    success: boolean
    message: string 
  }> {
    return api.post(`/smtp-servers/${id}/test`)
  },

  async testSmtpConnection(serverData: Omit<SmtpServerData, 'id'>): Promise<{ 
    success: boolean
    message: string 
  }> {
    return api.post('/smtp-servers/test-connection', serverData)
  },

  async getSharedSmtpServers(): Promise<{ shared_servers: SmtpServerData[] }> {
    return api.get('/smtp-servers/shared')
  },

  async purchaseCredits(data: { credits: number; amount: number }): Promise<{ 
    checkout_url: string
    session_id: string 
  }> {
    return api.post('/credits/purchase', data)
  },

  async getPayments(params?: { page?: number }): Promise<PaginatedResponse<PaymentRecord>> {
    return api.get('/payments', { params })
  },

  async getPayment(id: number): Promise<{ payment: PaymentRecord }> {
    return api.get(`/payments/${id}`)
  },

  async downloadInvoice(paymentId: number): Promise<Blob> {
    return api.get(`/payments/${paymentId}/invoice`, {
      responseType: 'blob'
    })
  },

  // User Preferences
  async getPreferences(): Promise<{ preferences: UserPreferences }> {
    return api.get('/user/preferences')
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<{ 
    message: string
    preferences: UserPreferences 
  }> {
    return api.put('/user/preferences', data)
  },

  // Import/Export
  async exportSettings(): Promise<Blob> {
    return api.get('/user/settings/export', {
      responseType: 'blob'
    })
  },

  async importSettings(file: File): Promise<{ 
    message: string
    imported: number
    errors: string[] 
  }> {
    const formData = new FormData()
    formData.append('settings_file', file)
    
    return api.post('/user/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Admin Settings (Admin only)
  async getAdminDashboard(): Promise<{
    stats: {
      total_users: number
      active_users: number
      total_campaigns: number
      campaigns_this_month: number
      total_emails_sent: number
      emails_sent_this_month: number
      total_revenue: number
      revenue_this_month: number
      active_smtp_servers: number
      total_templates: number
    }
    daily_stats: Array<{
      date: string
      users_registered: number
      campaigns_created: number
      emails_sent: number
      revenue: number
    }>
  }> {
    return api.get('/admin/dashboard')
  },

  async getAdminStats(params?: { period?: string }): Promise<{
    stats: {
      users: {
        total: number
        new: number
        active: number
      }
      campaigns: {
        total: number
        period: number
        sent: number
        sending: number
      }
      emails: {
        total_sent: number
        period_sent: number
        total_delivered: number
        total_opened: number
        total_clicked: number
        total_bounced: number
      }
      revenue: {
        total: number
        period: number
        pending: number
      }
    }
  }> {
    return api.get('/admin/stats', { params })
  },

  async getAdminUsers(params?: { 
    page?: number
    search?: string
    role?: string
    status?: string 
  }): Promise<PaginatedResponse<any>> {
    return api.get('/admin/users', { params })
  },

  async getAdminUser(id: number): Promise<{
    user: any
    stats: {
      total_campaigns: number
      total_emails_sent: number
      total_contacts: number
      total_spent: number
      credits_purchased: number
      credits_used: number
      last_login: string
    }
  }> {
    return api.get(`/admin/users/${id}`)
  },

  async updateAdminUser(id: number, data: {
    name?: string
    email?: string
    role?: string
    is_active?: boolean
    credits?: number
  }): Promise<{
    message: string
    user: any
  }> {
    return api.put(`/admin/users/${id}`, data)
  },

  async banUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/ban`)
  },

  async unbanUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/unban`)
  },

  async addUserCredits(id: number, data: {
    amount: number
    reason: string
  }): Promise<{
    message: string
    new_balance: number
  }> {
    return api.post(`/admin/users/${id}/credits`, data)
  },

  async getAdminSettings(): Promise<{
    settings: {
      max_contacts_per_list: number
      max_campaigns_per_month: number
      default_credits_new_user: number
      smtp_rate_limit: number
      maintenance_mode: boolean
      registration_enabled: boolean
      credit_packages: CreditPackage[]
    }
  }> {
    return api.get('/admin/settings')
  },

  async updateAdminSettings(data: Partial<AdminSettings>): Promise<{
    message: string
    settings: AdminSettings
  }> {
    return api.put('/admin/settings', data)
  },

  // Admin SMTP Management
  async getAdminSmtpServers(): Promise<{
    smtp_servers: SmtpServerData[]
    load_balancing_stats: Array<{
      id: number
      name: string
      host: string
      priority: number
      emails_sent_today: number
      daily_limit: number
      usage_percentage: number
      is_available: boolean
      last_used_at: string
    }>
  }> {
    return api.get('/admin/smtp-servers')
  },

  async createAdminSmtpServer(data: Omit<SmtpS