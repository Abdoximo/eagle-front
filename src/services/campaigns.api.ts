import api from './api'
import type {
  Campaign,
  CreateCampaignData,
  UpdateCampaignData,
  CampaignStats,
  EmailLog,
  TestEmailData,
  ScheduleCampaignData,
} from '@/types/campaigns'
import type { PaginatedResponse } from '@/types/common'

export const campaignsApi = {
  // CRUD operations
  async getCampaigns(params?: {
    page?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Campaign>> {
    return api.get('/campaigns', { params })
  },

  async getCampaign(id: number): Promise<{ campaign: Campaign }> {
    return api.get(`/campaigns/${id}`)
  },

  async createCampaign(data: CreateCampaignData): Promise<{ message: string; campaign: Campaign }> {
    return api.post('/campaigns', data)
  },

  async updateCampaign(
    id: number,
    data: UpdateCampaignData
  ): Promise<{ message: string; campaign: Campaign }> {
    return api.put(`/campaigns/${id}`, data)
  },

  async deleteCampaign(id: number): Promise<{ message: string }> {
    return api.delete(`/campaigns/${id}`)
  },

  // Campaign actions
  async sendCampaign(id: number): Promise<{ message: string }> {
    return api.post(`/campaigns/${id}/send`)
  },

  async sendTestEmail(id: number, data: TestEmailData): Promise<{ message: string }> {
    return api.post(`/campaigns/${id}/test`, data)
  },

  async scheduleCampaign(
    id: number,
    data: ScheduleCampaignData
  ): Promise<{ message: string; campaign: Campaign }> {
    return api.post(`/campaigns/${id}/schedule`, data)
  },

  async pauseCampaign(id: number): Promise<{ message: string }> {
    return api.post(`/campaigns/${id}/pause`)
  },

  async resumeCampaign(id: number): Promise<{ message: string }> {
    return api.post(`/campaigns/${id}/resume`)
  },

  async cancelCampaign(id: number): Promise<{ message: string }> {
    return api.post(`/campaigns/${id}/cancel`)
  },

  async duplicateCampaign(id: number): Promise<{ message: string; campaign: Campaign }> {
    return api.post(`/campaigns/${id}/duplicate`)
  },

  // Analytics
  async getCampaignStats(id: number): Promise<{ stats: CampaignStats }> {
    return api.get(`/campaigns/${id}/stats`)
  },

  async getCampaignLogs(
    id: number,
    params?: { page?: number }
  ): Promise<PaginatedResponse<EmailLog>> {
    return api.get(`/campaigns/${id}/logs`, { params })
  },
}