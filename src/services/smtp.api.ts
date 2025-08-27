import api from './api'
import type {
  SmtpServer,
  CreateSmtpServerData,
  UpdateSmtpServerData,
  SmtpTestResult,
} from '@/types/smtp'

export const smtpApi = {
  // SMTP Server CRUD operations
  async getSmtpServers(): Promise<{ smtp_servers: SmtpServer[] }> {
    return api.get('/smtp-servers')
  },

  async getSmtpServer(id: number): Promise<{ smtp_server: SmtpServer }> {
    return api.get(`/smtp-servers/${id}`)
  },

  async createSmtpServer(
    data: CreateSmtpServerData
  ): Promise<{ message: string; smtp_server: SmtpServer }> {
    return api.post('/smtp-servers', data)
  },

  async updateSmtpServer(
    id: number,
    data: UpdateSmtpServerData
  ): Promise<{ message: string; smtp_server: SmtpServer }> {
    return api.put(`/smtp-servers/${id}`, data)
  },

  async deleteSmtpServer(id: number): Promise<{ message: string }> {
    return api.delete(`/smtp-servers/${id}`)
  },

  // SMTP Server actions
  async testSmtpServer(id: number): Promise<SmtpTestResult> {
    return api.post(`/smtp-servers/${id}/test`)
  },

  async getSharedSmtpServers(): Promise<{ shared_servers: SmtpServer[] }> {
    return api.get('/smtp-servers/shared')
  },
}