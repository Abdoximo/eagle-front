import { ref, reactive, computed, watch } from 'vue'
import { showSuccess, showError } from '@/services/toast'

export interface FormField {
  value: any
  error: string | null
  rules: Array<(value: any) => string | true>
}

export interface FormOptions {
  resetOnSuccess?: boolean
  showSuccessMessage?: boolean
  showErrorMessage?: boolean
}

export function useForm<T extends Record<string, any>>(
  initialData: T,
  options: FormOptions = {}
) {
  const { resetOnSuccess = false, showSuccessMessage = true, showErrorMessage = true } = options

  const data = reactive<T>({ ...initialData })
  const errors = reactive<Record<keyof T, string | null>>({} as Record<keyof T, string | null>)
  const loading = ref(false)
  const touched = reactive<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  // Watch for data changes and validate fields automatically
  watch(data, (newData, oldData) => {
    Object.keys(newData).forEach(key => {
      const newValue = newData[key as keyof T]
      const oldValue = oldData ? oldData[key as keyof T] : undefined
      
      // If value changed, mark as touched and validate
      if (newValue !== oldValue) {
        touched[key as keyof T] = true
        validateField(key as keyof T)
      }
    })
  }, { deep: true })

  const isValid = computed(() => {
    // Check if there are any errors
    const hasNoErrors = Object.values(errors).every(error => !error)
    
    // Check if all required fields are filled
    const hasRequiredFields = Object.entries(data).every(([key, value]) => {
      // Skip optional fields
      if (key === 'is_admin') return true
      
      // Handle boolean fields (like terms checkbox)
      if (typeof value === 'boolean') {
        return key === 'terms' ? value === true : true
      }
      
      // Handle string fields - must be non-empty
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      
      // For other types, just check if they exist
      return value != null && value !== ''
    })
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('Form validation:', {
        data: { ...data },
        errors: { ...errors },
        hasNoErrors,
        hasRequiredFields,
        isValid: hasNoErrors && hasRequiredFields
      })
    }
    
    return hasNoErrors && hasRequiredFields
  })

  const hasErrors = computed(() => {
    return Object.values(errors).some(error => !!error)
  })

  // Set field value
  const setField = (field: keyof T, value: any) => {
    data[field] = value
    touched[field] = true
    validateField(field)
  }

  // Set errors from API response
  const setErrors = (apiErrors: Record<string, string[]>) => {
    // Clear existing errors
    Object.keys(errors).forEach(key => {
      errors[key as keyof T] = null
    })

    // Set new errors
    Object.entries(apiErrors).forEach(([field, messages]) => {
      if (field in errors) {
        errors[field as keyof T] = messages[0] || null
      }
    })
  }

  // Validate single field
  const validateField = (field: keyof T) => {
    errors[field] = null
    
    const value = data[field]
    
    // Basic validation for common registration fields
    if (field === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        errors[field] = 'Please enter a valid email address'
      }
    }
    
    if (field === 'password' && typeof value === 'string') {
      if (value && value.length < 6) {
        errors[field] = 'Password must be at least 6 characters'
      }
    }
    
    if (field === 'password_confirmation' && typeof value === 'string') {
      const password = data['password' as keyof T]
      if (value && value !== password) {
        errors[field] = 'Passwords do not match'
      }
    }
    
    if (field === 'name' && typeof value === 'string') {
      if (value && value.trim().length < 2) {
        errors[field] = 'Name must be at least 2 characters'
      }
    }
  }

  // Validate all fields
  const validateAll = () => {
    Object.keys(data).forEach(field => {
      validateField(field as keyof T)
      touched[field as keyof T] = true
    })
    return isValid.value
  }

  // Clear errors
  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key as keyof T] = null
    })
  }

  // Reset form
  const reset = () => {
    Object.assign(data, initialData)
    clearErrors()
    Object.keys(touched).forEach(key => {
      touched[key as keyof T] = false
    })
  }

  // Submit form
  const submit = async (
    submitFn: (data: T) => Promise<any>,
    successMessage?: string,
    errorMessage?: string
  ) => {
    if (!validateAll()) {
      return null
    }

    try {
      loading.value = true
      const result = await submitFn(data)
      
      if (showSuccessMessage && successMessage) {
        showSuccess(successMessage)
      }

      if (resetOnSuccess) {
        reset()
      }

      return result
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else if (showErrorMessage) {
        const message = error.response?.data?.message || errorMessage || 'An error occurred'
        showError(message)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    errors,
    loading,
    touched,
    isValid,
    hasErrors,
    setField,
    setErrors,
    validateField,
    validateAll,
    clearErrors,
    reset,
    submit,
  }
}