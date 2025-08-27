<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">ES</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('auth.forgot_password.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('auth.forgot_password.subtitle') }}
        </p>
      </div>

      <!-- Success state -->
      <div v-if="emailSent" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
        <div class="flex">
          <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ $t('auth.forgot_password.email_sent') }}
            </h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>
                {{ $t('auth.forgot_password.check_email', { email: form.data.email }) }}
              </p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <button
                  @click="resendEmail"
                  :disabled="resendCooldown > 0"
                  class="bg-green-50 dark:bg-green-900/20 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ resendCooldown > 0 
                    ? $t('auth.forgot_password.resend_in', { seconds: resendCooldown })
                    : $t('auth.forgot_password.resend')
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form state -->
      <form v-else class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <Input
            v-model="form.data.email"
            type="email"
            :label="$t('auth.forgot_password.email')"
            :placeholder="$t('auth.forgot_password.email_placeholder')"
            :error="form.errors.email"
            required
            autocomplete="email"
            autofocus
          />
        </div>

        <div>
          <Button
            type="submit"
            class="w-full"
            :loading="form.loading"
            :disabled="!form.isValid"
          >
            {{ $t('auth.forgot_password.submit') }}
          </Button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.forgot_password.remember_password') }}
            <router-link
              to="/login"
              class="font-medium text-primary hover:text-primary/80"
            >
              {{ $t('auth.forgot_password.back_to_login') }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()

const emailSent = ref(false)
const resendCooldown = ref(0)
let resendInterval: NodeJS.Timeout | null = null

const form = useForm({
  email: ''
})

const handleForgotPassword = async () => {
  try {
    await form.submit(
      (data) => authStore.forgotPassword(data.email),
      '', // Don't show success toast, we'll show the success state instead
      'Failed to send reset email'
    )
    emailSent.value = true
    startResendCooldown()
  } catch (error) {
    // Error handled by form
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  
  try {
    await authStore.forgotPassword(form.data.email)
    startResendCooldown()
  } catch (error) {
    console.error('Failed to resend email:', error)
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60 // 60 seconds cooldown
  
  resendInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && resendInterval) {
      clearInterval(resendInterval)
      resendInterval = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval)
  }
})
</script>