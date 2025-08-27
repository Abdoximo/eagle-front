import { BaseApi, ApiResponse } from './api'

export interface SmtpServer {
  id: number
  name: string
  host: string
  port: number
  username: string
  encryption: 'tls' | 'ssl' | 'none'
  is_active: boolean
  priority: number
  daily_limit: number
  hourly_limit: number
  emails_sent_today: number
  emails_sent_hour: number
  last_used_at?: string
  created_at: string
  stats: {
    total_sent: number
    daily_remaining: number
    hourly_remaining: number
    is_available: boolean
    success_rate: number
  }
}

export interface CreateSmtpData {
  name: string
  host: string
  port: number
  username: string
  password: string
  encryption: 'tls' | 'ssl' | 'none'
  priority?: number
  daily_limit?: number
  hourly_limit?: number
}

export class SmtpService extends BaseApi {
  // User SMTP servers
  async getUserSmtpServers(): Promise<{ smtp_servers: SmtpServer[] }> {
    return this.get('/smtp-servers')
  }

  async createUserSmtpServer(data: CreateSmtpData): Promise<{ smtp_server: SmtpServer; message: string }> {
    return this.post('/smtp-servers', data)
  }

  async updateUserSmtpServer(id: number, data: Partial<CreateSmtpData>): Promise<{ smtp_server: SmtpServer; message: string }> {
    return this.put(`/smtp-servers/${id}`, data)
  }

  async deleteUserSmtpServer(id: number): Promise<ApiResponse> {
    return this.delete(`/smtp-servers/${id}`)
  }

  async testSmtpConnection(id: number): Promise<{ success: boolean; message: string }> {
    return this.post(`/smtp-servers/${id}/test`)
  }

  async getSharedServers(): Promise<{ shared_servers: SmtpServer[] }> {
    return this.get('/smtp-servers/shared')
  }

  // Admin SMTP management
  async getAdminSmtpServers(): Promise<{ 
    smtp_servers: SmtpServer[]
    load_balancing_stats: Array<{
      id: number
      name: string
      host: string
      priority: number
      emails_sent_today: number
      daily_limit: number
      usage_percentage: number
      is_available: boolean
      last_used_at?: string
    }>
  }> {
    return this.get('/admin/smtp-servers')
  }

  async createAdminSmtpServer(data: CreateSmtpData): Promise<{ smtp_server: SmtpServer; message: string }> {
    return this.post('/admin/smtp-servers', data)
  }

  async updateAdminSmtpServer(id: number, data: Partial<CreateSmtpData>): Promise<{ smtp_server: SmtpServer; message: string }> {
    return this.put(`/admin/smtp-servers/${id}`, data)
  }

  async deleteAdminSmtpServer(id: number): Promise<ApiResponse> {
    return this.delete(`/admin/smtp-servers/${id}`)
  }
}

export const smtpService = new SmtpService()