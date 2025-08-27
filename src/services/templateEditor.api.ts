import api from './api'

export interface TemplateEditorData {
  id?: number
  name: string
  category: string
  subject: string
  html_content: string
  design: any // Unlayer design JSON
  thumbnail?: string
  is_premium?: boolean
  credit_cost?: number
  tags?: string[]
}

export interface TestEmailData {
  html_content: string
  subject: string
  to_email: string
}

export const templateEditorApi = {
  // Create new template
  createTemplate: (data: TemplateEditorData) => {
    return api.post('/templates', data)
  },

  // Update existing template
  updateTemplate: (id: number | string, data: Partial<TemplateEditorData>) => {
    return api.put(`/templates/${id}`, data)
  },

  // Get template for editing
  getTemplate: (id: number | string) => {
    return api.get(`/templates/${id}`)
  },

  // Send test email
  sendTestEmail: (data: TestEmailData) => {
    return api.post('/templates/test-send', data)
  },

  // Generate template thumbnail
  generateThumbnail: (html_content: string) => {
    return api.post('/templates/generate-thumbnail', { html_content })
  },

  // Get template categories
  getCategories: () => {
    return api.get('/templates/categories')
  },

  // Validate template HTML
  validateTemplate: (html_content: string) => {
    return api.post('/templates/validate', { html_content })
  },

  // Import template from URL
  importTemplate: (url: string) => {
    return api.post('/templates/import', { url })
  },

  // Clone existing template
  cloneTemplate: (id: number | string, name?: string) => {
    return api.post(`/templates/${id}/clone`, { name })
  },

  // Get template statistics
  getTemplateStats: (id: number | string) => {
    return api.get(`/templates/${id}/stats`)
  }
}
