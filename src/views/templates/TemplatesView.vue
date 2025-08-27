<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Template' : $t('templates.create') }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ isEditing ? 'Update your email template.' : 'Design a reusable email template for your campaigns.' }}
        </p>
      </div>
    </div>

    <!-- Template form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <Card title="Template Information">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="form.data.name"
              :label="$t('templates.form.name')"
              :placeholder="$t('templates.form.name')"
              :error="form.errors.name"
              required
            />
            
            <div>
              <label class="form-label">Category</label>
              <select v-model="form.data.category" class="input w-full">
                <option value="">Select category</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="transactional">Transactional</option>
                <option value="announcement">Announcement</option>
                <option value="welcome">Welcome</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="form.data.description"
              class="input w-full"
              rows="3"
              placeholder="Brief description of this template..."
            ></textarea>
          </div>

          <div>
            <label class="form-label">Tags</label>
            <TagInput v-model="form.data.tags" placeholder="Add tags..." />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add tags to help organize and find your templates
            </p>
          </div>
        </div>
      </Card>

      <!-- Template Design -->
      <Card title="Template Design">
        <div class="space-y-4">
          <!-- Design tabs -->
          <Tabs :tabs="designTabs" v-model="activeDesignTab">
            <template v-slot="{ activeTab }">
              <!-- Drag & Drop Editor -->
              <div v-show="activeTab === 'drag-drop'" class="mt-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Professional Drag & Drop Editor
                      </h3>
                      <div class="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        Use our advanced visual editor to create professional email templates with drag-and-drop ease.
                        <button 
                          @click="openDragDropEditor"
                          class="ml-2 font-medium underline hover:text-blue-600"
                        >
                          Launch Editor →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Template Info Display -->
                <div v-if="form.data.html_content" class="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">Current Template</h4>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p>✅ Template content: {{ form.data.html_content ? 'Ready' : 'Not set' }}</p>
                    <p>✅ Last modified: {{ new Date().toLocaleDateString() }}</p>
                    <div class="mt-3 flex gap-2">
                      <button 
                        @click="openDragDropEditor"
                        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Edit in Visual Editor
                      </button>
                      <button 
                        @click="activeDesignTab = 'preview'"
                        class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Preview Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Visual Builder -->
              <div v-show="activeTab === 'builder'" class="mt-4">
                <TemplateBuilder
                  v-model="form.data.html_content"
                  :blocks="availableBlocks"
                  :variables="availableVariables"
                  @preview="showPreview = true"
                />
              </div>
              
              <!-- HTML Editor -->
              <div v-show="activeTab === 'html'" class="mt-4">
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="form-label">HTML Content</label>
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline" @click="insertVariable">
                        Insert Variable
                      </Button>
                      <Button size="sm" variant="outline" @click="formatHTML">
                        Format HTML
                      </Button>
                    </div>
                  </div>
                  <CodeEditor
                    v-model="form.data.html_content"
                    language="html"
                    :height="400"
                    placeholder="Enter your HTML template..."
                  />
                </div>
                
                <!-- Variable reference -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Available Variables:
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <code
                      v-for="variable in availableVariables"
                      :key="variable"
                      @click="insertVariableIntoHTML(variable)"
                      class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {{ variable }}
                    </code>
                  </div>
                </div>
              </div>
              
              <!-- Preview -->
              <div v-show="activeTab === 'preview'" class="mt-4">
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <!-- Preview header -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                      Email Preview
                    </h4>
                    <div class="flex space-x-2">
                      <Button size="sm" variant="outline" @click="sendTestEmail">
                        Send Test
                      </Button>
                      <select v-model="previewDevice" class="text-sm border border-gray-300 dark:border-gray-600 rounded">
                        <option value="desktop">Desktop</option>
                        <option value="mobile">Mobile</option>
                      </select>
                    </div>
                  </div>
                  
                  <!-- Preview content -->
                  <div 
                    :class="[
                      'p-4',
                      previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''
                    ]"
                  >
                    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                      <div class="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
                        <div class="text-sm text-gray-600 dark:text-gray-400">Subject: Email Template Preview</div>
                      </div>
                      <div class="p-4">
                        <div v-html="sanitizeEmailContent(processedPreviewContent)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Tabs>
        </div>
      </Card>

      <!-- Template Settings -->
      <Card title="Template Settings">
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="form.data.is_public"
                type="checkbox"
                class="mr-2"
              />
              Make this template public
            </label>
          </div>
          
          <div v-if="form.data.is_public" class="ml-6 text-sm text-gray-600 dark:text-gray-400">
            Public templates can be used by other users in your organization
          </div>

          <!-- Thumbnail upload -->
          <div>
            <label class="form-label">Template Thumbnail</label>
            <FileUpload
              v-model="thumbnailFile"
              accept="image/*"
              @file-selected="handleThumbnailSelected"
              class="mb-2"
            />
            <div v-if="form.data.thumbnail" class="mt-2">
              <img 
                :src="form.data.thumbnail" 
                alt="Template thumbnail" 
                class="w-32 h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Form actions -->
      <div class="flex justify-between">
        <Button
          type="button"
          variant="outline"
          @click="$router.back()"
        >
          {{ $t('common.buttons.cancel') }}
        </Button>
        
        <div class="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            @click="saveDraft"
            :loading="form.loading && isDraft"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            :loading="form.loading && !isDraft"
          >
            {{ isEditing ? 'Update Template' : 'Create Template' }}
          </Button>
        </div>
      </div>
    </form>

    <!-- Send Test Email Modal -->
    <Modal
      :show="showTestModal"
      title="Send Test Email"
      @close="showTestModal = false"
    >
      <div class="space-y-4">
        <Input
          v-model="testEmail"
          type="email"
          label="Test Email Address"
          placeholder="test@example.com"
          required
        />
        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showTestModal = false">
            Cancel
          </Button>
          <Button 
            @click="performSendTest" 
            :loading="sendingTest"
            :disabled="!testEmail"
          >
            Send Test
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSanitizer } from '@/composables/useSanitizer'
import { useTemplatesStore } from '@/stores/templates'
import { useUIStore } from '@/stores/ui'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Tabs from '@/components/ui/Tabs.vue'
import FileUpload from '@/components/ui/FileUpload.vue'
import TagInput from '@/components/ui/TagInput.vue'
import CodeEditor from '@/components/ui/CodeEditor.vue'
import TemplateBuilder from '@/components/common/TemplateBuilder.vue'
import { PaintBrushIcon, CodeBracketIcon, EyeIcon, DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import type { CreateTemplateData } from '@/types/templates'

const router = useRouter()
const route = useRoute()
const { sanitizeEmailContent } = useSanitizer()
const templatesStore = useTemplatesStore()
const uiStore = useUIStore()

const isEditing = computed(() => !!route.params.id)
const templateId = computed(() => isEditing.value ? Number(route.params.id) : null)

const form = useForm<CreateTemplateData>({
  name: '',
  description: '',
  category: '',
  html_content: '',
  thumbnail: '',
  tags: [],
  is_public: false
})

const activeDesignTab = ref('drag-drop')
const previewDevice = ref('desktop')
const showTestModal = ref(false)
const testEmail = ref('')
const sendingTest = ref(false)
const isDraft = ref(false)
const thumbnailFile = ref<File | null>(null)

const designTabs = [
  { key: 'drag-drop', label: 'Drag & Drop Editor', icon: PaintBrushIcon },
  { key: 'builder', label: 'Visual Builder', icon: PaintBrushIcon },
  { key: 'html', label: 'HTML Editor', icon: CodeBracketIcon },
  { key: 'preview', label: 'Preview', icon: EyeIcon }
]

const availableBlocks = [
  { type: 'header', name: 'Header', icon: '📄' },
  { type: 'text', name: 'Text Block', icon: '📝' },
  { type: 'image', name: 'Image', icon: '🖼️' },
  { type: 'button', name: 'Button', icon: '🔘' },
  { type: 'divider', name: 'Divider', icon: '➖' },
  { type: 'social', name: 'Social Links', icon: '📱' },
  { type: 'footer', name: 'Footer', icon: '📋' }
]

const availableVariables = [
  '{{first_name}}',
  '{{last_name}}',
  '{{full_name}}',
  '{{email}}',
  '{{company}}',
  '{{unsubscribe_link}}',
  '{{campaign_name}}',
  '{{current_date}}'
]

const processedPreviewContent = computed(() => {
  let content = form.data.html_content || '<p>No content yet. Start designing your template!</p>'
  
  // Replace variables with sample data for preview
  const sampleData = {
    '{{first_name}}': 'John',
    '{{last_name}}': 'Doe',
    '{{full_name}}': 'John Doe',
    '{{email}}': 'john.doe@example.com',
    '{{company}}': 'Acme Corp',
    '{{unsubscribe_link}}': '#unsubscribe',
    '{{campaign_name}}': 'Sample Campaign',
    '{{current_date}}': new Date().toLocaleDateString()
  }
  
  for (const [variable, value] of Object.entries(sampleData)) {
    content = content.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return content
})

const insertVariable = () => {
  // TODO: Show variable picker modal
  console.log('Insert variable')
}

const insertVariableIntoHTML = (variable: string) => {
  // TODO: Insert variable at cursor position in HTML editor
  console.log('Insert variable:', variable)
}

const formatHTML = () => {
  // TODO: Format HTML content
  console.log('Format HTML')
}

const sendTestEmail = () => {
  showTestModal.value = true
}

const performSendTest = async () => {
  if (!testEmail.value) return
  
  try {
    sendingTest.value = true
    await templatesStore.sendTestEmail(templateId.value, testEmail.value, {
      html_content: form.data.html_content,
      subject: 'Template Test Email'
    })
    showTestModal.value = false
    testEmail.value = ''
  } catch (error) {
    // Error handled by store
  } finally {
    sendingTest.value = false
  }
}

const handleThumbnailSelected = async (file: File) => {
  thumbnailFile.value = file
  
  // Upload thumbnail
  try {
    const uploadedUrl = await templatesStore.uploadThumbnail(file)
    form.data.thumbnail = uploadedUrl
  } catch (error) {
    console.error('Failed to upload thumbnail:', error)
  }
}

const saveDraft = async () => {
  isDraft.value = true
  try {
    const templateData = { ...form.data, is_draft: true }
    
    if (isEditing.value) {
      await form.submit(
        (data) => templatesStore.updateTemplate(templateId.value!, data),
        'Template draft saved',
        'Failed to save draft'
      )
    } else {
      await form.submit(
        (data) => templatesStore.createTemplate(templateData),
        'Template draft saved',
        'Failed to save draft'
      )
      router.push('/templates')
    }
  } catch (error) {
    // Error handled by form
  } finally {
    isDraft.value = false
  }
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await form.submit(
        (data) => templatesStore.updateTemplate(templateId.value!, data),
        'Template updated successfully',
        'Failed to update template'
      )
    } else {
      await form.submit(
        (data) => templatesStore.createTemplate(data),
        'Template created successfully',
        'Failed to create template'
      )
    }

    router.push('/templates')
  } catch (error) {
    // Error handled by form
  }
}

// Load template data if editing
watch(() => route.params.id, async (newId) => {
  if (newId && isEditing.value) {
    try {
      const template = await templatesStore.getTemplate(Number(newId))
      form.setData({
        name: template.name,
        description: template.description || '',
        category: template.category || '',
        html_content: template.html_content,
        thumbnail: template.thumbnail || '',
        tags: template.tags || [],
        is_public: template.is_public || false
      })
    } catch (error) {
      console.error('Failed to load template:', error)
      router.push('/templates')
    }
  }
}, { immediate: true })

// Open drag and drop editor in new window/tab
const openDragDropEditor = () => {
  // Store current template data in sessionStorage for the editor
  const editorData = {
    templateId: templateId.value,
    name: form.data.name,
    category: form.data.category,
    description: form.data.description,
    subject: form.data.subject,
    html_content: form.data.html_content,
    isEditing: isEditing.value
  }
  
  sessionStorage.setItem('template_editor_data', JSON.stringify(editorData))
  
  // Open editor in new tab
  const editorUrl = isEditing.value 
    ? `/templates/visual-editor/${templateId.value}`
    : `/templates/visual-editor`
    
  const editorWindow = window.open(editorUrl, '_blank')
  
  // Listen for messages from the editor window
  const handleEditorMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return
    
    if (event.data.type === 'template_saved') {
      // Update current form with saved template data
      form.data.html_content = event.data.html_content
      form.data.design = event.data.design
      
      if (event.data.name) form.data.name = event.data.name
      if (event.data.category) form.data.category = event.data.category
      if (event.data.subject) form.data.subject = event.data.subject
      
      // Show success message
      console.log('Template updated from visual editor')
      
      // Close editor window
      if (editorWindow) {
        editorWindow.close()
      }
    }
  }
  
  window.addEventListener('message', handleEditorMessage)
  
  // Clean up event listener when editor is closed
  const checkClosed = setInterval(() => {
    if (editorWindow?.closed) {
      window.removeEventListener('message', handleEditorMessage)
      clearInterval(checkClosed)
    }
  }, 1000)
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: $t('templates.title'), to: '/templates' },
    { label: isEditing.value ? 'Edit Template' : $t('templates.create') }
  ])
})
</script>