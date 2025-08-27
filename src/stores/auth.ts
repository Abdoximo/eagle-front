import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/auth.api'
import type { User, LoginCredentials, RegisterData, UpdateProfileData, UpdatePasswordData } from '@/types/auth'
import { showSuccess, showError } from '@/services/toast'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMarketer = computed(() => user.value?.role === 'marketer' || isAdmin.value)
  const userCredits = computed(() => user.value?.credits || 0)

  // Actions
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        console.log('🔑 Auth restored:', { token: token.value, user: user.value })
      } catch (error) {
        console.error('❌ Failed to parse stored auth data:', error)
        clearAuth()
      }
    } else {
      console.warn('⚠️ No stored auth data found')
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      
      const response = await authApi.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Login successful, auth data stored
      
      showSuccess(response.message || 'Login successful')
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    try {
      loading.value = true
      const response = await authApi.register(data)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      showSuccess(response.message || 'Registration successful')
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      clearAuth()
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.me()
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      // If refresh fails, logout
      clearAuth()
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      loading.value = true
      const response = await authApi.updateProfile(data)
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
      showSuccess(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (data: UpdatePasswordData) => {
    try {
      loading.value = true
      const response = await authApi.updatePassword(data)
      showSuccess(response.message)
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password update failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateCredits = (newCredits: number) => {
    if (user.value) {
      user.value.credits = newCredits
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isMarketer,
    userCredits,
    
    // Actions
    initAuth,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    updatePassword,
    updateCredits,
    clearAuth,
  }
})