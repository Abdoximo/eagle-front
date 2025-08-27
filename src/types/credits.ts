import type { Campaign } from '@/types/campaigns';

export interface Credit {
  id: number
  amount: number
  type: 'purchase' | 'usage' | 'bonus' | 'refund'
  description: string
  balance_after: number
  created_at: string
  campaign?: Campaign
  payment?: Payment
}

export interface Payment {
  id: number
  stripe_payment_id: string
  stripe_session_id?: string
  amount: number
  currency: string
  credits_purchased: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  invoice_pdf?: string
  created_at: string
  updated_at: string
}

export interface CreditBalance {
  balance: number
}

export interface CreditPackage {
  credits: number
  price: number
  price_per_credit: number
  popular: boolean
}

export interface PurchaseCreditsData {
  credits: number
  amount: number
}

export interface StripeCheckoutResponse {
  checkout_url: string
  session_id: string
}

export interface CreditTransaction {
  id: number
  user_id: number
  type: string
  credits: number
  description?: string
  created_at: string
  campaign_id?: number
  campaign?: Campaign
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    from: number
    last_page: number
    links: any[]
    path: string
    per_page: number
    to: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}