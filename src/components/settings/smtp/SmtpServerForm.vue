<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        :label="$t('settings.smtp.form.name')"
        :error="errors.name"
        required
      >
        <Input
          v-model="form.name"
          type="text"
          :placeholder="$t('settings.smtp.form.namePlaceholder')"
          :class="{ 'border-red-300': errors.name }"
        />
      </FormField>
      
      <FormField
        :label="$t('settings.smtp.form.host')"
        :error="errors.host"
        required
      >
        <Input
          v-model="form.host"
          type="text"
          :placeholder="$t('settings.smtp.form.hostPlaceholder')"
          :class="{ 'border-red-300': errors.host }"
        />
      </FormField>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        :label="$t('settings.smtp.form.port')"
        :error="errors.port"
        required
      >
        <Input
          v-model.number="form.port"
          type="number"
          :placeholder="$t('settings.smtp.form.portPlaceholder')"
          min="1"
          max="65535"
          :class="{ 'border-red-300': errors.port }"
        />
      </FormField>
      
      <SelectField
        v-model="form.encryption"
        :label="$t('settings.smtp.form.encryption')"
        :options="encryptionOptions"
        :error="errors.encryption"
        required
      />
      
      <FormField
        :label="$t('settings.smtp.form.priority')"
        :help="$t('settings.smtp.form.priorityHelp')"
        :error="errors.priority"
      >
        <Input
          v-model.number="form.priority"
          type="number"
          :placeholder="$t('settings.smtp.form.priorityPlaceholder')"
          min="1"
          max="10"
          :class="{ 'border-red-300': errors.priority }"
        />
      </FormField>
    </div>

    <!-- Authentication -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('settings.smtp.form.authentication') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          :label="$t('settings.smtp.form.username')"
          :error="errors.username"
          required
        >
          <Input
            v-model="form.username"
            type="text"
            :placeholder="$t('settings.smtp.form.usernamePlaceholder')"
            :class="{ 'border-red-300': errors.username }"
          />
        </FormField>
        
        <FormField
          :label="$t('settings.smtp.form.password')"
          :help="isEditing ? $t('settings.smtp.form.passwordEditHelp') : undefined"
          :error="errors.password"
          :required="!isEditing"
        >
          <Input
            v-model="form.password"
            type="password"
            :placeholder="$t('settings.smtp.form.passwordPlaceholder')"
            :class="{ 'border-red-300': errors.password }"
          />
        </FormField>
      </div>
    </div>

    <!-- Limits -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {{ $t('settings.smtp.form.limits') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          :label="$t('settings.smtp.form.dailyLimit')"
          :help="$t('settings.smtp.form.dailyLimitHelp')"
          :error="errors.daily_limit"
        >
          <Input
            v-model.number="form.daily_limit"
            type="number"
            :placeholder="$t('settings.smtp.form.dailyLimitPlaceholder')"
            min="0"
            :class="{ 'border-red-300': errors.daily_limit }"
          />
        </FormField>
        
        <FormField
          :label="$t('settings.smtp.form.hourlyLimit')"
          :help="$t('settings.smtp.form.hourlyLimitHelp')"
          :error="errors.hourly_limit"
        >
          <Input
            v-model.number="form.hourly_limit"
            type="number"
            :placeholder="$t('settings.smtp.form.hourlyLimitPlaceholder')"
            min="0"
            :class="{ 'border-red-300': errors.hourly_limit }"
          />
        </FormField>
      </div>
    </div>

    <!-- Test Connection Results -->
    <div v-if="testResult" class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <Alert
        :type="testResult.success ? 'success' : 'error'"
        :title="testResult.success ? $t('settings.smtp.test.success') : $t('settings.smtp.test.failed')"
        :message="testResult.message"
        class="mb-4"
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="handleTest"
          :loading="testingConnection"
          :disabled="!canTest"
          class="flex items-center"
        >
          <TestTube class="w-4 h-4 mr-2" />
          {{ $t('settings.smtp.form.testConnection') }}
        </Button>
        
        <div v-if="testingConnection" class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('settings.smtp.form.testing') }}
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <Button
          type="button"
          variant="ghost"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </Button>
        
        <Button
          type="submit"
          :loading="loading"
          :disabled="!canSubmit"
        >
          {{ isEditing ? $t('common.save') : $t('common.create') }}
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { TestTube } from 'lucide-vue-next'

// Components
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'
import Input from '@/components/ui/Input.vue'

// Types
import type { SmtpServer, CreateSmtpServerData, SmtpTestResult } from '@/types/smtp'

interface Props {
  server?: SmtpServer | null
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: CreateSmtpServerData): void
  (e: 'cancel'): void
  (e: 'test', data: CreateSmtpServerData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Form state
const form = ref<CreateSmtpServerData>({
  name: '',
  host: '',
  port: 587,
  username: '',
  password: '',
  encryption: 'tls',
  priority: 5,
  daily_limit: undefined,
  hourly_limit: undefined,
})

const errors = ref<Record<string, string>>({})
const testResult = ref<SmtpTestResult | null>(null)
const testingConnection = ref(false)

// Computed
const isEditing = computed(() => !!props.server)

const encryptionOptions = computed(() => [
  { value: 'none', label: t('settings.smtp.encryption.none') },
  { value: 'tls', label: t('settings.smtp.encryption.tls') },
  { value: 'ssl', label: t('settings.smtp.encryption.ssl') },
])

const canTest = computed(() => {
  return form.value.host && 
         form.value.port && 
         form.value.username && 
         form.value.password &&
         !testingConnection.value
})

const canSubmit = computed(() => {
  return form.value.name && 
         form.value.host && 
         form.value.port && 
         form.value.username && 
         (form.value.password || isEditing.value) &&
         !props.loading
})

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = t('common.validation.required')
  }
  
  if (!form.value.host) {
    errors.value.host = t('common.validation.required')
  }
  
  if (!form.value.port || form.value.port < 1 || form.value.port > 65535) {
    errors.value.port = t('common.validation.portRange')
  }
  
  if (!form.value.username) {
    errors.value.username = t('common.validation.required')
  }
  
  if (!form.value.password && !isEditing.value) {
    errors.value.password = t('common.validation.required')
  }
  
  if (form.value.priority && (form.value.priority < 1 || form.value.priority > 10)) {
    errors.value.priority = t('common.validation.priorityRange')
  }
  
  if (form.value.daily_limit && form.value.daily_limit < 0) {
    errors.value.daily_limit = t('common.validation.positiveNumber')
  }
  
  if (form.value.hourly_limit && form.value.hourly_limit < 0) {
    errors.value.hourly_limit = t('common.validation.positiveNumber')
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  const submitData = { ...form.value }
  
  // Remove empty password for editing
  if (isEditing.value && !submitData.password) {
    delete submitData.password
  }
  
  // Convert undefined limits to null for API
  if (submitData.daily_limit === undefined) {
    delete submitData.daily_limit
  }
  if (submitData.hourly_limit === undefined) {
    delete submitData.hourly_limit
  }
  
  emit('submit', submitData)
}

const handleTest = async () => {
  if (!canTest.value) return
  
  testingConnection.value = true
  testResult.value = null
  
  try {
    emit('test', form.value)
  } finally {
    testingConnection.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    priority: 5,
    daily_limit: undefined,
    hourly_limit: undefined,
  }
  errors.value = {}
  testResult.value = null
}

// Watchers
watch(() => props.server, (server) => {
  if (server) {
    form.value = {
      name: server.name,
      host: server.host,
      port: server.port,
      username: server.username,
      password: '', // Don't populate password for security
      encryption: server.encryption,
      priority: server.priority,
      daily_limit: server.daily_limit,
      hourly_limit: server.hourly_limit,
    }
  } else {
    resetForm()
  }
  errors.value = {}
  testResult.value = null
}, { immediate: true })

// Clear test results when form changes
watch(form, () => {
  if (testResult.value) {
    testResult.value = null
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  if (props.server) {
    form.value = {
      name: props.server.name,
      host: props.server.host,
      port: props.server.port,
      username: props.server.username,
      password: '',
      encryption: props.server.encryption,
      priority: props.server.priority,
      daily_limit: props.server.daily_limit,
      hourly_limit: props.server.hourly_limit,
    }
  }
})

// Expose methods for parent component
defineExpose({
  resetForm,
  setTestResult: (result: SmtpTestResult) => {
    testResult.value = result
    testingConnection.value = false
  }
})
</script> 