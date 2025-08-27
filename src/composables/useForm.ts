import { ref, reactive, computed } from 'vue'
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

  const isValid = computed(() => {
    return Object.values(errors).every(error => !error)
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
    // Add custom validation logic here if needed
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