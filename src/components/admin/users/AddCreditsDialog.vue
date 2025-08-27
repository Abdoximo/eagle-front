<template>
  <Modal 
    v-model="isOpen"
    :title="$t('admin.users.add_credits')"
    size="sm"
    @close="handleClose"
  >
    <div class="space-y-6" v-if="user">
      <!-- User Info -->
      <div class="flex items-center space-x-3">
        <Avatar
          :name="user.name"
          :src="user.avatar"
          size="md"
        />
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ user.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('admin.users.addCredits.currentCredits') }}: {{ user.credits?.toLocaleString() || 0 }}
          </p>
        </div>
      </div>

      <!-- Credits Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField
          :label="$t('admin.users.addCredits.creditsToAdd')"
          :error="errors.credits"
          required
        >
          <Input
            v-model.number="form.credits"
            type="number"
            min="1"
            :placeholder="$t('admin.users.addCredits.creditsPlaceholder')"
            :class="{ 'border-red-300': errors.credits }"
          />
        </FormField>

        <FormField
          :label="$t('admin.users.addCredits.reason')"
          :help="$t('admin.users.addCredits.reasonHelp')"
        >
          <Input
            v-model="form.reason"
            type="text"
            :placeholder="$t('admin.users.addCredits.reasonPlaceholder')"
          />
        </FormField>

        <!-- Credit Summary -->
        <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            {{ $t('admin.users.addCredits.summary') }}
          </h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-blue-700 dark:text-blue-300">
                {{ $t('admin.users.addCredits.currentCredits') }}:
              </span>
              <span class="text-blue-900 dark:text-blue-100 font-medium">
                {{ user.credits?.toLocaleString() || 0 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700 dark:text-blue-300">
                {{ $t('admin.users.addCredits.creditsToAdd') }}:
              </span>
              <span class="text-blue-900 dark:text-blue-100 font-medium">
                +{{ form.credits?.toLocaleString() || 0 }}
              </span>
            </div>
            <hr class="border-blue-200 dark:border-blue-600">
            <div class="flex justify-between">
              <span class="text-blue-700 dark:text-blue-300">
                {{ $t('admin.users.addCredits.newTotal') }}:
              </span>
              <span class="text-blue-900 dark:text-blue-100 font-semibold">
                {{ ((user.credits || 0) + (form.credits || 0)).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>

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
          :disabled="!form.credits || form.credits <= 0"
          class="bg-blue-600 hover:bg-blue-700"
        >
          <CreditCard class="h-4 w-4 mr-2" />
          {{ $t('admin.users.addCredits.addCredits') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CreditCard } from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/ui/FormField.vue'
import Avatar from '@/components/ui/Avatar.vue'

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
  (e: 'added', user: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const adminStore = useAdminStore()

// Reactive data
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  credits: 100,
  reason: ''
})

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.credits || form.value.credits <= 0) {
    errors.value.credits = t('common.validation.required')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm() || !props.user) return
  
  loading.value = true
  
  try {
    const result = await adminStore.addUserCredits(props.user.id, {
      amount: form.value.credits,
      reason: form.value.reason || 'Admin credit adjustment'
    })
    
    emit('added', result)
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
  form.value = {
    credits: 100,
    reason: ''
  }
  errors.value = {}
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script> 