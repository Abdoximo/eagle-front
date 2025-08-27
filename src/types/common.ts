export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface PaginationMeta {
  current_page: number
  total: number
  per_page: number
  last_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface SelectOption {
  label: string
  value: string | number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: Date
  read: boolean
}

export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ValidationError {
  field: string
  message: string
}