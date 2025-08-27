<template>
  <div class="email-template-editor">
    <!-- Editor Container -->
    <div class="editor-header">
      <div class="flex justify-between items-center p-4 bg-white border-b">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ editMode ? 'Edit Template' : 'Create Template' }}
        </h2>
        <div class="flex gap-2">
          <Button variant="outline" @click="previewTemplate" :disabled="loading">
            <Eye class="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" @click="testTemplate" :disabled="loading">
            <Send class="w-4 h-4 mr-2" />
            Test Send
          </Button>
          <Button @click="saveTemplate" :disabled="loading">
            <Save class="w-4 h-4 mr-2" />
            {{ loading ? 'Saving...' : 'Save Template' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Template Meta Information -->
    <div class="template-meta p-4 bg-gray-50 border-b">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
          <input
            v-model="templateData.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter template name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="templateData.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="newsletter">Newsletter</option>
            <option value="promotional">Promotional</option>
            <option value="transactional">Transactional</option>
            <option value="announcement">Announcement</option>
            <option value="welcome">Welcome</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
          <input
            v-model="templateData.subject"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email subject line"
          />
        </div>
      </div>
    </div>

    <!-- Unlayer Editor Container -->
    <div class="editor-container">
      <!-- Unlayer Editor -->
      <div id="unlayer-editor" class="min-h-[600px]"></div>
      
      <!-- Fallback HTML Editor (when Unlayer fails to load) -->
      <div v-if="!editor" class="fallback-editor min-h-[600px] border rounded-lg p-4">
        <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h3 class="text-sm font-medium text-yellow-800">Visual Editor Loading</h3>
              <p class="text-sm text-yellow-700">The visual editor is loading. You can use this HTML editor as a fallback.</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HTML Content</label>
            <textarea
              v-model="templateData.html_content"
              class="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="Enter your HTML template content here..."
            ></textarea>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="previewFallbackTemplate"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Preview HTML
            </button>
            <button
              @click="initializeEditor"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Retry Visual Editor
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Template Preview</h3>
          <Button variant="ghost" @click="showPreview = false">
            <X class="w-4 h-4" />
          </Button>
        </div>
        <div class="flex-1 overflow-auto p-4">
          <div class="border rounded-lg">
            <iframe
              :src="previewUrl"
              class="w-full h-[600px] border-0"
              sandbox="allow-same-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Email Modal -->
    <div v-if="showTestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Send Test Email</h3>
          <Button variant="ghost" @click="showTestModal = false">
            <X class="w-4 h-4" />
          </Button>
        </div>
        <div class="p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
          <input
            v-model="testEmail"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="test@example.com"
          />
          <div class="flex justify-end mt-4 gap-2">
            <Button variant="outline" @click="showTestModal = false">Cancel</Button>
            <Button @click="sendTestEmail" :disabled="!testEmail || sendingTest">
              {{ sendingTest ? 'Sending...' : 'Send Test' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { Eye, Send, Save, X } from 'lucide-vue-next'
import { useNotifications } from '@/composables/useNotifications'
import { templateEditorApi } from '@/services/templateEditor.api'

// Props
interface Props {
  templateId?: string | number
  editMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false
})

// Composables
const router = useRouter()
const route = useRoute()
const { addNotification } = useNotifications()

// Helper function to match the expected API
const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  addNotification({
    id: Date.now().toString(),
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message,
    type,
    timestamp: new Date(),
    read: false
  })
}

// Reactive data
const editor = ref<any>(null)
const loading = ref(false)
const showPreview = ref(false)
const isInitializing = ref(false)
const isInitialized = ref(false)
const showTestModal = ref(false)
const previewUrl = ref('')
const testEmail = ref('')
const sendingTest = ref(false)
const lastEditorContent = ref('')

const templateData = ref({
  id: null,
  name: '',
  category: '',
  description: '',
  subject: '',
  html_content: '<p>Start creating your email template...</p>',
  text_content: '',
  type: 'free',
  is_premium: false,
  credit_cost: 0,
  variables: [],
  design: null,
  thumbnail: ''
})

// Initialize Unlayer
const initializeEditor = () => {
  // Prevent multiple initialization attempts
  if (isInitializing.value || isInitialized.value) {
    return
  }
  
  isInitializing.value = true
  
  // Load Unlayer script
  if (!window.unlayer) {
    const script = document.createElement('script')
    script.src = 'https://editor.unlayer.com/embed.js'
    script.onload = () => {
      // Wait a bit for the script to fully initialize
      setTimeout(() => {
        setupEditor()
      }, 100)
    }
    script.onerror = () => {
      isInitializing.value = false
      showNotification('Failed to load email editor. Please check your internet connection.', 'error')
    }
    document.head.appendChild(script)
  } else {
    setupEditor()
  }
}

const setupEditor = () => {
  try {
    if (!window.unlayer) {
      showNotification('Unlayer editor not available', 'error')
      return
    }

    const projectId = import.meta.env.VITE_APP_UNLAYER_PROJECT_ID
    if (!projectId || projectId === 'your_project_id_here' || projectId === '12345') {
      console.warn('Using demo Unlayer project ID. Get a real one from https://unlayer.com')
    }

    // Initialize Unlayer editor - it doesn't return an instance, it works globally
    window.unlayer.init({
      id: 'unlayer-editor',
      projectId: projectId || '12345', // Fallback to demo ID
      displayMode: 'email',
      appearance: {
        theme: 'light',
        panels: {
          tools: {
            dock: 'left'
          }
        }
      },
      features: {
        preview: false, // We'll handle preview ourselves
        export: false   // We'll handle export ourselves
      },
      tools: {
        image: {
          enabled: true,
          properties: {
            src: {
              value: 'https://via.placeholder.com/600x400'
            }
          }
        }
      },
      blocks: [], // Custom blocks can be added here
      body: {
        rows: [],
        values: {
          backgroundColor: '#ffffff',
          contentWidth: '600px'
        }
      }
    })

    // Store the reference to unlayer globally for later use
    editor.value = window.unlayer

    // Set up event listeners using the callback system
    window.unlayer.registerCallback('editor:loaded', () => {
      console.log('Unlayer editor loaded successfully')
      isInitialized.value = true
      isInitializing.value = false
      
      // Load existing template if in edit mode
      if (props.editMode && props.templateId) {
        loadTemplate()
      }
    })

    window.unlayer.registerCallback('design:updated', handleDesignUpdate)
    window.unlayer.registerCallback('design:loaded', handleDesignLoaded)
  } catch (error) {
    console.error('Failed to initialize Unlayer editor:', error)
    isInitializing.value = false
    showNotification('Failed to initialize email editor', 'error')
  }
}

// Helper function to safely extract content from Unlayer
const extractEditorContent = () => {
  try {
    if (!editor.value || !window.unlayer) {
      return templateData.value.html_content || ''
    }

    // Try to get HTML directly from the editor DOM
    const editorElement = document.getElementById('unlayer-editor')
    const iframe = editorElement?.querySelector('iframe')
    
    if (iframe && iframe.contentDocument) {
      const iframeBody = iframe.contentDocument.body
      if (iframeBody && iframeBody.innerHTML.trim()) {
        const content = iframeBody.innerHTML
        lastEditorContent.value = content
        return content
      }
    }
    
    return lastEditorContent.value || templateData.value.html_content || ''
  } catch (error) {
    console.warn('Could not extract content from Unlayer:', error)
    return lastEditorContent.value || templateData.value.html_content || ''
  }
}

const handleDesignUpdate = (updates: any) => {
  // Update content tracking
  try {
    const content = extractEditorContent()
    if (content) {
      templateData.value.html_content = content
    }
  } catch (error) {
    console.warn('Failed to update content on design change:', error)
  }
  
  // Auto-save design changes
  if (templateData.value.id) {
    debounceAutoSave()
  }
}

const handleDesignLoaded = () => {
  console.log('Design loaded successfully')
}

// Debounced auto-save
let autoSaveTimeout: NodeJS.Timeout | null = null
const debounceAutoSave = () => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  autoSaveTimeout = setTimeout(() => {
    if (templateData.value.id) {
      autoSaveTemplate()
    }
  }, 3000) // Auto-save after 3 seconds of inactivity
}

const autoSaveTemplate = async () => {
  try {
    editor.value.exportHtml((data: any) => {
      templateData.value.html_content = data.html
      templateData.value.design = data.design
      // Save silently without notification
      templateEditorApi.updateTemplate(templateData.value.id, templateData.value)
    })
  } catch (error) {
    console.error('Auto-save failed:', error)
  }
}

const loadTemplate = async () => {
  try {
    loading.value = true
    const response = await templateEditorApi.getTemplate(props.templateId)
    templateData.value = response.data

    // Load design into editor
    if (templateData.value.design) {
      editor.value.loadDesign(templateData.value.design)
    }
  } catch (error) {
    showNotification('Failed to load template', 'error')
    console.error('Load template error:', error)
  } finally {
    loading.value = false
  }
}

const saveTemplate = async () => {
  try {
    loading.value = true

    if (!templateData.value.name.trim()) {
      showNotification('Please enter a template name', 'warning')
      loading.value = false
      return
    }

    // Get the latest content using our safe extraction method
    const htmlContent = extractEditorContent()
    const designData = templateData.value.design

    // Save with the extracted or fallback content
    await saveTemplateData(htmlContent, designData)
  } catch (error) {
    loading.value = false
    showNotification('Failed to save template', 'error')
    console.error('Save template error:', error)
  }
}

const saveTemplateData = async (htmlContent: string, designData: any) => {
  try {
    // Ensure required fields are present
    const saveData = {
      name: templateData.value.name || 'Untitled Template',
      description: templateData.value.description || '',
      html_content: htmlContent || '<p>Empty template</p>',
      text_content: templateData.value.text_content || '',
      subject: templateData.value.subject || '',
      type: templateData.value.type || 'free',
      category: templateData.value.category || '',
      is_premium: templateData.value.is_premium || false,
      credit_cost: templateData.value.credit_cost || 0,
      design: designData,
      variables: templateData.value.variables || []
    }

    // Update local template data
    Object.assign(templateData.value, saveData)

    // Generate thumbnail if Unlayer editor is available
    if (editor.value && designData) {
      try {
        editor.value.exportImage((imageData: any) => {
          templateData.value.thumbnail = imageData.url
        })
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error)
      }
    }

    let response
    if (templateData.value.id) {
      // Update existing template
      response = await templateEditorApi.updateTemplate(templateData.value.id, saveData)
      showNotification('Template updated successfully', 'success')
    } else {
      // Create new template
      response = await templateEditorApi.createTemplate(saveData)
      templateData.value.id = response.data.id
      showNotification('Template created successfully', 'success')
      
      // Update URL to edit mode
      router.replace({
        name: 'EditVisualTemplate',
        params: { id: response.data.id }
      })
    }

    // Notify parent window if opened from template creation
    if (window.opener && !window.opener.closed) {
      try {
        // Ensure all data is serializable
        const messageData = {
          type: 'template_saved',
          html_content: String(templateData.value.html_content || ''),
          design: templateData.value.design ? JSON.parse(JSON.stringify(templateData.value.design)) : null,
          name: String(templateData.value.name || ''),
          category: String(templateData.value.category || ''),
          subject: String(templateData.value.subject || ''),
          templateId: templateData.value.id ? Number(templateData.value.id) : null
        }
        
        window.opener.postMessage(messageData, window.location.origin)
      } catch (error) {
        console.error('Failed to notify parent window:', error)
        // Don't show error to user as this is not critical
      }
    }
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Failed to save template', 'error')
    console.error('Save template error:', error)
  } finally {
    loading.value = false
  }
}

const previewTemplate = () => {
  try {
    const htmlContent = extractEditorContent()

    if (!htmlContent.trim()) {
      showNotification('No content to preview', 'warning')
      return
    }
    
    // Create a blob URL for preview
    const blob = new Blob([htmlContent], { type: 'text/html' })
    previewUrl.value = URL.createObjectURL(blob)
    showPreview.value = true
  } catch (error) {
    console.error('Preview error:', error)
    showNotification('Failed to create preview', 'error')
  }
}

const testTemplate = () => {
  showTestModal.value = true
}

const previewFallbackTemplate = () => {
  if (!templateData.value.html_content.trim()) {
    showNotification('Please enter some HTML content first', 'warning')
    return
  }
  
  // Create a blob URL for preview
  const blob = new Blob([templateData.value.html_content], { type: 'text/html' })
  previewUrl.value = URL.createObjectURL(blob)
  showPreview.value = true
}

const sendTestEmail = async () => {
  try {
    sendingTest.value = true

    const htmlContent = extractEditorContent()

    if (!htmlContent.trim()) {
      showNotification('No content to send', 'warning')
      sendingTest.value = false
      return
    }

    await templateEditorApi.sendTestEmail({
      html_content: htmlContent,
      subject: templateData.value.subject || 'Test Email',
      to_email: testEmail.value
    })

    showNotification('Test email sent successfully', 'success')
    showTestModal.value = false
    testEmail.value = ''
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Failed to send test email', 'error')
  } finally {
    sendingTest.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Load data from session storage if available (for integration)
  const editorData = sessionStorage.getItem('template_editor_data')
  if (editorData) {
    try {
      const data = JSON.parse(editorData)
      templateData.value.name = data.name || ''
      templateData.value.category = data.category || ''
      templateData.value.subject = data.subject || ''
      if (data.templateId) {
        templateData.value.id = data.templateId
      }
      // Clear session storage after loading
      sessionStorage.removeItem('template_editor_data')
    } catch (error) {
      console.error('Failed to load editor data from session storage:', error)
    }
  }
  
  initializeEditor()
})

onUnmounted(() => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId && newId !== templateData.value.id) {
    loadTemplate()
  }
})
</script>

<style scoped>
.email-template-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.editor-container {
  flex: 1;
  background: white;
  overflow: hidden;
}

#unlayer-editor {
  height: 100%;
  width: 100%;
}

/* Custom scrollbar for preview */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
