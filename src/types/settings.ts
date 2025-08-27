// Base Settings Types
export interface SettingsTab {
    id: string
    label: string
    icon: string
    component: string
  }
  
  export interface UserSettings {
    timezone: string
    language: string
    theme: 'light' | 'dark' | 'system'
    notifications: NotificationSettings
  }
  
  export interface NotificationSettings {
    email: boolean
    browser: boolean
    campaigns: boolean
    system: boolean
  }
  
  // Profile Settings
  export interface ProfileFormData {
    name: string
    email: string
    settings: {
      timezone: string
      language: string
    }
  }
  
  export interface ProfileUpdatePayload extends ProfileFormData {
    // Additional fields that might be needed for API
  }
  
  // Password Settings
  export interface PasswordFormData {
    current_password: string
    password: string
    password_confirmation: string
  }
  
  // SMTP Settings
  export interface SmtpServerData {
    id?: number
    name: string
    host: string
    port: number
    username: string
    password: string
    encryption: 'tls' | 'ssl' | ''
    is_active: boolean
    priority: number
    daily_limit?: number
    hourly_limit?: number
    emails_sent_today?: number
    emails_sent_hour?: number
    last_used_at?: string
    created_at?: string
    stats?: SmtpServerStats
  }

  // Postal API Settings
  export interface PostalApiServerData {
    id?: number
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
    emails_sent_today?: number
    emails_sent_hour?: number
    last_used_at?: string
    track_opens: boolean
    track_clicks: boolean
    webhook_settings?: {
      enabled: boolean
      events: string[]
    }
    created_at?: string
    stats?: PostalApiServerStats
  }

  export interface PostalApiServerStats {
    total_sent: number
    daily_remaining?: number
    hourly_remaining?: number
    is_available: boolean
    success_rate: number
    webhook_configured: boolean
    tracking_enabled: {
      opens: boolean
      clicks: boolean
    }
  }

  export interface PostalApiFormData {
    name: string
    domain: string
    api_key: string
    from_email: string
    from_name?: string
    priority: number
    daily_limit?: number
    hourly_limit?: number
    track_opens: boolean
    track_clicks: boolean
    is_shared?: boolean
    webhook_settings?: {
      enabled: boolean
      events: string[]
    }
  }
  
  export interface SmtpServerStats {
    total_sent: number
    daily_remaining: number
    hourly_remaining: number
    is_available: boolean
    success_rate: number
  }
  
  export interface SmtpFormData {
    name: string
    host: string
    port: number
    username: string
    password: string
    encryption: 'tls' | 'ssl' | ''
    priority: number
    daily_limit?: number
    hourly_limit?: number
  }
  
  // Billing Settings
  export interface CreditBalance {
    current: number
    total_purchased: number
    total_used: number
    last_purchase?: PaymentRecord
  }
  
  export interface PaymentRecord {
    id: number
    stripe_payment_id: string
    amount: number
    currency: string
    credits_purchased: number
    status: 'completed' | 'pending' | 'failed'
    invoice_pdf?: string
    created_at: string
  }
  
  export interface CreditPackage {
    credits: number
    price: number
    price_per_credit: number
    popular: boolean
  }
  
  // Admin Settings
  export interface AdminSettings {
    max_contacts_per_list: number
    max_campaigns_per_month: number
    default_credits_new_user: number
    smtp_rate_limit: number
    maintenance_mode: boolean
    registration_enabled: boolean
    credit_packages: CreditPackage[]
  }
  
  export interface SystemStats {
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
  
  // API Response Types
  export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
      current_page: number
      total: number
      per_page: number
      last_page: number
    }
  }
  
  // Form Validation
  export interface ValidationRule {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean | string
  }
  
  export interface FormField {
    name: string
    rules: ValidationRule[]
    value: any
  }
  
  export interface ValidationErrors {
    [fieldName: string]: string[]
  }
  
  // UI Component Props
  export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
  }
  
  export interface FormFieldProps {
    modelValue: string | number
    label: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number'
    required?: boolean
    disabled?: boolean
    error?: string
  }
  
  export interface SettingsCardProps {
    title: string
    subtitle?: string
    loading?: boolean
    actionLabel?: string
  }
  
  // Theme Types
  export type ThemeMode = 'light' | 'dark' | 'system'
  
  export interface ThemeOption {
    value: ThemeMode
    label: string
    icon: string
  }
  
  // Preferences
  export interface UserPreferences {
    theme: ThemeMode
    email_notifications: boolean
    browser_notifications: boolean
    campaign_notifications: boolean
    auto_save: boolean
    compact_mode: boolean
  }
  
  export interface PreferencesFormData extends UserPreferences {
    // Form-specific additions if needed
  }