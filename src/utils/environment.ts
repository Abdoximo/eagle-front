// Environment configuration and validation for production

export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Environment flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Feature flags
  enableDebugMode: import.meta.env.VITE_DEBUG === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  
  // Performance settings
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  MAX_FILE_SIZE: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  
  // Security settings
  CSRF_TOKEN_NAME: import.meta.env.VITE_CSRF_TOKEN_NAME || 'csrf-token',
  SESSION_TIMEOUT: Number(import.meta.env.VITE_SESSION_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
}

// Validate required environment variables
const requiredEnvVars = [
  // Only require in production
  ...(env.isProduction ? ['VITE_API_BASE_URL'] : [])
]

export function validateEnvironment(): void {
  const missing: string[] = []
  
  requiredEnvVars.forEach(envVar => {
    if (!import.meta.env[envVar]) {
      missing.push(envVar)
    }
  })
  
  if (missing.length > 0 && env.isProduction) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }
  
  // In development, just warn about missing vars
  if (missing.length > 0 && env.isDevelopment) {
    console.warn('⚠️ Missing environment variables (using defaults):', missing.join(', '))
  }
}

// Security helpers
export const security = {
  // Sanitize URL parameters
  sanitizeUrl: (url: string): string => {
    try {
      const parsed = new URL(url, window.location.origin)
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '/'
      }
      return parsed.toString()
    } catch {
      return '/'
    }
  },
  
  // Generate secure random IDs
  generateId: (): string => {
    return crypto.randomUUID()
  },
  
  // Rate limiting helper
  createRateLimiter: (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, number[]>()
    
    return (key: string): boolean => {
      const now = Date.now()
      const userRequests = requests.get(key) || []
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < windowMs)
      
      if (validRequests.length >= maxRequests) {
        return false // Rate limit exceeded
      }
      
      validRequests.push(now)
      requests.set(key, validRequests)
      return true
    }
  }
}

// Performance helpers
export const performance = {
  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },
  
  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
  
  // Lazy loading helper
  createIntersectionObserver: (callback: IntersectionObserverCallback) => {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    })
  }
}
