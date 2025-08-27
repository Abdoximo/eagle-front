import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showError } from '@/services/toast'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
  }

  private handleTokenExpiration() {
    // Clear authentication data
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // Show user-friendly message
    showError('Your session has expired. Please log in again.')
    
    // Redirect to login with return URL
    const currentPath = window.location.pathname
    if (currentPath !== '/login') {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
    }
  }

  // Note: Sanctum tokens are not JWTs and don't have embedded expiration
  // Server-side validation will handle token expiry via 401 responses

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Sanctum tokens don't have embedded expiration - let server handle validation
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add language header
        const language = localStorage.getItem('language') || 'en'
        config.headers['Accept-Language'] = language

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        const { response } = error

        if (response?.status === 401) {
          // Unauthorized - token expired or invalid
          this.handleTokenExpiration()
          return Promise.reject(error)
        }

        if (response?.status === 403) {
          showError('Access denied')
        }

        if (response?.status === 422) {
          // Validation errors - handled by individual components
          return Promise.reject(error)
        }

        if (response?.status >= 500) {
          showError('Server error. Please try again later.')
        }

        if (!response) {
          showError('Network error. Please check your connection.')
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }

  // File upload with progress
  async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

export const api = new ApiService()
export default api