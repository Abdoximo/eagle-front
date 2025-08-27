<template>
  <Modal 
    v-model="isOpen"
    :title="$t('admin.users.edit')"
    size="md"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6" v-if="user">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('admin.users.form.basicInfo') }}
        </h3>
        
        <FormField
          :label="$t('admin.users.form.name')"
          :error="errors.name"
          required
        >
          <Input
            v-model="form.name"
            type="text"
            :placeholder="$t('admin.users.form.namePlaceholder')"
            :class="{ 'border-red-300': errors.name }"
          />
        </FormField>
        
        <FormField
          :label="$t('admin.users.form.email')"
          :error="errors.email"
          required
        >
          <Input
            v-model="form.email"
            type="email"
            :placeholder="$t('admin.users.form.emailPlaceholder')"
            :class="{ 'border-red-300': errors.email }"
          />
        </FormField>
        
        <FormField
          :label="$t('admin.users.form.newPassword')"
          :help="$t('admin.users.form.passwordEditHelp')"
          :error="errors.password"
        >
          <Input
            v-model="form.password"
            type="password"
            :placeholder="$t('admin.users.form.newPasswordPlaceholder')"
            :class="{ 'border-red-300': errors.password }"
          />
        </FormField>
        
        <FormField
          v-if="form.password"
          :label="$t('admin.users.form.confirmPassword')"
          :error="errors.password_confirmation"
        >
          <Input
            v-model="form.password_confirmation"
            type="password"
            :placeholder="$t('admin.users.form.confirmPasswordPlaceholder')"
            :class="{ 'border-red-300': errors.password_confirmation }"
          />
        </FormField>
      </div>
      
      <!-- Role and Status -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('admin.users.form.rolePermissions') }}
        </h3>
        
        <FormField
          :label="$t('admin.users.form.role')"
          :error="errors.role"
          required
        >
          <SelectField
            v-model="form.role"
            :options="roleOptions"
            :placeholder="$t('admin.users.form.selectRole')"
            :class="{ 'border-red-300': errors.role }"
          />
        </FormField>
        
        <FormField
          :label="$t('admin.users.form.status')"
          :error="errors.status"
        >
          <SelectField
            v-model="form.status"
            :options="statusOptions"
            :placeholder="$t('admin.users.form.selectStatus')"
          />
        </FormField>
      </div>
      
      <!-- Credits -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('admin.users.form.creditsSection') }}
        </h3>
        
        <FormField
          :label="$t('admin.users.form.currentCredits')"
          :error="errors.credits"
        >
          <Input
            v-model.number="form.credits"
            type="number"
            min="0"
            :placeholder="$t('admin.users.form.creditsPlaceholder')"
            :class="{ 'border-red-300': errors.credits }"
          />
        </FormField>
      </div>
    </form>

    <!-- Dialog Actions -->
    <template #footer>
      <div class="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="handleClose"
          :disabled="loading"
        >
          {{ $t('common.cancel') }}
        </Button>
        <Button
          @click="handleSubmit"
          :loading="loading"
          class="bg-blue-600 hover:bg-blue-700"
        >
          <Save class="h-4 w-4 mr-2" />
          {{ $t('common.save') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Save } from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import SelectField from '@/components/ui/SelectField.vue'
import FormField from '@/components/ui/FormField.vue'

// Stores
import { useAdminStore } from '@/stores/admin'

// Types
import type { UserWithStats } from '@/types/admin'

interface Props {
  modelValue: boolean
  user?: UserWithStats | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated', user: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const adminStore = useAdminStore()

// Reactive data
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
  status: 'active',
  credits: 0
})

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const roleOptions = computed(() => [
  { value: 'user', label: t('admin.users.roles.user') },
  { value: 'marketer', label: t('admin.users.roles.marketer') },
  { value: 'admin', label: t('admin.users.roles.admin') }
])

const statusOptions = computed(() => [
  { value: 'active', label: t('admin.users.status.active') },
  { value: 'disabled', label: t('admin.users.status.disabled') }
])

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = t('common.validation.required')
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = t('common.validation.required')
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = t('common.validation.email')
  }
  
  // Only validate password if it's provided
  if (form.value.password && form.value.password.length < 8) {
    errors.value.password = t('common.validation.min_length', { min: 8 })
  }
  
  if (form.value.password && form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = t('common.validation.password_match')
  }
  
  if (!form.value.role) {
    errors.value.role = t('common.validation.required')
  }
  
  if (form.value.credits < 0) {
    errors.value.credits = t('common.validation.positiveNumber')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm() || !props.user) return
  
  loading.value = true
  
  try {
    const userData: any = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      status: form.value.status,
      credits: form.value.credits
    }
    
    // Only include password if it's provided
    if (form.value.password) {
      userData.password = form.value.password
      userData.password_confirmation = form.value.password_confirmation
    }
    
    const user = await adminStore.updateUser(props.user.id, userData)
    emit('updated', user)
    handleClose()
  } catch (error: any) {
    // Handle validation errors from server
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  resetForm()
  emit('update:modelValue', false)
}

const resetForm = () => {
  if (props.user) {
    form.value = {
      name: props.user.name || '',
      email: props.user.email || '',
      password: '',
      password_confirmation: '',
      role: props.user.role || 'user',
      status: props.user.status || 'active',
      credits: props.user.credits || 0
    }
  }
  errors.value = {}
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.user) {
    resetForm()
  }
})

watch(() => props.user, (newUser) => {
  if (newUser && props.modelValue) {
    resetForm()
  }
})
</script> 