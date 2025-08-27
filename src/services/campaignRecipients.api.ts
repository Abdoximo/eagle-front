import api from './api'
import type { EmailLog } from '@/types/campaigns'

export interface RecipientFilters {
  search?: string
  status?: string
  date_filter?: string
  page?: number
  per_page?: number
}

export interface RecipientsResponse {
  logs: EmailLog[]
  pagination: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface RecipientStats {
  total_recipients: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  complained: number
  unsubscribed: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  bounce_rate: number
}

export const campaignRecipientsApi = {
  // Get campaign recipients with filters
  async getRecipients(campaignId: number, filters?: RecipientFilters): Promise<RecipientsResponse> {
    return api.get(`/campaigns/${campaignId}/logs`, { params: filters })
  },

  // Get recipient statistics for a campaign
  async getRecipientStats(campaignId: number): Promise<RecipientStats> {
    const response = await api.get(`/campaigns/${campaignId}/stats`)
    return response.stats
  },

  // Resend email to a specific recipient
  async resendToRecipient(campaignId: number, emailLogId: number): Promise<{ message: string }> {
    return api.post(`/campaigns/${campaignId}/logs/${emailLogId}/resend`)
  },

  // Export recipients data
  async exportRecipients(campaignId: number, filters?: RecipientFilters): Promise<Blob> {
    const response = await fetch(`/api/campaigns/${campaignId}/logs/export?${new URLSearchParams(filters as any).toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'text/csv'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to export recipients')
    }
    
    return response.blob()
  },

  // Get detailed recipient activity timeline
  async getRecipientTimeline(campaignId: number, emailLogId: number): Promise<any[]> {
    return api.get(`/campaigns/${campaignId}/logs/${emailLogId}/timeline`)
  },

  // Bulk actions on recipients
  async bulkResend(campaignId: number, emailLogIds: number[]): Promise<{ message: string, processed: number }> {
    return api.post(`/campaigns/${campaignId}/logs/bulk-resend`, { email_log_ids: emailLogIds })
  },

  async bulkMarkAs(campaignId: number, emailLogIds: number[], status: string): Promise<{ message: string, processed: number }> {
    return api.post(`/campaigns/${campaignId}/logs/bulk-mark`, { 
      email_log_ids: emailLogIds, 
      status 
    })
  }
}
