<template>
  <Modal 
    v-model="isOpen"
    :title="template?.name || $t('templates.gallery.preview')"
    size="xl"
    @close="handleClose"
  >
    <div class="space-y-4" v-if="template">
      <!-- Template Info -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <Badge :variant="template.type === 'premium' ? 'warning' : 'success'">
            {{ $t(`templates.gallery.types.${template.type}`) }}
          </Badge>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ template.description }}
          </p>
        </div>
        <div v-if="template.type === 'premium'" class="text-right">
          <Badge variant="info">
            <Coins class="h-3 w-3 mr-1" />
            {{ template.price || 5 }} {{ $t('common.credits') }}
          </Badge>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div class="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('templates.gallery.previewContent') }}
          </h3>
        </div>
        <div class="p-4 bg-white dark:bg-gray-900 max-h-96 overflow-y-auto">
          <div class="prose max-w-none dark:prose-invert" v-html="sanitizeEmailContent(template.html_content)" />
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
        >
          {{ $t('common.close') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Coins } from 'lucide-vue-next'
import { useSanitizer } from '@/composables/useSanitizer'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

// Types
import type { Template } from '@/types/templates'

interface Props {
  modelValue: boolean
  template?: Template | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { sanitizeEmailContent } = useSanitizer()

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const handleClose = () => {
  emit('update:modelValue', false)
}
</script> 