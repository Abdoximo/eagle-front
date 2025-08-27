import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import type { ProfileFormData } from '@/types/settings'

export function useProfileForm() {
  const settingsStore = useSettingsStore()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const errors = ref<Record<string, string[]>>({})

  // Form validation
  const validateForm = (formData: ProfileFormData): boolean => {
    errors.value = {}
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      errors.value.name = ['Name is required']
      isValid = false
    } else if (formData.name.trim().length < 2) {
      errors.value.name = ['Name must be at least 2 characters']
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.value.email = ['Email is required']
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      errors.value.email = ['Please enter a valid email address']
      isValid = false
    }

    return isValid
  }

  // Update profile
  const updateProfile = async (formData: ProfileFormData) => {
    if (!validateForm(formData)) {
      throw new Error('Validation failed')
    }

    loading.value = true
    try {
      await settingsStore.updateProfile(formData)
      // Update auth store if needed
      authStore.updateUser({
        name: formData.name,
        email: formData.email
      })
    } catch (error: any) {
      // Handle server validation errors
      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  // Initialize form with current user data
  const initializeForm = (): ProfileFormData => {
    const user = authStore.user
    return {
      name: user?.name || '',
      email: user?.email || '',
      settings: {
        timezone: user?.settings?.timezone || 'Europe/Paris',
        language: user?.settings?.language || 'en'
      }
    }
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  return {
    loading,
    errors,
    hasErrors,
    validateForm,
    updateProfile,
    initializeForm
  }
}