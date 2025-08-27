import { useToast } from 'vue-toastification'

// Create a single toast instance
let toastInstance: ReturnType<typeof useToast> | null = null

export const getToast = () => {
  if (!toastInstance) {
    toastInstance = useToast()
  }
  return toastInstance
}

// Export convenience methods
export const showSuccess = (message: string) => {
  const toast = getToast()
  toast.success(message)
}

export const showError = (message: string) => {
  const toast = getToast()
  toast.error(message)
}

export const showWarning = (message: string) => {
  const toast = getToast()
  toast.warning(message)
}

export const showInfo = (message: string) => {
  const toast = getToast()
  toast.info(message)
}
