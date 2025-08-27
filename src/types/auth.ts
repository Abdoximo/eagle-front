export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin' | 'marketer'
  credits: number
  is_active: boolean
  email_verified_at: string | null
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  terms: boolean
  is_admin?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  name: string
  email: string
  settings?: Record<string, any>
}

export interface UpdatePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}