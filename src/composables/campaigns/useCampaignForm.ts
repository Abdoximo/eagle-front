import { ref, reactive, computed } from 'vue'
import { useCampaignsStore } from '@/stores/campaigns'
import { showSuccess, showError } from '@/services/toast'
import type { CreateCampaignData, UpdateCampaignData } from '@/types/campaigns'

interface CampaignFormData {
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

export function useCampaignForm() {
  const campaignsStore = useCampaignsStore()

  // Form state
  const data = reactive<CampaignFormData>({
    name: '',
    subject: '',
    contact_list_id: null,
    email_template_id: undefined,
    html_content: '',
    text_content: '',
    scheduled_at: undefined
  })

  const errors = ref<FormErrors>({})
  const loading = ref(false)
  const draftCampaignId = ref<number | null>(null) // Track created draft for testing

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!data.name?.trim()) {
      newErrors.name = 'Campaign name is required'
    }

    if (!data.subject?.trim()) {
      newErrors.subject = 'Email subject is required'
    }

    if (!data.contact_list_id) {
      newErrors.contact_list_id = 'Please select a contact list'
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

  // Save as draft
  const saveDraft = async (): Promise<void> => {
    if (!data.name?.trim()) {
      showError('Campaign name is required to save draft')
      return
    }

    if (!data.contact_list_id) {
      showError('Please select a contact list to save draft')
      return
    }

    loading.value = true
    try {
      if (draftCampaignId.value) {
        // Update existing draft
        await campaignsStore.updateCampaign(draftCampaignId.value, {
          name: data.name,
          subject: data.subject,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
      } else {
        // Create new draft
        const campaign = await campaignsStore.createCampaign({
          name: data.name,
          subject: data.subject,
          contact_list_id: data.contact_list_id,
          email_template_id: data.email_template_id,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
        draftCampaignId.value = campaign.id
      }
      
      showSuccess('Campaign saved as draft')
    } catch (error: any) {
      showError(error.message || 'Failed to save draft')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create and send campaign
  const createCampaign = async (): Promise<any> => {
    if (!validateForm()) {
      showError('Please fix the form errors')
      throw new Error('Form validation failed')
    }

    loading.value = true
    try {
      let campaign

      if (draftCampaignId.value) {
        // Update existing draft campaign
        campaign = await campaignsStore.updateCampaign(draftCampaignId.value, {
          name: data.name,
          subject: data.subject,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
      } else {
        // Create new campaign
        campaign = await campaignsStore.createCampaign({
          name: data.name,
          subject: data.subject,
          contact_list_id: data.contact_list_id!,
          email_template_id: data.email_template_id,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
      }

      showSuccess('Campaign created successfully')
      return campaign
    } catch (error: any) {
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
      showError(error.message || 'Failed to create campaign')
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

    if (!data.contact_list_id) {
      showError('Please select a contact list before sending test')
      return
    }

    try {
      loading.value = true
      
      let campaignId = draftCampaignId.value

      // If no draft exists yet, create one
      if (!campaignId) {
        const tempCampaign = await campaignsStore.createCampaign({
          name: data.name || `Draft Campaign ${new Date().toISOString()}`,
          subject: data.subject,
          contact_list_id: data.contact_list_id,
          email_template_id: data.email_template_id,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
        campaignId = tempCampaign.id
        draftCampaignId.value = campaignId
        showSuccess('Campaign saved as draft for testing')
      } else {
        // Update existing draft with current data
        await campaignsStore.updateCampaign(campaignId, {
          name: data.name,
          subject: data.subject,
          html_content: data.html_content,
          text_content: data.text_content,
          scheduled_at: data.scheduled_at
        })
      }

      // Send test email using the campaign
      await campaignsStore.sendTestEmail(campaignId, [email])
      
      showSuccess(`Test email sent to ${email}`)
    } catch (error: any) {
      showError(error.message || 'Failed to send test email')
      throw error
    } finally {
      loading.value = false
    }
  }

  // Reset form
  const resetForm = () => {
    Object.assign(data, {
      name: '',
      subject: '',
      contact_list_id: null,
      email_template_id: undefined,
      html_content: '',
      text_content: '',
      scheduled_at: undefined
    })
    errors.value = {}
    draftCampaignId.value = null
  }

  return {
    form: {
      data,
      errors,
      loading,
      draftCampaignId
    },
    validateForm,
    clearError,
    saveDraft,
    createCampaign,
    sendTestEmail,
    resetForm
  }
}