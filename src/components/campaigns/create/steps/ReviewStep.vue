<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <StepHeader
      title="Review & Send"
      subtitle="Final review before sending your campaign"
      icon="Send"
      gradient="from-orange-600 to-red-600"
    />
    
    <!-- Content -->
    <div class="p-8 space-y-8">
      <!-- Campaign Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Campaign Details -->
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Campaign Details
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Campaign Name
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ modelValue.name || 'Untitled Campaign' }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Type class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Subject Line
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ modelValue.subject || 'No subject' }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Users class="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Recipients
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ selectedContactList?.name || 'No list selected' }}
                    <span v-if="selectedContactList" class="text-gray-500">
                      ({{ formatNumber(selectedContactList.contacts_count) }} contacts)
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Calendar class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Send Time
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ sendTimeText }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Send Options -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Send Options
            </h3>
            
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input
                  :checked="sendOption === 'now'"
                  @change="updateSendOption('now')"
                  type="radio"
                  name="send_option"
                  class="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-600 focus:ring-2"
                />
                <div class="flex items-center space-x-2">
                  <Send class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                  <span class="font-medium text-gray-900 dark:text-white">Send Now</span>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input
                  :checked="sendOption === 'later'"
                  @change="updateSendOption('later')"
                  type="radio"
                  name="send_option"
                  class="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-600 focus:ring-2"
                />
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                  <span class="font-medium text-gray-900 dark:text-white">Schedule for Later</span>
                </div>
              </label>
            </div>
            
            <!-- Schedule DateTime -->
            <div v-if="sendOption === 'later'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Date & Time
              </label>
              <input
                :value="modelValue.scheduled_at"
                @input="updateField('scheduled_at', $event.target.value)"
                type="datetime-local"
                :min="minDateTime"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <!-- Right Column - Email Preview -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Email Preview
          </h3>
          
          <div class="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            <!-- Email Header -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      Your Company
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      noreply@yourcompany.com
                    </div>
                  </div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(new Date()) }}
                </div>
              </div>
              
              <div class="mt-2">
                <div class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ modelValue.subject || 'No subject' }}
                </div>
              </div>
            </div>
            
            <!-- Email Content -->
            <div class="p-4 max-h-96 overflow-y-auto">
              <div 
                v-if="modelValue.html_content"
                v-html="sanitizeEmailContent(previewContent)"
                class="prose prose-sm max-w-none dark:prose-invert"
              ></div>
              <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500">
                <FileText class="w-8 h-8 mx-auto mb-2" />
                <p class="text-sm">No content to preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Campaign Statistics Prediction -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp class="w-5 h-5 mr-2 text-blue-600" />
          Expected Results
        </h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ formatNumber(recipientCount) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Recipients</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ formatNumber(Math.round(recipientCount * 0.25)) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Est. Opens</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ formatNumber(Math.round(recipientCount * 0.05)) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Est. Clicks</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ recipientCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Credits Used</div>
          </div>
        </div>
        
        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          * Estimates based on industry averages. Actual results may vary.
        </div>
      </div>

      <!-- Final Check Warnings -->
      <div v-if="warnings.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
        <div class="flex items-start">
          <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div class="flex-1">
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Please Review
            </h4>
            <ul class="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li v-for="warning in warnings" :key="warning">• {{ warning }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSanitizer } from '@/composables/useSanitizer'
import { 
  Send, 
  Clock, 
  Mail, 
  Type, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-vue-next'
import StepHeader from '@/components/campaigns/create/StepHeader.vue'
import { useContactsStore } from '@/stores/contacts'

interface Props {
  modelValue: {
    name: string
    subject: string
    contact_list_id: number | null
    html_content: string
    text_content: string
    scheduled_at?: string
  }
  errors: Record<string, string>
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Store
const contactsStore = useContactsStore()
const { sanitizeEmailContent } = useSanitizer()

// Local state
const sendOption = ref<'now' | 'later'>('now')

// Helper functions
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Computed
const selectedContactList = computed(() => {
  if (!props.modelValue.contact_list_id) return null
  return contactsStore.contactLists.find(list => list.id === props.modelValue.contact_list_id)
})

const recipientCount = computed(() => {
  return selectedContactList.value?.contacts_count || 0
})

const sendTimeText = computed(() => {
  if (sendOption.value === 'now') {
    return 'Send immediately'
  } else if (props.modelValue.scheduled_at) {
    return `Scheduled for ${formatDate(new Date(props.modelValue.scheduled_at))}`
  } else {
    return 'Schedule for later'
  }
})

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // Minimum 5 minutes from now
  return now.toISOString().slice(0, 16)
})

const previewContent = computed(() => {
  // Replace variables with sample data for preview
  return props.modelValue.html_content
    .replace(/\{\{first_name\}\}/g, 'John')
    .replace(/\{\{last_name\}\}/g, 'Doe')
    .replace(/\{\{email\}\}/g, 'john@example.com')
    .replace(/\{\{company\}\}/g, 'Acme Corp')
    .replace(/\{\{unsubscribe_link\}\}/g, '#unsubscribe')
})

const warnings = computed(() => {
  const warnings: string[] = []
  
  if (!props.modelValue.name?.trim()) {
    warnings.push('Campaign name is required')
  }
  
  if (!props.modelValue.subject?.trim()) {
    warnings.push('Email subject is required')
  }
  
  if (!props.modelValue.contact_list_id) {
    warnings.push('Please select a contact list')
  }
  
  if (!props.modelValue.html_content?.trim()) {
    warnings.push('Email content is required')
  }
  
  if (sendOption.value === 'later' && !props.modelValue.scheduled_at) {
    warnings.push('Please select a schedule date and time')
  }
  
  if (props.modelValue.subject && props.modelValue.subject.length > 50) {
    warnings.push('Subject line is quite long - consider shortening it')
  }
  
  if (recipientCount.value === 0) {
    warnings.push('The selected contact list has no contacts')
  }
  
  return warnings
})

// Methods
const updateSendOption = (option: 'now' | 'later') => {
  sendOption.value = option
  if (option === 'now') {
    updateField('scheduled_at', undefined)
  }
}

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Initialize
onMounted(async () => {
  if (contactsStore.contactLists.length === 0) {
    await contactsStore.fetchContactLists()
  }
})
</script>

<style scoped>
/* Custom scrollbar for preview */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Animate warnings */
.bg-yellow-50 {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>