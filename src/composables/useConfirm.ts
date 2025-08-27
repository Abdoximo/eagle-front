import { ref } from 'vue'

interface ConfirmOptions {
  title: string
  message: string
  type?: 'info' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
}

interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  type: 'info' | 'warning' | 'danger'
  confirmText: string
  cancelText: string
  resolve: ((value: boolean) => void) | null
}

const state = ref<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  resolve: null
})

export function useConfirm() {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.value = {
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        resolve
      }
    })
  }

  const handleConfirm = () => {
    if (state.value.resolve) {
      state.value.resolve(true)
    }
    close()
  }

  const handleCancel = () => {
    if (state.value.resolve) {
      state.value.resolve(false)
    }
    close()
  }

  const close = () => {
    state.value.isOpen = false
    state.value.resolve = null
  }

  return {
    state,
    confirm,
    handleConfirm,
    handleCancel
  }
}
