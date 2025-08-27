import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { templatesApi } from '@/services/templates.api'
import { showSuccess, showError } from '@/services/toast'
import type { EmailTemplate, CreateTemplateData, UpdateTemplateData, TemplatePreview } from '@/types/templates'
import { usePagination } from '@/composables/usePagination'

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates = ref<EmailTemplate[]>([])
  const globalTemplates = ref<EmailTemplate[]>([])
  const currentTemplate = ref<EmailTemplate | null>(null)
  const loading = ref(false)
  const pagination = usePagination()

  // Ensure templates array is always initialized
  const ensureTemplatesArray = () => {
    if (!templates.value || !Array.isArray(templates.value)) {
      templates.value = []
    }
    if (!globalTemplates.value || !Array.isArray(globalTemplates.value)) {
      globalTemplates.value = []
    }
  }

  // Initialize arrays immediately
  ensureTemplatesArray()

  // Getters
  const freeTemplates = computed(() => templates.value.filter(t => t.type === 'free'))
  const premiumTemplates = computed(() => templates.value.filter(t => t.type === 'premium'))
  const userTemplates = computed(() => templates.value.filter(t => !t.is_global))
  const availableTemplates = computed(() => [...templates.value, ...globalTemplates.value])

  // Actions
  const fetchTemplates = async (params?: { page?: number; type?: 'free' | 'premium'; search?: string }) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.getTemplates(params)
      
      // Fix: API response has { templates: [...], pagination: {...} } structure
      if (response.templates && Array.isArray(response.templates)) {
        templates.value = response.templates
      } else {
        templates.value = []
      }
      
      if (response.pagination) {
        pagination.updateMeta(response.pagination)
      }
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchGlobalTemplates = async () => {
    try {
      const response = await templatesApi.getGlobalTemplates()
      globalTemplates.value = response.templates
    } catch (error: any) {
      throw error
    }
  }

  const fetchTemplate = async (id: number) => {
    try {
      loading.value = true
      const response = await templatesApi.getTemplate(id)
      currentTemplate.value = response.template
      return response.template
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (data: CreateTemplateData) => {
    try {
      loading.value = true
      
      // Ensure templates array is properly initialized
      ensureTemplatesArray()
      
      const response = await templatesApi.createTemplate(data)
      
      if (response && response.template) {
        // Ensure templates array exists and is an array before using unshift
        if (!templates.value || !Array.isArray(templates.value)) {
          templates.value = []
        }
        
        
        // Use spread operator instead of unshift for safer array manipulation
        templates.value = [response.template, ...templates.value]
        
        if (response.message) {
          showSuccess(response.message)
        }
        return response.template
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      
      let message = 'Failed to create template'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }
      
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTemplate = async (id: number, data: UpdateTemplateData) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.updateTemplate(id, data)
      
      const index = templates.value.findIndex(t => t.id === id)
      if (index > -1) {
        templates.value[index] = response.template
      }
      
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = response.template
      }
      
      showSuccess(response.message)
      return response.template
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update template'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (id: number) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.deleteTemplate(id)
      
      const index = templates.value.findIndex(t => t.id === id)
      if (index > -1) {
        templates.value.splice(index, 1)
      }
      
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete template'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const duplicateTemplate = async (id: number) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.duplicateTemplate(id)
      
      // Ensure templates array exists and is an array before using unshift
      if (!templates.value || !Array.isArray(templates.value)) {
        templates.value = []
      }
      
      // Use spread operator instead of unshift for safer array manipulation
      templates.value = [response.template, ...templates.value]
      showSuccess(response.message)
      return response.template
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to duplicate template'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const previewTemplate = async (id: number, variables?: Record<string, string>) => {
    try {
      const response = await templatesApi.previewTemplate(id, { variables })
      return response
    } catch (error: any) {
      showError('Failed to preview template')
      throw error
    }
  }

  const clearCurrentTemplate = () => {
    currentTemplate.value = null
  }

  const makeGlobal = async (id: number) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.makeGlobal(id)
      
      const index = templates.value.findIndex(t => t.id === id)
      if (index > -1) {
        templates.value[index] = { ...templates.value[index], is_global: true }
      }
      
      showSuccess(response.message || 'Template made global successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to make template global'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const removeGlobal = async (id: number) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.removeGlobal(id)
      
      const index = templates.value.findIndex(t => t.id === id)
      if (index > -1) {
        templates.value[index] = { ...templates.value[index], is_global: false }
      }
      
      showSuccess(response.message || 'Template removed from global successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove template from global'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const bulkAction = async (action: string, templateIds: number[]) => {
    try {
      loading.value = true
      ensureTemplatesArray()
      const response = await templatesApi.bulkAction(action, templateIds)
      
      // Update local state based on action
      if (action === 'makeGlobal') {
        templateIds.forEach(id => {
          const index = templates.value.findIndex(t => t.id === id)
          if (index > -1) {
            templates.value[index] = { ...templates.value[index], is_global: true }
          }
        })
      } else if (action === 'removeGlobal') {
        templateIds.forEach(id => {
          const index = templates.value.findIndex(t => t.id === id)
          if (index > -1) {
            templates.value[index] = { ...templates.value[index], is_global: false }
          }
        })
      } else if (action === 'delete') {
        templates.value = templates.value.filter(t => !templateIds.includes(t.id))
      }
      
      showSuccess(response.message || 'Bulk action completed successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to perform bulk action'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const importTemplates = async (importData: any) => {
    try {
      loading.value = true
      // In a real app, this would call the API to import templates
      // For now, we'll just simulate the import
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Refresh templates after import
      await fetchTemplates()
      
      return { success: true, imported: 0 }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    templates,
    globalTemplates,
    currentTemplate,
    loading,
    pagination,
    
    // Getters
    freeTemplates,
    premiumTemplates,
    userTemplates,
    availableTemplates,
    
    // Actions
    fetchTemplates,
    fetchGlobalTemplates,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    previewTemplate,
    clearCurrentTemplate,
    makeGlobal,
    removeGlobal,
    bulkAction,
    importTemplates,
  }
})