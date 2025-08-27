import { ref, onMounted, onUnmounted } from 'vue'
import { showSuccess, showError, showWarning, showInfo } from '@/services/toast'
import type { NotificationItem } from '@/types/common'

export function useNotifications() {
  const notifications = ref<NotificationItem[]>([])
  const unreadCount = ref(0)
  const isOpen = ref(false)

  // Add notification
  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    notifications.value.unshift(newNotification)
    
    // Show toast notification
    if (notification.type === 'success') {
      showSuccess(notification.message)
    } else if (notification.type === 'error') {
      showError(notification.message)
    } else if (notification.type === 'warning') {
      showWarning(notification.message)
    } else if (notification.type === 'info') {
      showInfo(notification.message)
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  // Mark as read
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value--
    }
  }

  // Mark all as read
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
    unreadCount.value = 0
  }

  // Remove notification
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value--
      }
      notifications.value.splice(index, 1)
    }
  }

  // Clear all notifications
  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  // WebSocket connection for real-time notifications
  let ws: WebSocket | null = null

  const connectWebSocket = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    // Skip WebSocket connection if not configured
    if (!import.meta.env.VITE_WS_URL) {
      console.log('WebSocket notifications disabled (VITE_WS_URL not configured)')
      return
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL}/app/email-saas?token=${token}`
    
    try {
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'notification') {
            addNotification(data.notification)
          }
        } catch (error) {
        }
      }

      ws.onclose = () => {
        // Only reconnect if WebSocket URL is configured
        if (import.meta.env.VITE_WS_URL) {
          setTimeout(connectWebSocket, 5000)
        }
      }

      ws.onerror = (error) => {
      }
    } catch (error) {
    }
  }

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  onMounted(() => {
    connectWebSocket()
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  }
}