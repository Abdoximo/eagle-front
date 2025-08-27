import { useI18n } from 'vue-i18n'

export function useDateFormatter() {
  const { locale } = useI18n()

  const formatDate = (
    date: string | Date, 
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }

    try {
      return new Intl.DateTimeFormat(locale.value, defaultOptions).format(dateObj)
    } catch (error) {
      // Fallback to basic formatting
      return dateObj.toLocaleDateString()
    }
  }

  const formatDateTime = (date: string | Date): string => {
    return formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (date: string | Date): string => {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    try {
      return new Intl.DateTimeFormat(locale.value, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      return dateObj.toLocaleTimeString()
    }
  }

  const formatRelativeTime = (date: string | Date): string => {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now'
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }

    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }

    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} month${months > 1 ? 's' : ''} ago`
    }

    // More than a year
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }

  const isToday = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear()
  }

  const isYesterday = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    return dateObj.getDate() === yesterday.getDate() &&
           dateObj.getMonth() === yesterday.getMonth() &&
           dateObj.getFullYear() === yesterday.getFullYear()
  }

  const isThisWeek = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    return dateObj >= weekStart && dateObj <= weekEnd
  }

  const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)
    
    if (start === end) {
      return start
    }
    
    return `${start} - ${end}`
  }

  const getDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const addDays = (date: string | Date, days: number): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setDate(dateObj.getDate() + days)
    return dateObj
  }

  const startOfDay = (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setHours(0, 0, 0, 0)
    return dateObj
  }

  const endOfDay = (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
    dateObj.setHours(23, 59, 59, 999)
    return dateObj
  }

  const formatForInput = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  }

  const formatForDateTimeInput = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().slice(0, 16)
  }

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeTime,
    formatDateRange,
    formatForInput,
    formatForDateTimeInput,
    isToday,
    isYesterday,
    isThisWeek,
    getDaysBetween,
    addDays,
    startOfDay,
    endOfDay
  }
}