import { ref, reactive, computed, watch } from 'vue'
import { useCampaignsStore } from '@/stores/campaigns'
import { showSuccess, showError } from '@/services/toast'
import type { Campaign, UpdateCampaignData } from '@/types/campaigns'

interface CampaignEditFormData {
  name: string
  subject: string
  contact_list_id: number | null
  email_template_id?: number
  html_content: string
  text_content: string
  scheduled_at?: string
}

interface FormErrors {
  [key: string]: string
}

export function useCampaignEditForm(campaignId: number) {
  const campaignsStore = useCampaignsStore()

  // Form state
  const data = reactive<UpdateCampaignData>({
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    scheduled_at: undefined
  })

  const errors = ref<FormErrors>({})
  const loading = ref(false)
  const initialized = ref(false)

  // Load existing campaign data
  const loadCampaign = async (): Promise<Campaign | null> => {
    try {
      loading.value = true
      const campaign = await campaignsStore.fetchCampaign(campaignId)
      
      if (campaign) {
        // Populate form with existing data
        Object.assign(data, {
          name: campaign.name || '',
          subject: campaign.subject || '',
          contact_list_id: campaign.contact_list?.id || null,
          email_template_id: campaign.email_template?.id || undefined,
          html_content: campaign.html_content || '',
          text_content: campaign.text_content || '',
          scheduled_at: campaign.scheduled_at || undefined
        })
        initialized.value = true
      }
      
      return campaign
    } catch (error: any) {
      showError(error.message || 'Failed to load campaign')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!data.name?.trim()) {
      newErrors.name = 'Campaign name is required'
    }

    if (!data.subject?.trim()) {
      newErrors.subject = 'Email subject is required'
    }

    if (!data.html_content?.trim()) {
      newErrors.html_content = 'Email content is required'
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // Clear specific error
  const clearError = (field: string) => {
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  // Update campaign
  const updateCampaign = async (): Promise<Campaign> => {
    if (!validateForm()) {
      showError('Please fix the form errors')
      throw new Error('Form validation failed')
    }

    loading.value = true
    try {
      const updateData: UpdateCampaignData = {
        name: data.name,
        subject: data.subject,
        html_content: data.html_content,
        text_content: data.text_content,
        scheduled_at: data.scheduled_at
      }

      const campaign = await campaignsStore.updateCampaign(campaignId, updateData)
      showSuccess('Campaign updated successfully')
      return campaign
    } catch (error: any) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
      showError(error.message || 'Failed to update campaign')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Save as draft
  const saveDraft = async (): Promise<void> => {
    if (!data.name?.trim()) {
      showError('Campaign name is required to save draft')
      return
    }

    loading.value = true
    try {
      const updateData: UpdateCampaignData = {
        name: data.name,
        subject: data.subject,
        html_content: data.html_content,
        text_content: data.text_content,
        scheduled_at: data.scheduled_at
      }

      await campaignsStore.updateCampaign(campaignId, updateData)
      showSuccess('Campaign saved as draft')
    } catch (error: any) {
      showError(error.message || 'Failed to save draft')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Send test email
  const sendTestEmail = async (email: string): Promise<void> => {
    if (!email) {
      showError('Please enter a test email address')
      return
    }

    if (!data.html_content?.trim()) {
      showError('Please add some content before sending test')
      return
    }

    if (!data.subject?.trim()) {
      showError('Please add a subject before sending test')
      return
    }

    try {
      // Send test email using the existing campaign ID
      await campaignsStore.sendTestEmail(campaignId, [email])
      showSuccess(`Test email sent to ${email}`)
    } catch (error: any) {
      showError(error.message || 'Failed to send test email')
      throw error
    }
  }

  return {
    form: {
      data,
      errors,
      loading,
      initialized
    },
    loadCampaign,
    validateForm,
    clearError,
    updateCampaign,
    saveDraft,
    sendTestEmail
  }
} 