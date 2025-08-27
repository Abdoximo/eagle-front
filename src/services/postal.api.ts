import { api } from './api'

export interface PostalApiServer {
  id: string
  name: string
  domain: string
  api_key: string
  from_email: string
  from_name?: string
  is_shared: boolean
  is_active: boolean
  priority: number
  daily_limit?: number
  hourly_limit?: number
  emails_sent_today: number
  emails_sent_hour: number
  last_used_at?: string
  webhook_settings: {
    enabled: boolean
    events: string[]
  }
  track_opens: boolean
  track_clicks: boolean
  user_id?: string
  created_at: string
  updated_at: string
}

export interface CreatePostalServerData {
  name: string
  domain: string
  api_key: string
  from_email: string
  from_name?: string
  is_shared?: boolean
  priority?: number
  daily_limit?: number
  hourly_limit?: number
  track_opens?: boolean
  track_clicks?: boolean
  webhook_settings?: {
    enabled: boolean
    events: string[]
  }
  is_active?: boolean
}

export interface UpdatePostalServerData extends Partial<CreatePostalServerData> {
  id: string
}

export interface PostalServerStats {
  total_sent: number
  sent_today: number
  sent_this_hour: number
  daily_limit?: number
  hourly_limit?: number
  daily_remaining?: number
  hourly_remaining?: number
  last_used_at?: string
  is_available: boolean
  success_rate: number
  webhook_configured: boolean
  tracking_enabled: {
    opens: boolean
    clicks: boolean
  }
}

export interface TestConnectionResult {
  success: boolean
  message: string
}

export interface LoadBalancingStats {
  id: string
  name: string
  domain: string
  priority: number
  emails_sent_today: number
  daily_limit?: number
  usage_percentage: number
  is_available: boolean
  last_used_at?: string
  webhook_configured: boolean
}

export const postalApi = {
  // Get all postal servers for the current user
  async getServers(): Promise<PostalApiServer[]> {
    const response = await api.get('/postal-api-servers')
    return response.data || []
  },

  // Get shared postal servers (admin only)
  async getSharedServers(): Promise<LoadBalancingStats[]> {
    const response = await api.get('/postal-api-servers/shared')
    return response.data || []
  },

  // Create a new postal server
  async createServer(data: CreatePostalServerData): Promise<PostalApiServer> {
    const response = await api.post('/postal-api-servers', data)
    return response.data
  },

  // Update an existing postal server
  async updateServer(data: UpdatePostalServerData): Promise<PostalApiServer> {
    const response = await api.put(`/postal-api-servers/${data.id}`, data)
    return response.data
  },

  // Delete a postal server
  async deleteServer(id: string): Promise<void> {
    await api.delete(`/postal-api-servers/${id}`)
  },

  // Test connection to a postal server
  async testConnection(id: string): Promise<TestConnectionResult> {
    const response = await api.post(`/postal-api-servers/${id}/test`)
    return response.data
  },

  // Test connection before creating a server
  async testConnectionBeforeCreate(data: { domain: string; api_key: string }): Promise<TestConnectionResult> {
    const response = await api.post('/postal-api-servers/test-connection', data)
    return response.data
  },

  // Send test email
  async sendTestEmail(id: string, toEmail: string): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await api.post(`/postal-api-servers/${id}/send-test-email`, { to_email: toEmail })
    return response.data
  },



  // Get stats for a postal server
  async getServerStats(id: string): Promise<PostalServerStats> {
    const response = await api.get(`/postal-api-servers/${id}/stats`)
    return response.data
  },

  // Get webhook URL for a postal server
  async getWebhookUrl(id: string): Promise<{ webhook_url: string; is_configured: boolean }> {
    const response = await api.get(`/postal-api-servers/${id}/webhook-url`)
    return response.data
  },

  // Reset counters (admin only)
  async resetCounters(): Promise<void> {
    await api.post('/postal-api-servers/reset-counters')
  }
}
