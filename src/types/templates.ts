export interface EmailTemplate {
  id: number
  name: string
  description?: string
  html_content: string
  text_content?: string
  thumbnail?: string
  type: 'free' | 'premium'
  price?: number
  is_global: boolean
  is_active?: boolean
  category?: string
  usage_count?: number
  variables?: string[]
  created_at: string
  updated_at: string
  user?: any
  campaigns_count?: number
}

export interface CreateTemplateData {
  name: string
  description?: string
  html_content: string
  text_content?: string
  type?: 'free' | 'premium'
  variables?: string[]
}

export interface UpdateTemplateData {
  name?: string
  description?: string
  html_content?: string
  text_content?: string
  variables?: string[]
}

export interface PreviewTemplateData {
  variables?: Record<string, string>
}

export interface TemplatePreview {
  html_preview: string
  text_preview?: string
}

// Alias for backwards compatibility
export type Template = EmailTemplate