export interface Campaign {
  id: number
  name: string
  subject: string
  html_content: string
  text_content?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  scheduled_at?: string
  sent_at?: string
  total_recipients: number
  emails_sent: number
  emails_delivered: number
  emails_bounced: number
  emails_opened: number
  emails_clicked: number
  open_rate: number
  click_rate: number
  bounce_rate: number
  settings?: Record<string, any>
  created_at: string
  updated_at: string
  contact_list?: ContactList
  email_template?: EmailTemplate
  user?: User
}

export interface CreateCampaignData {
  name: string
  subject: string
  contact_list_id: number
  email_template_id?: number
  html_content: string
  text_content?: string
  scheduled_at?: string
  settings?: Record<string, any>
}

export interface UpdateCampaignData {
  name?: string
  subject?: string
  html_content?: string
  text_content?: string
  scheduled_at?: string
  settings?: Record<string, any>
}

export interface CampaignStats {
  total_recipients: number
  emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  emails_bounced: number
  open_rate: number
  click_rate: number
  bounce_rate: number
  delivery_rate: number
}

export interface EmailLog {
  id: number
  email: string
  subject: string
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'opened' | 'clicked' | 'complained' | 'unsubscribed'
  error_message?: string
  message_id?: string
  sent_at?: string
  delivered_at?: string
  opened_at?: string
  clicked_at?: string
  contact?: Contact
  created_at: string
  updated_at?: string
  
  // Enhanced tracking fields
  queued_at?: string
  bounced_at?: string
  complained_at?: string
  first_opened_at?: string
  last_opened_at?: string
  open_count?: number
  first_clicked_at?: string
  last_clicked_at?: string
  click_count?: number
  delivery_response?: any
  user_agent?: string
  ip_address?: string
  location?: string
  device_type?: string
  email_client?: string
  bounce_type?: string
  bounce_reason?: string
  bounce_details?: string
  unsubscribed_at?: string
  unsubscribe_method?: string
  delivery_method?: string
  postal_message_id?: string
  postal_token?: string
  postal_details?: any
  tracking_data?: any
}

export interface TestEmailData {
  test_emails: string[]
}

export interface ScheduleCampaignData {
  scheduled_at: string
}