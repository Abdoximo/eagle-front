import api from './api'
import type {
  AdminDashboardData,
  AdminStats,
  UserWithStats,
  UpdateUserData,
  AddCreditsData,
  GlobalSettings,
  UsageReport,
  RevenueReport,
  CampaignsReport,
  PaginatedResponse,
} from '@/types/admin'
import type { SmtpServer, CreateSmtpServerData, UpdateSmtpServerData } from '@/types/smtp'
import type { EmailTemplate, CreateTemplateData, UpdateTemplateData } from '@/types/templates'

export const adminApi = {
  // Dashboard
  async getDashboard(): Promise<AdminDashboardData> {
    return api.get('/admin/dashboard')
  },

  async getStats(params?: { period?: string }): Promise<{ stats: AdminStats }> {
    return api.get('/admin/stats', { params })
  },

  // User management
  async getUsers(params?: {
    page?: number
    search?: string
    role?: string
    status?: string
  }): Promise<{ users: UserWithStats[]; pagination: any }> {
    return api.get('/admin/users', { params })
  },

  async getUserDetails(id: number): Promise<{ data: UserWithStats; stats: any }> {
    return api.get(`/admin/users/${id}`)
  },

  async updateUser(id: number, data: UpdateUserData): Promise<{ message: string; data: UserWithStats }> {
    return api.put(`/admin/users/${id}`, data)
  },

  async createUser(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: string
    status: string
    credits: number
  }): Promise<{ message: string; data: UserWithStats }> {
    return api.post('/admin/users', data)
  },

  async enableUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/enable`)
  },

  async disableUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/disable`)
  },

  async bulkUserAction(action: string, userIds: number[]): Promise<{ message: string }> {
    return api.post('/admin/users/bulk-action', { action, user_ids: userIds })
  },

  async addUserCredits(id: number, data: { amount: number; reason: string }): Promise<{ message: string; new_balance: number }> {
    return api.post(`/admin/users/${id}/credits`, data)
  },

  async exportUsers(): Promise<string> {
    return api.get('/admin/users/export', { responseType: 'text' })
  },

  async banUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/ban`)
  },

  async unbanUser(id: number): Promise<{ message: string }> {
    return api.post(`/admin/users/${id}/unban`)
  },

  async addCredits(id: number, data: AddCreditsData): Promise<{ message: string; new_balance: number }> {
    return api.post(`/admin/users/${id}/credits`, data)
  },

  // SMTP management
  async getAdminSmtpServers(): Promise<{ smtp_servers: SmtpServer[]; load_balancing_stats: any[] }> {
    return api.get('/admin/smtp-servers')
  },

  async createAdminSmtpServer(data: CreateSmtpServerData): Promise<{ message: string; smtp_server: SmtpServer }> {
    return api.post('/admin/smtp-servers', data)
  },

  async updateAdminSmtpServer(id: number, data: UpdateSmtpServerData): Promise<{ message: string; smtp_server: SmtpServer }> {
    return api.put(`/admin/smtp-servers/${id}`, data)
  },

  async deleteAdminSmtpServer(id: number): Promise<{ message: string }> {
    return api.delete(`/admin/smtp-servers/${id}`)
  },

  // Template management
  async getAdminTemplates(params?: {
    page?: number
    search?: string
    type?: string
  }): Promise<PaginatedResponse<EmailTemplate>> {
    return api.get('/admin/templates', { params })
  },

  async createAdminTemplate(data: CreateTemplateData): Promise<{ message: string; template: EmailTemplate }> {
    return api.post('/admin/templates', data)
  },

  async updateAdminTemplate(id: number, data: UpdateTemplateData): Promise<{ message: string; template: EmailTemplate }> {
    return api.put(`/admin/templates/${id}`, data)
  },

  async deleteAdminTemplate(id: number): Promise<{ message: string }> {
    return api.delete(`/admin/templates/${id}`)
  },

  // Settings
  async getSettings(): Promise<{ settings: GlobalSettings }> {
    return api.get('/admin/settings')
  },

  async updateSettings(data: Partial<GlobalSettings>): Promise<{ message: string; settings: GlobalSettings }> {
    return api.put('/admin/settings', data)
  },

  // Reports
  async getUsageReport(params?: { period?: string }): Promise<{ report: UsageReport }> {
    return api.get('/admin/reports/usage', { params })
  },

  async getRevenueReport(params?: { period?: string }): Promise<{ report: RevenueReport }> {
    return api.get('/admin/reports/revenue', { params })
  },

  async getCampaignsReport(params?: { period?: string }): Promise<{ report: CampaignsReport }> {
    return api.get('/admin/reports/campaigns', { params })
  },
}