<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">ES</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ t('auth.register.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('auth.register.subtitle') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <Input
            v-model="form.data.name"
            type="text"
            :label="t('auth.register.name')"
            :placeholder="t('auth.register.name')"
            :error="form.errors.name"
            required
            autocomplete="name"
          />

          <Input
            v-model="form.data.email"
            type="email"
            :label="t('auth.register.email')"
            :placeholder="t('auth.register.email')"
            :error="form.errors.email"
            required
            autocomplete="email"
          />

          <Input
            v-model="form.data.password"
            type="password"
            :label="t('auth.register.password')"
            :placeholder="t('auth.register.password')"
            :error="form.errors.password"
            required
            autocomplete="new-password"
          />

          <Input
            v-model="form.data.password_confirmation"
            type="password"
            :label="t('auth.register.password_confirmation')"
            :placeholder="t('auth.register.password_confirmation')"
            :error="form.errors.password_confirmation"
            required
            autocomplete="new-password"
          />

          <!-- Hidden admin field for development -->
          <Input
            v-if="isDevelopment"
            v-model="form.data.is_admin"
            type="checkbox"
            :label="t('auth.register.is_admin')"
            class="hidden"
          />
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.data.terms"
            type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            required
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {{ t('auth.register.terms') }}
          </label>
        </div>

        <div>
          <Button
            type="submit"
            class="w-full"
            :loading="!!form.loading"
            :disabled="!form.isValid"
          >
            {{ t('auth.register.submit') }}
          </Button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('auth.register.have_account') }}
            <router-link
              to="/login"
              class="font-medium text-primary hover:text-primary/80"
            >
              {{ t('auth.register.login_link') }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import type { RegisterData } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// Create computed property for development mode check
const isDevelopment = computed(() => import.meta.env.DEV)

const form = useForm<RegisterData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
  is_admin: false
})

// Debug: Watch form.isValid changes
if (import.meta.env.DEV) {
  watch(() => form.isValid, (newVal) => {
    console.log('RegisterView: form.isValid changed to:', newVal)
    console.log('RegisterView: form.isValid.value:', form.isValid.value)
    console.log('RegisterView: form.data:', { ...form.data })
    console.log('RegisterView: form.errors:', { ...form.errors })
    console.log('RegisterView: form.loading:', form.loading)
  }, { immediate: true })
  
  // Also watch individual form fields
  watch(() => form.data, (newData) => {
    console.log('RegisterView: form.data changed:', newData)
  }, { deep: true })
}

const handleRegister = async () => {
  try {
    await form.submit(
      (data) => authStore.register(data),
      'Account created successfully',
      'Registration failed'
    )
    router.push('/dashboard')
  } catch (error) {
    // Error handled by form
  }
}
</script>