export interface SmtpServer {
  id: number
  name: string
  host: string
  port: number
  username: string
  encryption: 'tls' | 'ssl' | 'none'
  is_active: boolean
  is_shared: boolean
  priority: number
  daily_limit?: number
  hourly_limit?: number
  emails_sent_today: number
  emails_sent_hour: number
  last_used_at?: string
  created_at: string
  updated_at: string
  stats?: SmtpStats
}

export interface SmtpStats {
  total_sent: number
  sent_today: number
  sent_this_hour: number
  daily_limit?: number
  hourly_limit?: number
  daily_remaining?: number
  hourly_remaining?: number
  is_available: boolean
  success_rate: number
}

export interface CreateSmtpServerData {
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

export interface UpdateSmtpServerData {
  name?: string
  host?: string
  port?: number
  username?: string
  password?: string
  encryption?: 'tls' | 'ssl' | 'none'
  priority?: number
  daily_limit?: number
  hourly_limit?: number
  is_active?: boolean
}

export interface SmtpTestResult {
  success: boolean
  message: string
}