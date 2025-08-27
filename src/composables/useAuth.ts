import { computed } from 'vue'
import { showSuccess, showError } from '@/services/toast'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/auth.api'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

const user = ref<User | null>(null)
const token = ref<string | null>(null)
const loading = ref(false)

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Getters
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isMarketer = computed(() => authStore.isMarketer)
  const user = computed(() => authStore.user)
  const userCredits = computed(() => authStore.userCredits)

  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      const response = await authApi.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      showSuccess(response.message || 'Login successful')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Register
  const register = async (data: RegisterData) => {
    try {
      loading.value = true
      const response = await authApi.register(data)
      
      token.value = response.token
      user.value = response.user
      
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      showSuccess(response.message || 'Registration successful')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout errors
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authApi.me()
      user.value = response.user
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      // If refresh fails, logout
      logout()
    }
  }

  // Update user credits
  const updateCredits = (newCredits: number) => {
    if (user.value) {
      user.value.credits = newCredits
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    isAdmin,
    isMarketer,
    initAuth,
    login,
    register,
    logout,
    refreshUser,
    updateCredits,
  }
}