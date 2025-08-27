import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { templateGalleryApi } from '@/services/templateGallery.api'
import type { Template } from '@/types/templates'

export const useTemplateGalleryStore = defineStore('templateGallery', () => {
  // State
  const templates = ref<Template[]>([])
  const purchasedTemplates = ref<number[]>([])
  const loading = ref(false)

  // Getters
  const freeTemplates = computed(() => templates.value.filter(t => t.type === 'free'))
  const premiumTemplates = computed(() => templates.value.filter(t => t.type === 'premium'))
  const availablePremiumTemplates = computed(() => 
    premiumTemplates.value.filter(t => !purchasedTemplates.value.includes(t.id))
  )

  // Actions
  const fetchTemplates = async (params?: { 
    type?: 'free' | 'premium'
    category?: string
    search?: string 
  }) => {
    try {
      loading.value = true
      const response = await templateGalleryApi.getTemplates(params)
      
      if (response.templates && Array.isArray(response.templates)) {
        templates.value = response.templates
      } else {
        templates.value = []
      }
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchPurchasedTemplates = async () => {
    try {
      const response = await templateGalleryApi.getPurchasedTemplates()
      
      if (response.templateIds && Array.isArray(response.templateIds)) {
        purchasedTemplates.value = response.templateIds
      } else {
        purchasedTemplates.value = []
      }
    } catch (error: any) {
      throw error
    }
  }

  const purchaseTemplate = async (templateId: number) => {
    try {
      loading.value = true
      const response = await templateGalleryApi.purchaseTemplate(templateId)
      
      // Add to purchased templates
      if (!purchasedTemplates.value.includes(templateId)) {
        purchasedTemplates.value.push(templateId)
      }
      
      return response
    } catch (error: any) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const previewTemplate = async (templateId: number, variables?: Record<string, string>) => {
    try {
      const response = await templateGalleryApi.previewTemplate(templateId, { variables })
      return response
    } catch (error: any) {
      throw error
    }
  }

  const downloadTemplate = async (templateId: number) => {
    try {
      const response = await templateGalleryApi.downloadTemplate(templateId)
      return response
    } catch (error: any) {
      throw error
    }
  }

  const isTemplatePurchased = (templateId: number): boolean => {
    return purchasedTemplates.value.includes(templateId)
  }

  const getTemplatePrice = (template: Template): number => {
    return template.price || 5 // Default price 5 credits
  }

  return {
    // State
    templates,
    purchasedTemplates,
    loading,
    
    // Getters
    freeTemplates,
    premiumTemplates,
    availablePremiumTemplates,
    
    // Actions
    fetchTemplates,
    fetchPurchasedTemplates,
    purchaseTemplate,
    previewTemplate,
    downloadTemplate,
    isTemplatePurchased,
    getTemplatePrice,
  }
}) 