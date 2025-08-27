<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <StepHeader
      title="Design Content"
      subtitle="Create your email content"
      icon="Edit"
      gradient="from-green-600 to-blue-600"
    />
    
    <!-- Content -->
    <div class="p-8">
      <!-- Content Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in contentTabs"
            :key="tab.key"
            type="button"
            @click="activeTab = tab.key"
            :class="[
              'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 hover:scale-105',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 mr-2" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- HTML Editor -->
        <div v-show="activeTab === 'html'">
          <EmailEditor
            :model-value="modelValue.html_content"
            @update:model-value="updateField('html_content', $event)"
            :variables="availableVariables"
            class="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden min-h-[400px]"
          />
        </div>
        
        <!-- Text Editor -->
        <div v-show="activeTab === 'text'">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Plain Text Version
          </label>
          <textarea
            :value="modelValue.text_content"
            @input="updateField('text_content', $event.target.value)"
            rows="12"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono text-sm"
            placeholder="Enter plain text version of your email..."
          ></textarea>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            This version will be shown to recipients whose email clients don't support HTML
          </p>
        </div>
        
        <!-- Preview -->
        <div v-show="activeTab === 'preview'">
          <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
            <div class="max-w-2xl mx-auto">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <!-- Email Header -->
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600 dark:text-gray-400">Subject:</div>
                    <div class="text-sm text-gray-500 dark:text-gray-500">Preview</div>
                  </div>
                  <div class="font-medium text-gray-900 dark:text-white mt-1">
                    {{ modelValue.subject || 'No subject' }}
                  </div>
                </div>
                
                <!-- Email Content -->
                <div class="p-6">
                  <div 
                    v-if="modelValue.html_content"
                    v-html="sanitizeEmailContent(processedHtmlContent)"
                    class="prose prose-sm max-w-none dark:prose-invert"
                  ></div>
                  <div v-else class="text-center py-12 text-gray-400 dark:text-gray-500">
                    <FileText class="w-12 h-12 mx-auto mb-3" />
                    <p>No content to preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Variables Helper -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Available Variables
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="variable in availableVariables"
            :key="variable"
            @click="insertVariable(variable)"
            class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-mono rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          >
            {{ variable }}
          </span>
        </div>
        <p class="text-xs text-blue-700 dark:text-blue-400 mt-2">
          Click on any variable to insert it into your content
        </p>
      </div>

      <!-- Test Email Section -->
      <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Send Test Email
        </h4>
        <div class="flex space-x-2">
          <input
            v-model="testEmail"
            type="email"
            placeholder="test@example.com"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            @click="sendTest"
            :disabled="!testEmail || !modelValue.html_content || testLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send v-if="!testLoading" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            <span>{{ testLoading ? 'Sending...' : 'Send Test' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Edit, FileText, Send, Loader2, Code, Eye } from 'lucide-vue-next'
import StepHeader from '@/components/campaigns/create/StepHeader.vue'
import EmailEditor from '@/components/email/EmailEditor.vue'
import { useToast } from 'vue-toastification'
import { useSanitizer } from '@/composables/useSanitizer'

interface Props {
  modelValue: {
    subject: string
    html_content: string
    text_content: string
  }
  errors: Record<string, string>
  loading?: boolean
  testLoading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'send-test', email: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const toast = useToast()
const { sanitizeEmailContent } = useSanitizer()

// Local state
const activeTab = ref('html')
const testEmail = ref('')

const contentTabs = [
  { key: 'html', label: 'HTML Editor', icon: Edit },
  { key: 'text', label: 'Text Version', icon: Code },
  { key: 'preview', label: 'Preview', icon: Eye }
]

const availableVariables = [
  '{{first_name}}',
  '{{last_name}}',
  '{{email}}',
  '{{company}}',
  '{{unsubscribe_link}}'
]

// Computed
const processedHtmlContent = computed(() => {
  // Replace variables with sample data for preview
  return props.modelValue.html_content
    .replace(/\{\{first_name\}\}/g, 'John')
    .replace(/\{\{last_name\}\}/g, 'Doe')
    .replace(/\{\{email\}\}/g, 'john@example.com')
    .replace(/\{\{company\}\}/g, 'Acme Corp')
    .replace(/\{\{unsubscribe_link\}\}/g, '#unsubscribe')
})

// Methods
const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

const insertVariable = (variable: string) => {
  // This would insert the variable at cursor position in the editor
  // For now, just append it to the content
  const currentContent = props.modelValue.html_content
  updateField('html_content', currentContent + variable)
}

const sendTest = async () => {
  if (!testEmail.value || !props.modelValue.html_content) return
  
  try {
    emit('send-test', testEmail.value)
    // Success handling is done in parent component
  } catch (error) {
    toast.error('Failed to send test email')
  }
}
</script>