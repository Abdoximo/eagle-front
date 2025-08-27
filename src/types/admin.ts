import type { User } from './auth'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface AdminStats {
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

export interface CreditPackage {
  id: number
  name: string
  credits: number
  price: number
  description?: string
  is_popular?: boolean
  created_at: string
  updated_at: string
}

export interface SystemStats {
  users: {
    total: number
    active: number
    new_today: number
    new_this_week: number
  }
  campaigns: {
    total: number
    sent: number
    pending: number
    draft: number
  }
  emails: {
    sent_today: number
    sent_this_week: number
    sent_this_month: number
    total_sent: number
  }
  revenue: {
    today: number
    this_week: number
    this_month: number
    total: number
  }
  smtp: {
    total_servers: number
    active_servers: number
    usage_today: number
  }
}

// AdminSettings is an alias for GlobalSettings for consistency
export interface AdminSettings extends GlobalSettings {}

export interface DailyStats {
  date: string
  users_registered: number
  campaigns_created: number
  emails_sent: number
  revenue: number
}

export interface AdminDashboardData {
  stats: AdminStats
  daily_stats: DailyStats[]
}

export interface UserWithStats extends User {
  campaigns_count: number
  contacts_count: number
  payments_count: number
  status: 'active' | 'disabled'
  last_login?: string
  avatar?: string
  stats?: {
    total_campaigns: number
    total_emails_sent: number
    total_contacts: number
    total_spent: number
    credits_purchased: number
    credits_used: number
    last_login?: string
  }
  recent_activity?: Array<{
    id: number
    type: string
    description: string
    created_at: string
  }>
  contact_lists_count?: number
  templates_count?: number
  emails_sent?: number
}

export interface UpdateUserData {
  name: string
  email: string
  role: 'user' | 'admin' | 'marketer'
  is_active: boolean
  credits?: number
}

export interface AddCreditsData {
  amount: number
  reason: string
}

export interface GlobalSettings {
  max_contacts_per_list: number
  max_campaigns_per_month: number
  default_credits_new_user: number
  smtp_rate_limit: number
  maintenance_mode: boolean
  registration_enabled: boolean
  credit_packages: CreditPackage[]
}

export interface UsageReport {
  period: string
  start_date: string
  end_date: string
  total_emails_sent: number
  total_campaigns: number
  active_users: number
  top_users: Array<{
    id: number
    name: string
    email: string
    emails_sent: number
  }>
  smtp_usage: Array<{
    name: string
    emails_sent_today: number
    daily_limit?: number
    usage_percentage: number
  }>
}

export interface RevenueReport {
  period: string
  total_revenue: number
  total_transactions: number
  average_transaction: number
  revenue_by_day: Record<string, {
    amount: number
    transactions: number
  }>
  top_customers: Array<{
    id: number
    name: string
    email: string
    total_spent: number
  }>
}

export interface CampaignsReport {
  period: string
  total_campaigns: number
  campaigns_sent: number
  campaigns_sending: number
  campaigns_draft: number
  total_emails_sent: number
  total_emails_delivered: number
  total_emails_opened: number
  total_emails_clicked: number
  total_emails_bounced: number
  overall_delivery_rate: number
  overall_open_rate: number
  overall_click_rate: number
  overall_bounce_rate: number
  campaigns_by_status: Record<string, number>
  daily_campaign_creation: Record<string, number>
}