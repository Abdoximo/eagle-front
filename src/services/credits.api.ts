import api from './api'
import type {
  CreditPackage,
  Payment,
  CreditTransaction,
  CreditBalance,
  PaginatedResponse,
} from '@/types/credits'

export const creditsApi = {
  // Credit operations
  async getCreditBalance(): Promise<CreditBalance> {
    return api.get('/credits/balance')
  },

  async getCreditHistory(params?: { page?: number }): Promise<{
    credit_history: CreditTransaction[]
    pagination: {
      current_page: number
      total: number
      per_page: number
    }
  }> {
    return api.get('/credits/history', { params })
  },

  async getCreditPackages(): Promise<{ packages: CreditPackage[] }> {
    return api.get('/credits/packages')
  },

  async purchaseCredits(data: {
    credits: number
    amount: number
  }): Promise<{
    checkout_url: string
    session_id: string
  }> {
    return api.post('/credits/purchase', data)
  },

  // Payment operations
  async getPayments(params?: { page?: number }): Promise<PaginatedResponse<Payment>> {
    return api.get('/payments', { params })
  },

  async getPayment(id: number): Promise<{ payment: Payment }> {
    return api.get(`/payments/${id}`)
  },

  async downloadInvoice(id: number): Promise<void> {
    return api.download(`/payments/${id}/invoice`, `invoice-${id}.pdf`)
  },
}
