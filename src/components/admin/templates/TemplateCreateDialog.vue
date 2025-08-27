<template>
  <Modal 
    v-model="isOpen"
    :title="$t('admin.templates.create')"
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

        <FormField
          :label="$t('admin.templates.category')"
          :error="errors.category"
        >
          <SelectField
            v-model="form.category"
            :options="categoryOptions"
            :placeholder="$t('admin.templates.filterByCategory')"
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

      <!-- Template Variables -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('templates.form.variables') }}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            @click="addVariable"
          >
            <Plus class="h-4 w-4 mr-2" />
            {{ $t('common.create') }}
          </Button>
        </div>
        
        <div v-if="form.variables.length > 0" class="space-y-2">
          <div
            v-for="(variable, index) in form.variables"
            :key="index"
            class="flex items-center space-x-2"
          >
            <Input
              v-model="form.variables[index]"
              :placeholder="`{{ ${variable || 'variable_name'} }}`"
              class="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="removeVariable(index)"
              class="text-red-600 hover:text-red-700"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div v-else class="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('templates.form.variables') }} ({{ $t('common.buttons.create') }})
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
            v-html="sanitizeEmailContent(previewContent)"
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
          {{ $t('admin.templates.create') }}
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
  Plus, 
  X, 
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
import { useNotificationStore } from '@/stores/notifications'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', template: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { sanitizeEmailContent } = useSanitizer()

const templatesStore = useTemplatesStore()
const notificationStore = useNotificationStore()

// Reactive data
const loading = ref(false)
const contentTab = ref('html')
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  description: '',
  html_content: '',
  text_content: '',
  type: 'free',
  category: '',
  variables: [] as string[]
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

const categoryOptions = computed(() => [
  { value: 'newsletter', label: t('admin.templates.categories.newsletter') },
  { value: 'promotional', label: t('admin.templates.categories.promotional') },
  { value: 'transactional', label: t('admin.templates.categories.transactional') },
  { value: 'welcome', label: t('admin.templates.categories.welcome') }
])

const previewContent = computed(() => {
  if (!form.value.html_content) return ''
  
  let content = form.value.html_content
  
  // Replace variables with sample data for preview
  form.value.variables.forEach(variable => {
    if (variable) {
      const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g')
      content = content.replace(regex, `<span class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${variable}</span>`)
    }
  })
  
  return content
})

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
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const templateData = {
      name: form.value.name,
      description: form.value.description,
      html_content: form.value.html_content,
      text_content: form.value.text_content,
      type: form.value.type,
      variables: form.value.variables.filter(v => v.trim())
    }
    
    console.log('Submitting template data:', templateData)
    
    const template = await templatesStore.createTemplate(templateData)
    console.log('Template created successfully:', template)
    
    notificationStore.success(t('admin.templates.templateCreated'))
    emit('created', template)
    handleClose()
  } catch (error: any) {
    console.error('Failed to create template:', error)
    
    // Handle validation errors
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    
    // Show error notification
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create template'
    notificationStore.error(errorMessage)
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
    type: 'free',
    category: '',
    variables: []
  }
  errors.value = {}
  contentTab.value = 'html'
  emit('update:modelValue', false)
}

const addVariable = () => {
  form.value.variables.push('')
}

const removeVariable = (index: number) => {
  form.value.variables.splice(index, 1)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Reset form when dialog opens
    form.value = {
      name: '',
      description: '',
      html_content: '',
      text_content: '',
      type: 'free',
      category: '',
      variables: []
    }
    errors.value = {}
  }
})
</script> 