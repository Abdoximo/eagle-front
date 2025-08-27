<template>
  <Card class="p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ $t('settings.admin.addCreditPackage') }}
    </h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          v-model="form.name"
          :label="$t('settings.admin.packageName')"
          :placeholder="$t('settings.admin.packageNamePlaceholder')"
          :error="errors.name"
          required
        />
        
        <FormField
          v-model.number="form.credits"
          type="number"
          :label="$t('settings.admin.packageCredits')"
          :placeholder="$t('settings.admin.packageCreditsPlaceholder')"
          :error="errors.credits"
          min="1"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          v-model.number="form.price"
          type="number"
          step="0.01"
          :label="$t('settings.admin.packagePrice')"
          :placeholder="$t('settings.admin.packagePricePlaceholder')"
          :error="errors.price"
          min="0"
          required
        />
        
        <div class="flex items-center space-x-2">
          <Checkbox
            v-model="form.is_popular"
            :label="$t('settings.admin.markAsPopular')"
          />
        </div>
      </div>

      <FormField
        v-model="form.description"
        type="textarea"
        :label="$t('settings.admin.packageDescription')"
        :placeholder="$t('settings.admin.packageDescriptionPlaceholder')"
        :help="$t('settings.admin.packageDescriptionHelp')"
        rows="3"
      />

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
          {{ $t('common.create') }}
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Components
import Card from '@/components/ui/Card.vue'
import FormField from '@/components/ui/FormField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Button from '@/components/ui/Button.vue'

// Types
import type { CreditPackage } from '@/types/admin'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Omit<CreditPackage, 'id' | 'created_at' | 'updated_at'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Form state
const form = ref({
  name: '',
  credits: 0,
  price: 0,
  description: '',
  is_popular: false
})

const errors = ref<Record<string, string>>({})

// Computed
const canSubmit = computed(() => {
  return form.value.name && 
         form.value.credits > 0 && 
         form.value.price >= 0 &&
         !props.loading
})

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = t('common.validation.required')
  }
  
  if (!form.value.credits || form.value.credits <= 0) {
    errors.value.credits = t('settings.admin.validation.creditsRequired')
  }
  
  if (form.value.price < 0) {
    errors.value.price = t('settings.admin.validation.pricePositive')
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  emit('submit', {
    name: form.value.name,
    credits: form.value.credits,
    price: form.value.price,
    description: form.value.description || undefined,
    is_popular: form.value.is_popular
  })
  
  // Reset form
  form.value = {
    name: '',
    credits: 0,
    price: 0,
    description: '',
    is_popular: false
  }
}
</script> 