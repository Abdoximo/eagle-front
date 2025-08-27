import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showSuccess, showError, showWarning, showInfo } from '@/services/toast'
import type { NotificationItem } from '@/types/common'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = generateId()
    const newNotification = { ...notification, id }
    notifications.value.push(newNotification)

    // Auto remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(id)
    }, duration)

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string) => {
    showSuccess(message)
    return addNotification({
      type: 'success',
      title: title || 'Success',
      message
    })
  }

  const error = (message: string, title?: string) => {
    showError(message)
    return addNotification({
      type: 'error',
      title: title || 'Error',
      message
    })
  }

  const warning = (message: string, title?: string) => {
    showWarning(message)
    return addNotification({
      type: 'warning',
      title: title || 'Warning',
      message
    })
  }

  const info = (message: string, title?: string) => {
    showInfo(message)
    return addNotification({
      type: 'info',
      title: title || 'Info',
      message
    })
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear
  }
}) 