<template>
  <Modal 
    v-model="isOpen"
    :title="$t('admin.templates.import')"
    size="lg"
    @close="handleClose"
  >
    <div class="space-y-6">
      <!-- Import Methods -->
      <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          type="button"
          @click="importMethod = 'file'"
          :class="[
            'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
            importMethod === 'file'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <Upload class="h-4 w-4 mr-2" />
          {{ $t('contacts.import.file_upload') }}
        </button>
        <button
          type="button"
          @click="importMethod = 'url'"
          :class="[
            'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
            importMethod === 'url'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <Link class="h-4 w-4 mr-2" />
          {{ $t('common.labels.url') }}
        </button>
        <button
          type="button"
          @click="importMethod = 'gallery'"
          :class="[
            'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
            importMethod === 'gallery'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <Image class="h-4 w-4 mr-2" />
          {{ $t('templates.gallery') }}
        </button>
      </div>

      <!-- File Upload -->
      <div v-if="importMethod === 'file'" class="space-y-4">
        <div class="text-center">
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            :class="[
              'border-2 border-dashed rounded-lg p-8 transition-colors',
              isDragging
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            ]"
          >
            <Upload class="mx-auto h-12 w-12 text-gray-400" />
            <div class="mt-4">
              <label class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('contacts.import.drag_drop') }}
                </span>
                <input
                  type="file"
                  class="sr-only"
                  accept=".html,.json,.zip"
                  multiple
                  @change="handleFileSelect"
                />
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('admin.templates.supportedFormats') }}
            </p>
          </div>
        </div>

        <!-- File List -->
        <div v-if="selectedFiles.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('admin.templates.selectedFiles') }}
          </h4>
          <div class="space-y-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <FileText class="h-5 w-5 text-gray-400" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="removeFile(index)"
                class="text-red-600 hover:text-red-700"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- URL Import -->
      <div v-if="importMethod === 'url'" class="space-y-4">
        <FormField
          :label="$t('admin.templates.templateUrl')"
          :error="errors.url"
        >
          <Input
            v-model="importUrl"
            :placeholder="$t('admin.templates.templateUrlPlaceholder')"
            type="url"
          />
        </FormField>
        
        <div v-if="urlPreview" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {{ $t('templates.preview') }}
          </h4>
          <div class="prose max-w-none dark:prose-invert text-sm" v-html="sanitizeEmailContent(urlPreview)" />
        </div>
        
        <Button
          type="button"
          variant="outline"
          @click="previewUrl"
          :loading="loadingPreview"
          class="w-full"
        >
          <Eye class="h-4 w-4 mr-2" />
          {{ $t('templates.preview') }}
        </Button>
      </div>

      <!-- Template Gallery -->
      <div v-if="importMethod === 'gallery'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="template in galleryTemplates"
            :key="template.id"
            :class="[
              'border-2 rounded-lg p-4 cursor-pointer transition-colors',
              selectedGalleryTemplates.includes(template.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
            @click="toggleGalleryTemplate(template.id)"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <img
                  v-if="template.thumbnail"
                  :src="template.thumbnail"
                  :alt="template.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <FileText class="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ template.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ template.description }}
                </p>
                <Badge :variant="template.type === 'premium' ? 'warning' : 'default'" class="mt-1">
                  {{ $t(`admin.templates.types.${template.type}`) }}
                </Badge>
              </div>
              <Checkbox
                :checked="selectedGalleryTemplates.includes(template.id)"
                @change="toggleGalleryTemplate(template.id)"
              />
            </div>
          </div>
        </div>
        
        <div v-if="galleryTemplates.length === 0" class="text-center py-8">
          <Image class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('admin.templates.noGalleryTemplates') }}
          </p>
        </div>
      </div>

      <!-- Import Options -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">
          {{ $t('admin.templates.importOptions') }}
        </h4>
        
        <div class="space-y-3">
          <label class="flex items-center">
            <Checkbox v-model="importOptions.makeGlobal" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ $t('admin.templates.makeGlobal') }}
            </span>
          </label>
          
          <label class="flex items-center">
            <Checkbox v-model="importOptions.overwriteExisting" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ $t('admin.templates.overwriteExisting') }}
            </span>
          </label>
          
          <label class="flex items-center">
            <Checkbox v-model="importOptions.preserveIds" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ $t('admin.templates.preserveIds') }}
            </span>
          </label>
        </div>
      </div>

      <!-- Progress -->
      <div v-if="importing" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">
            {{ $t('admin.templates.importing') }}
          </span>
          <span class="text-gray-600 dark:text-gray-400">
            {{ importProgress.current }} / {{ importProgress.total }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(importProgress.current / importProgress.total) * 100}%` }"
          />
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
          :disabled="importing"
        >
          {{ $t('common.cancel') }}
        </Button>
        <Button
          @click="handleImport"
          :loading="importing"
          :disabled="!canImport"
          class="flex items-center"
        >
          <Download class="h-4 w-4 mr-2" />
          {{ $t('admin.templates.import') }}
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
  Upload, 
  Link, 
  Image, 
  FileText, 
  X, 
  Eye, 
  Download 
} from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/ui/FormField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Badge from '@/components/ui/Badge.vue'

// Stores
import { useTemplatesStore } from '@/stores/templates'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'imported', templates: any[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { sanitizeEmailContent } = useSanitizer()

const templatesStore = useTemplatesStore()

// Reactive data
const importing = ref(false)
const loadingPreview = ref(false)
const isDragging = ref(false)
const importMethod = ref('file')
const selectedFiles = ref<File[]>([])
const importUrl = ref('')
const urlPreview = ref('')
const selectedGalleryTemplates = ref<number[]>([])
const errors = ref<Record<string, string>>({})

const importOptions = ref({
  makeGlobal: false,
  overwriteExisting: false,
  preserveIds: false
})

const importProgress = ref({
  current: 0,
  total: 0
})

// Mock gallery templates (in real app, these would come from an API)
const galleryTemplates = ref([
  {
    id: 1,
    name: 'Newsletter Template',
    description: 'Modern newsletter design',
    type: 'free',
    thumbnail: null
  },
  {
    id: 2,
    name: 'Welcome Email',
    description: 'Welcome new subscribers',
    type: 'free',
    thumbnail: null
  },
  {
    id: 3,
    name: 'E-commerce Promotion',
    description: 'Product promotion template',
    type: 'premium',
    thumbnail: null
  }
])

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canImport = computed(() => {
  switch (importMethod.value) {
    case 'file':
      return selectedFiles.value.length > 0
    case 'url':
      return importUrl.value.trim() !== ''
    case 'gallery':
      return selectedGalleryTemplates.value.length > 0
    default:
      return false
  }
})

// Methods
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
}

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    const validTypes = ['.html', '.json', '.zip']
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    return validTypes.includes(extension)
  })
  
  selectedFiles.value.push(...validFiles)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const previewUrl = async () => {
  if (!importUrl.value) return
  
  loadingPreview.value = true
  try {
    // Mock preview - in real app, this would fetch and preview the URL
    urlPreview.value = '<div>Preview of template from URL...</div>'
  } catch (error) {
    console.error('Failed to preview URL:', error)
    errors.value.url = t('admin.templates.urlPreviewError')
  } finally {
    loadingPreview.value = false
  }
}

const toggleGalleryTemplate = (templateId: number) => {
  const index = selectedGalleryTemplates.value.indexOf(templateId)
  if (index > -1) {
    selectedGalleryTemplates.value.splice(index, 1)
  } else {
    selectedGalleryTemplates.value.push(templateId)
  }
}

const handleImport = async () => {
  importing.value = true
  
  try {
    let importData: any = {}
    
    switch (importMethod.value) {
      case 'file':
        importData = {
          method: 'file',
          files: selectedFiles.value,
          options: importOptions.value
        }
        importProgress.value = { current: 0, total: selectedFiles.value.length }
        break
        
      case 'url':
        importData = {
          method: 'url',
          url: importUrl.value,
          options: importOptions.value
        }
        importProgress.value = { current: 0, total: 1 }
        break
        
      case 'gallery':
        importData = {
          method: 'gallery',
          templateIds: selectedGalleryTemplates.value,
          options: importOptions.value
        }
        importProgress.value = { current: 0, total: selectedGalleryTemplates.value.length }
        break
    }
    
    // Simulate import progress
    for (let i = 0; i < importProgress.value.total; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      importProgress.value.current = i + 1
    }
    
    // In real app, call the API
    // const result = await templatesStore.importTemplates(importData)
    
    emit('imported', []) // Mock empty result
    handleClose()
  } catch (error) {
    console.error('Failed to import templates:', error)
  } finally {
    importing.value = false
  }
}

const handleClose = () => {
  selectedFiles.value = []
  importUrl.value = ''
  urlPreview.value = ''
  selectedGalleryTemplates.value = []
  errors.value = {}
  importMethod.value = 'file'
  importOptions.value = {
    makeGlobal: false,
    overwriteExisting: false,
    preserveIds: false
  }
  importProgress.value = { current: 0, total: 0 }
  emit('update:modelValue', false)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Reset when dialog opens
    handleClose()
    emit('update:modelValue', true) // Keep it open
  }
})
</script> 