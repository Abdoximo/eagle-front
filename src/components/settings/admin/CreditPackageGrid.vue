<template>
  <div v-if="packages.length === 0" class="text-center py-8">
    <div class="text-gray-500 dark:text-gray-400">
      {{ $t('settings.admin.noCreditPackages') }}
    </div>
  </div>
  
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="package_ in packages"
      :key="package_.id"
      class="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
      :class="{ 'ring-2 ring-blue-500': package_.is_popular }"
    >
      <!-- Popular Badge -->
      <div
        v-if="package_.is_popular"
        class="absolute -top-2 left-1/2 transform -translate-x-1/2"
      >
        <span class="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
          {{ $t('settings.admin.popular') }}
        </span>
      </div>

      <!-- Package Header -->
      <div class="text-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ package_.name }}
        </h3>
        <div class="mt-2">
          <span class="text-3xl font-bold text-gray-900 dark:text-white">
            ${{ package_.price.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Credits -->
      <div class="text-center mb-4">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ package_.credits.toLocaleString() }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('settings.admin.credits') }}
        </div>
      </div>

      <!-- Price per credit -->
      <div class="text-center mb-4">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          {{ $t('settings.admin.pricePerCredit') }}: 
          <span class="font-medium">
            ${{ (package_.price / package_.credits).toFixed(4) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="package_.description" class="text-center mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ package_.description }}
        </p>
      </div>

      <!-- Package Info -->
      <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex justify-between">
          <span>{{ $t('common.labels.created_at') }}:</span>
          <span>{{ formatDate(package_.created_at) }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ $t('common.labels.updated_at') }}:</span>
          <span>{{ formatDate(package_.updated_at) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="destructive"
          size="sm"
          @click="handleRemove(package_.id)"
        >
          {{ $t('common.delete') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import Button from '@/components/ui/Button.vue'

// Types
import type { CreditPackage } from '@/types/admin'

interface Props {
  packages: CreditPackage[]
}

interface Emits {
  (e: 'remove', packageId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Methods
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const handleRemove = (packageId: number) => {
  if (confirm(t('settings.admin.confirmRemovePackage'))) {
    emit('remove', packageId)
  }
}
</script> 