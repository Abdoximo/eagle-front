import api from './api'

export interface UserTemplate {
  id: number
  name: string
  description: string
  html_content: string
  text_content?: string
  thumbnail?: string
  preview_image?: string
  type: string
  is_global: boolean
  is_premium: boolean
  credit_cost: number
  category?: string
  tags?: string[]
  variables?: string[]
  template_type?: string
  industry?: string
  is_featured: boolean
  rating: string
  usage_count: number
  downloads: number
  views: number
  purchases: number
  allow_modification: boolean
  is_responsive: boolean
  created_at: string
  updated_at: string
  is_purchased: boolean
  can_use: boolean
  can_afford: boolean
  user?: any
}

export interface TemplateResponse {
  templates: UserTemplate[]
  pagination: {
    current_page: number
    total: number
    per_page: number
  }
}

export const userTemplatesApi = {
  // Get user's templates (own + global + purchased)
  async getUserTemplates(params?: { 
    page?: number
    search?: string
    type?: string
    category?: string
  }): Promise<TemplateResponse> {
    return api.get('/templates', { params })
  },

  // Get a specific template
  async getTemplate(id: number): Promise<{ template: UserTemplate }> {
    return api.get(`/templates/${id}`)
  },

  // Create a new template
  async createTemplate(data: {
    name: string
    description?: string
    html_content: string
    text_content?: string
    type?: string
    category?: string
    tags?: string[]
    thumbnail?: string
    is_public?: boolean
  }): Promise<{ template: UserTemplate }> {
    return api.post('/templates', data)
  },

  // Update a template
  async updateTemplate(id: number, data: Partial<UserTemplate>): Promise<{ template: UserTemplate }> {
    return api.put(`/templates/${id}`, data)
  },

  // Delete a template
  async deleteTemplate(id: number): Promise<{ message: string }> {
    return api.delete(`/templates/${id}`)
  },

  // Duplicate a template
  async duplicateTemplate(id: number, name?: string): Promise<{ template: UserTemplate }> {
    return api.post(`/templates/${id}/duplicate`, { name })
  },

  // Preview a template
  async previewTemplate(id: number, data?: any): Promise<{ html: string }> {
    return api.post(`/templates/${id}/preview`, data)
  },

  // Get global templates for gallery
  async getGlobalTemplates(params?: {
    page?: number
    search?: string
    category?: string
    type?: string
    is_premium?: boolean
  }): Promise<TemplateResponse> {
    return api.get('/templates/global', { params })
  },

  // Check if user can use a template
  async canUseTemplate(id: number): Promise<{ can_use: boolean, reason?: string }> {
    return api.get(`/templates/${id}/can-use`)
  }
}
