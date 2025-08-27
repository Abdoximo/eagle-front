import api from './api'

export interface Template {
  id: number
  name: string
  description: string
  category: string
  is_premium: boolean
  credit_cost: number
  is_active: boolean
  is_featured: boolean
  views: number
  downloads: number
  purchases: number
  rating: number
  preview_image?: string
  html_content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface TemplateStats {
  total_templates: number
  premium_templates: number
  total_downloads: number
  total_revenue: number
}

export interface CreateTemplateData {
  name: string
  description: string
  category: string
  is_premium: boolean
  credit_cost?: number
  is_featured: boolean
  tags: string[]
  html_content: string
  preview_image?: string
}

export interface UpdateTemplateData extends CreateTemplateData {
  is_active: boolean
}

class TemplatesAPI {
  // Get all templates with optional filters
  async getTemplates(params?: {
    search?: string
    category?: string
    status?: string
    type?: string
    page?: number
    per_page?: number
  }) {
    const response = await api.get('/templates', { params })
    return response
  }

  // Get template statistics
  async getStats(): Promise<TemplateStats> {
    const response = await api.get('/templates/stats')
    return response
  }

  // Get single template
  async getTemplate(id: number): Promise<Template> {
    const response = await api.get(`/templates/${id}`)
    return response
  }

  // Create new template
  async createTemplate(data: CreateTemplateData): Promise<Template> {
    const response = await api.post('/templates', data)
    return response
  }

  // Update template
  async updateTemplate(id: number, data: UpdateTemplateData): Promise<Template> {
    const response = await api.put(`/templates/${id}`, data)
    return response
  }

  // Delete template
  async deleteTemplate(id: number): Promise<void> {
    await api.delete(`/templates/${id}`)
  }

  // Toggle template featured status
  async toggleFeatured(id: number): Promise<Template> {
    const response = await api.patch(`/admin/templates/${id}/featured`)
    return response
  }

  // Duplicate template
  async duplicateTemplate(id: number): Promise<Template> {
    const response = await api.post(`/admin/templates/${id}/duplicate`)
    return response
  }

  // Export template
  async exportTemplate(id: number): Promise<Blob> {
    const response = await api.get(`/admin/templates/${id}/export`, {
      responseType: 'blob'
    })
    return response
  }

  // Import template
  async importTemplate(file: File): Promise<Template> {
    const formData = new FormData()
    formData.append('template', file)
    
    const response = await api.post('/admin/templates/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }

  // Get template analytics
  async getTemplateAnalytics(id: number) {
    const response = await api.get(`/admin/templates/${id}/analytics`)
    return response
  }

  // Update template category
  async updateCategory(id: number, category: string): Promise<Template> {
    const response = await api.patch(`/admin/templates/${id}/category`, { category })
    return response
  }
}

export const templatesApi = new TemplatesAPI()
export const templatesAPI = templatesApi // For backward compatibility
export default templatesApi