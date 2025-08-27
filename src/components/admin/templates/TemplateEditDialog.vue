<template>
  <Modal 
    v-model="isOpen"
    :title="$t('templates.edit')"
    size="xl"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('templates.form.basic_info') }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            :label="$t('templates.form.name')"
            :error="errors.name"
            required
          >
            <Input
              v-model="form.name"
              :placeholder="$t('templates.form.name')"
              :class="{ 'border-red-300': errors.name }"
            />
          </FormField>
          
          <FormField
            :label="$t('templates.form.type')"
            :error="errors.type"
          >
            <SelectField
              v-model="form.type"
              :options="typeOptions"
              :placeholder="$t('templates.form.type')"
            />
          </FormField>
        </div>

        <FormField
          :label="$t('templates.form.description')"
          :error="errors.description"
        >
          <textarea
            v-model="form.description"
            :placeholder="$t('templates.form.description')"
            rows="3"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </FormField>
      </div>

      <!-- Template Content -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('templates.form.content') }}
        </h3>
        
        <!-- Content Type Tabs -->
        <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            type="button"
            @click="contentTab = 'html'"
            :class="[
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
              contentTab === 'html'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <Code class="h-4 w-4 mr-2" />
            {{ $t('templates.form.html_content') }}
          </button>
          <button
            type="button"
            @click="contentTab = 'text'"
            :class="[
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
              contentTab === 'text'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <FileText class="h-4 w-4 mr-2" />
            {{ $t('templates.form.text_content') }}
          </button>
        </div>

        <!-- HTML Content -->
        <div v-if="contentTab === 'html'">
          <FormField
            :label="$t('templates.form.html_content')"
            :error="errors.html_content"
            required
          >
            <CodeEditor
              v-model="form.html_content"
              language="html"
              :placeholder="$t('templates.form.html_content')"
              height="300px"
            />
          </FormField>
        </div>

        <!-- Text Content -->
        <div v-if="contentTab === 'text'">
          <FormField
            :label="$t('templates.form.text_content')"
            :error="errors.text_content"
          >
            <textarea
              v-model="form.text_content"
              :placeholder="$t('templates.form.text_content')"
              rows="12"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-mono text-sm"
            />
          </FormField>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="form.html_content" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('templates.form.preview') }}
        </h3>
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div 
            class="prose max-w-none dark:prose-invert"
            v-html="sanitizeEmailContent(form.html_content)"
          />
        </div>
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
          class="flex items-center"
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
import { useSanitizer } from '@/composables/useSanitizer'
import { 
  Code, 
  FileText, 
  Save 
} from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import CodeEditor from '@/components/ui/CodeEditor.vue'

// Stores
import { useTemplatesStore } from '@/stores/templates'

// Types
import type { Template } from '@/types/templates'

interface Props {
  modelValue: boolean
  template?: Template | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated', template: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { sanitizeEmailContent } = useSanitizer()

const templatesStore = useTemplatesStore()

// Reactive data
const loading = ref(false)
const contentTab = ref('html')
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  description: '',
  html_content: '',
  text_content: '',
  type: 'free'
})

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const typeOptions = computed(() => [
  { value: 'free', label: t('admin.templates.types.free') },
  { value: 'premium', label: t('admin.templates.types.premium') }
])

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = t('common.validation.required')
  }
  
  if (!form.value.html_content.trim()) {
    errors.value.html_content = t('common.validation.required')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm() || !props.template) return
  
  loading.value = true
  
  try {
    const templateData = {
      name: form.value.name,
      description: form.value.description,
      html_content: form.value.html_content,
      text_content: form.value.text_content,
      type: form.value.type
    }
    
    const updatedTemplate = await templatesStore.updateTemplate(props.template.id, templateData)
    emit('updated', updatedTemplate)
    handleClose()
  } catch (error: any) {
    console.error('Failed to update template:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  form.value = {
    name: '',
    description: '',
    html_content: '',
    text_content: '',
    type: 'free'
  }
  errors.value = {}
  contentTab.value = 'html'
  emit('update:modelValue', false)
}

// Watchers
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    form.value = {
      name: newTemplate.name || '',
      description: newTemplate.description || '',
      html_content: newTemplate.html_content || '',
      text_content: newTemplate.text_content || '',
      type: newTemplate.type || 'free'
    }
    errors.value = {}
  }
}, { immediate: true })

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    handleClose()
  }
})
</script> 