<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.data.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.data.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.data.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
          
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useForm } from '@/composables/useForm'
import type { LoginCredentials } from '@/types/auth'
import { onMounted, onErrorCaptured } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// Add error state
const apiError = ref('')
const isLoading = ref(false)

// Error handling
onErrorCaptured((err) => {
  return false
})

const form = useForm<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

// Computed property to check if form can be submitted
const canSubmit = computed(() => {
  const hasEmail = form.data.email && form.data.email.trim().length > 0
  const hasPassword = form.data.password && form.data.password.trim().length > 0
  const validEmail = hasEmail && form.data.email.includes('@') && form.data.email.includes('.')
  const notLoading = !isLoading.value
  
  return notLoading && hasEmail && hasPassword && validEmail
})

const handleLogin = async () => {
  if (!canSubmit.value) {
    return
  }
  
  isLoading.value = true
  apiError.value = ''
  
  try {
    // Directly call authStore login instead of form.submit
    const result = await authStore.login({
      email: form.data.email,
      password: form.data.password
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    
    // Handle specific error cases
    if (error.message === 'Request timeout') {
      apiError.value = 'Request timed out. Please check if the API server is running.'
    } else if (error.response?.status === 401) {
      apiError.value = 'Invalid email or password.'
    } else if (error.response?.status === 422) {
      apiError.value = 'Validation error.'
    } else if (error.response?.status === 500) {
      apiError.value = 'Server error. Please try again later.'
    } else if (!error.response) {
      apiError.value = 'Network error. Please check your connection.'
    } else {
      apiError.value = 'An unexpected error occurred.'
    }
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.reset()
  apiError.value = ''
  isLoading.value = false
}

// Initialize on mount to ensure clean state
onMounted(() => {
  isLoading.value = false
  apiError.value = ''
})
</script>