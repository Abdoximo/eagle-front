import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { settingsApi } from '@/services/api/settings'

export interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  industry: string
  website: string
  country: string
  timezone: string
  language: string
  bio: string
}

export interface ValidationErrors {
  [key: string]: string
}

export function useProfileForm() {
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const errors = ref<ValidationErrors>({})

  // Validation rules
  const validateForm = (formData: ProfileFormData): boolean => {
    const newErrors: ValidationErrors = {}
    
    // Required fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Optional field validations
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters'
    }
    
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // Validation helpers
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  // Initialize form with current user data
  const initializeForm = async (): Promise<ProfileFormData> => {
    const user = authStore.user
    
    return {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      jobTitle: user?.job_title || '',
      industry: user?.industry || '',
      website: user?.website || '',
      country: user?.country || '',
      timezone: user?.timezone || 'UTC',
      language: user?.language || 'en',
      bio: user?.bio || ''
    }
  }

  // Update profile
  const updateProfile = async (formData: ProfileFormData) => {
    if (!validateForm(formData)) {
      throw new Error('Form validation failed')
    }

    loading.value = true
    
    try {
      // Prepare data for API
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        job_title: formData.jobTitle,
        industry: formData.industry,
        website: formData.website,
        country: formData.country,
        timezone: formData.timezone,
        language: formData.language,
        bio: formData.bio,
        settings: {
          timezone: formData.timezone,
          language: formData.language
        }
      }

      // Call API
      const response = await settingsApi.updateProfile(updateData)
      
      // Update auth store
      authStore.updateUser(response.data.user)
      
      return response
    } catch (err: any) {
      // Handle server validation errors
      if (err.response?.data?.errors) {
        errors.value = err.response.data.errors
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear errors
  const clearErrors = () => {
    errors.value = {}
  }

  // Get field error
  const getFieldError = (fieldName: string): string => {
    return errors.value[fieldName] || ''
  }

  // Check if form has errors
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  return {
    loading,
    errors,
    hasErrors,
    validateForm,
    initializeForm,
    updateProfile,
    clearErrors,
    getFieldError
  }
}