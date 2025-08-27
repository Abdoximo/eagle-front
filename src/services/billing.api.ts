import api from './api'

export interface BillingStats {
  credits_purchased: number
  credits_used: number
  total_spent: number
}

export interface CreditTransaction {
  id: number
  type: string
  amount: number
  balance_after: number
  description: string
  created_at: string
  metadata?: any
}

export interface Invoice {
  id: number
  invoice_number: string
  type: string
  status: string
  total_amount: number
  currency: string
  line_items: any[]
  created_at: string
  paid_at?: string
}

export interface BillingHistory {
  stats: BillingStats
  transactions: CreditTransaction[]
  invoices: Invoice[]
  current_balance: number
}

export interface PurchaseCreditsData {
  credits: number
  price: number
  bonus?: number
  billing_info: {
    firstName: string
    lastName: string
    email: string
    address?: string
    city?: string
    country?: string
  }
}

class BillingAPI {
  // Get user's billing history and stats
  async getBillingHistory(): Promise<BillingHistory> {
    const response = await api.get('/billing/history')
    return response
  }

  // Purchase credits
  async purchaseCredits(data: PurchaseCreditsData) {
    const response = await api.post('/billing/purchase-credits', data)
    return response
  }

  // Purchase premium template
  async purchaseTemplate(templateId: number) {
    const response = await api.post(`/billing/purchase-template/${templateId}`)
    return response
  }

  // Get invoice details
  async getInvoice(invoiceId: number): Promise<Invoice> {
    const response = await api.get(`/billing/invoices/${invoiceId}`)
    return response
  }

  // Download invoice PDF
  async downloadInvoice(invoiceId: number): Promise<Blob> {
    const response = await api.get(`/billing/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })
    return response
  }

  // Get campaign costs
  async getCampaignCosts(campaignId?: number) {
    const url = campaignId ? `/billing/campaigns/${campaignId}/costs` : '/billing/campaigns/costs'
    const response = await api.get(url)
    return response
  }

  // Get credit packages (for purchase modal)
  async getCreditPackages() {
    const response = await api.get('/billing/credit-packages')
    return response
  }

  // Estimate campaign cost
  async estimateCampaignCost(recipientsCount: number) {
    const response = await api.post('/billing/estimate-campaign-cost', {
      recipients_count: recipientsCount
    })
    return response
  }

  // Add credits (admin only)
  async addCreditsToUser(userId: number, credits: number, reason: string) {
    const response = await api.post('/admin/billing/add-credits', {
      user_id: userId,
      credits,
      reason
    })
    return response
  }

  // Get billing analytics (admin only)
  async getBillingAnalytics(period = '30d') {
    const response = await api.get(`/admin/billing/analytics?period=${period}`)
    return response
  }
}

export const billingAPI = new BillingAPI()
export default billingAPI
