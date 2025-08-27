import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { enUS, fr, es } from 'date-fns/locale'

// Date formatting helpers
export const formatDate = (date: string | Date, formatStr = 'PP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const locale = getDateLocale()
  return format(dateObj, formatStr, { locale })
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'PPpp')
}

export const formatDistanceFromNow = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const locale = getDateLocale()
  return formatDistanceToNow(dateObj, { addSuffix: true, locale })
}

const getDateLocale = () => {
  const language = localStorage.getItem('language') || 'en'
  switch (language) {
    case 'fr':
      return fr
    case 'es':
      return es
    default:
      return enUS
  }
}

// Number formatting helpers
export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatCurrency = (value: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency,
  }).format(value)
}

export const formatPercentage = (value: number, decimals = 1): string => {
  return new Intl.NumberFormat(getLocale(), {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

const getLocale = (): string => {
  const language = localStorage.getItem('language') || 'en'
  switch (language) {
    case 'fr':
      return 'fr-FR'
    case 'es':
      return 'es-ES'
    default:
      return 'en-US'
  }
}

// String helpers
export const truncate = (text: string, length = 50): string => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Array helpers
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// File helpers
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

// Color helpers
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'gray',
    scheduled: 'blue',
    sending: 'yellow',
    sent: 'green',
    paused: 'orange',
    cancelled: 'red',
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
    completed: 'green',
    failed: 'red',
  }
  return colors[status.toLowerCase()] || 'gray'
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Deep clone
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}