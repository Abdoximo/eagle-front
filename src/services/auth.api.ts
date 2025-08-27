import api from './api'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdateProfileData,
  UpdatePasswordData,
  User,
} from '@/types/auth'

export const authApi = {
  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post('/auth/login', credentials)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return api.post('/auth/register', data)
  },

  async logout(): Promise<{ message: string }> {
    return api.post('/auth/logout')
  },

  async me(): Promise<{ user: User }> {
    return api.get('/auth/me')
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return api.post('/auth/forgot-password', data)
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return api.post('/auth/reset-password', data)
  },

  // User profile methods
  async getProfile(): Promise<{ user: User }> {
    return api.get('/user/profile')
  },

  async updateProfile(data: UpdateProfileData): Promise<{ message: string; user: User }> {
    return api.put('/user/profile', data)
  },

  async updatePassword(data: UpdatePasswordData): Promise<{ message: string }> {
    return api.put('/user/password', data)
  },

  async getStats(): Promise<{
    stats: {
      credits: number
      campaigns_count: number
      contacts_count: number
      emails_sent_total: number
      emails_sent_this_month: number
      campaigns_this_month: number
      recent_campaigns: any[]
      smtp_servers_count: number
      contact_lists_count: number
    }
  }> {
    return api.get('/user/stats')
  },

  async getActivity(): Promise<{
    credit_history: any[]
    campaign_activity: any[]
  }> {
    return api.get('/user/activity')
  },
}