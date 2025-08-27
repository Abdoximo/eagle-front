import api from './api'
import type { Template } from '@/types/templates'

export const templateGalleryApi = {
  // Get gallery templates (available for purchase/use)
  async getTemplates(params?: {
    type?: 'free' | 'premium'
    category?: string
    search?: string
  }): Promise<{ templates: Template[] }> {
    return api.get('/gallery/templates', { params })
  },

  // Get user's purchased templates
  async getPurchasedTemplates(): Promise<{ templateIds: number[] }> {
    return api.get('/user/purchased-templates')
  },

  // Purchase a premium template
  async purchaseTemplate(templateId: number): Promise<{ 
    message: string
    transaction: any
    remainingCredits: number 
  }> {
    return api.post(`/gallery/templates/${templateId}/purchase`)
  },

  // Preview template
  async previewTemplate(
    templateId: number, 
    data?: { variables?: Record<string, string> }
  ): Promise<{ html_preview: string; text_preview?: string }> {
    return api.post(`/gallery/templates/${templateId}/preview`, data)
  },

  // Download/use template (returns template content)
  async downloadTemplate(templateId: number): Promise<{ template: Template }> {
    return api.get(`/gallery/templates/${templateId}/download`)
  }
} 