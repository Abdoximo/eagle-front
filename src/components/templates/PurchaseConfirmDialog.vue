<template>
  <Modal 
    v-model="isOpen"
    :title="$t('templates.gallery.purchaseConfirm.title')"
    size="md"
    @close="handleClose"
  >
    <div class="space-y-6" v-if="template">
      <!-- Template Info -->
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <img
            v-if="template.thumbnail"
            :src="template.thumbnail"
            :alt="template.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full">
            <FileText class="h-6 w-6 text-gray-400" />
          </div>
        </div>
        
        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ template.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ template.description || $t('templates.gallery.noDescription') }}
          </p>
          <Badge variant="warning" class="mt-2">
            {{ $t('templates.gallery.types.premium') }}
          </Badge>
        </div>
      </div>

      <!-- Purchase Details -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
          {{ $t('templates.gallery.purchaseConfirm.details') }}
        </h4>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">
              {{ $t('templates.gallery.purchaseConfirm.templatePrice') }}
            </span>
            <span class="text-gray-900 dark:text-white font-medium">
              {{ templatePrice }} {{ $t('common.credits') }}
            </span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">
              {{ $t('templates.gallery.purchaseConfirm.currentCredits') }}
            </span>
            <span class="text-gray-900 dark:text-white font-medium">
              {{ userCredits }} {{ $t('common.credits') }}
            </span>
          </div>
          
          <hr class="border-gray-200 dark:border-gray-600">
          
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">
              {{ $t('templates.gallery.purchaseConfirm.afterPurchase') }}
            </span>
            <span class="text-gray-900 dark:text-white font-medium">
              {{ creditsAfterPurchase }} {{ $t('common.credits') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Warning if insufficient credits -->
      <div v-if="userCredits < templatePrice" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <div class="flex items-center">
          <AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          <p class="text-sm text-red-700 dark:text-red-300">
            {{ $t('templates.gallery.purchaseConfirm.insufficientCredits') }}
          </p>
        </div>
      </div>

      <!-- Success message for sufficient credits -->
      <div v-else class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
        <div class="flex items-center">
          <CheckCircle class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <p class="text-sm text-green-700 dark:text-green-300">
            {{ $t('templates.gallery.purchaseConfirm.purchaseNote') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Dialog Actions -->
    <template #footer>
      <div class="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="handleClose"
          :disabled="purchasing"
        >
          {{ $t('common.cancel') }}
        </Button>
        <Button
          @click="handlePurchase"
          :loading="purchasing"
          :disabled="userCredits < templatePrice"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          <ShoppingCart class="h-4 w-4 mr-2" />
          {{ $t('templates.gallery.purchaseConfirm.confirmPurchase') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  FileText,
  ShoppingCart,
  AlertCircle,
  CheckCircle
} from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

// Types
import type { Template } from '@/types/templates'

interface Props {
  modelValue: boolean
  template?: Template | null
  userCredits: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirmed', template: Template): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// Reactive data
const purchasing = ref(false)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const templatePrice = computed(() => {
  return props.template?.price || 5
})

const creditsAfterPurchase = computed(() => {
  return Math.max(0, props.userCredits - templatePrice.value)
})

// Methods
const handlePurchase = async () => {
  if (!props.template || props.userCredits < templatePrice.value) return
  
  purchasing.value = true
  
  try {
    emit('confirmed', props.template)
    handleClose()
  } catch (error) {
    console.error('Error in purchase confirmation:', error)
  } finally {
    purchasing.value = false
  }
}

const handleClose = () => {
  purchasing.value = false
  emit('update:modelValue', false)
}
</script> 