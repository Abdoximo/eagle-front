<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- System Settings -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        v-model.number="form.max_contacts_per_list"
        type="number"
        :label="$t('settings.admin.maxContactsPerList')"
        :help="$t('settings.admin.maxContactsPerListHelp')"
        min="1"
        required
      />
      
      <FormField
        v-model.number="form.max_campaigns_per_month"
        type="number"
        :label="$t('settings.admin.maxCampaignsPerMonth')"
        :help="$t('settings.admin.maxCampaignsPerMonthHelp')"
        min="1"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        v-model.number="form.default_credits_new_user"
        type="number"
        :label="$t('settings.admin.defaultCreditsNewUser')"
        :help="$t('settings.admin.defaultCreditsNewUserHelp')"
        min="0"
        required
      />
      
      <FormField
        v-model.number="form.smtp_rate_limit"
        type="number"
        :label="$t('settings.admin.smtpRateLimit')"
        :help="$t('settings.admin.smtpRateLimitHelp')"
        min="1"
        required
      />
    </div>

    <!-- System Toggles -->
    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('settings.admin.maintenanceMode') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.maintenanceModeHelp') }}
          </p>
        </div>
        <Checkbox
          v-model="form.maintenance_mode"
        />
      </div>

      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('settings.admin.registrationEnabled') }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.admin.registrationEnabledHelp') }}
          </p>
        </div>
        <Checkbox
          v-model="form.registration_enabled"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        type="submit"
        :loading="loading"
      >
        {{ $t('common.save') }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Components
import FormField from '@/components/ui/FormField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Button from '@/components/ui/Button.vue'

// Types
import type { AdminSettings } from '@/types/admin'

interface Props {
  modelValue?: AdminSettings | null
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AdminSettings): void
  (e: 'submit', value: AdminSettings): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Form state
const form = ref<AdminSettings>({
  max_contacts_per_list: 10000,
  max_campaigns_per_month: 50,
  default_credits_new_user: 100,
  smtp_rate_limit: 100,
  maintenance_mode: false,
  registration_enabled: true,
  credit_packages: []
})

// Methods
const handleSubmit = () => {
  emit('submit', form.value)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    form.value = { ...newValue }
  }
}, { immediate: true })

watch(form, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Initialize
onMounted(() => {
  if (props.modelValue) {
    form.value = { ...props.modelValue }
  }
})
</script> 