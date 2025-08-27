<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
        <div class="bg-white dark:bg-gray-800">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ template.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ template.description }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <Badge v-if="template.is_premium" variant="warning" size="sm">
                  Premium - {{ template.credit_cost }} Credits
                </Badge>
                <Badge v-else variant="success" size="sm">Free</Badge>
                <Badge v-if="template.is_featured" variant="info" size="sm">Featured</Badge>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- View Mode Toggle -->
              <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  @click="viewMode = 'desktop'"
                  :class="[
                    'flex items-center px-3 py-1 rounded text-sm transition-colors',
                    viewMode === 'desktop' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <Monitor class="w-4 h-4 mr-1" />
                  Desktop
                </button>
                <button
                  @click="viewMode = 'mobile'"
                  :class="[
                    'flex items-center px-3 py-1 rounded text-sm transition-colors',
                    viewMode === 'mobile' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  ]"
                >
                  <Smartphone class="w-4 h-4 mr-1" />
                  Mobile
                </button>
              </div>
              
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Preview Content -->
          <div class="relative bg-gray-100 dark:bg-gray-900 min-h-96">
            <!-- Loading overlay -->
            <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center z-10">
              <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading preview...</span>
              </div>
            </div>

            <!-- Preview iframe container -->
            <div :class="[
              'transition-all duration-300 mx-auto',
              viewMode === 'mobile' ? 'max-w-sm' : 'max-w-full'
            ]" style="min-height: 600px;">
              <div class="bg-white dark:bg-gray-800 h-full" :class="{ 'shadow-lg mx-4 my-8 rounded-lg overflow-hidden': viewMode === 'mobile' }">
                <!-- Safe HTML content rendering -->
                <div 
                  v-if="!loading && sanitizedContent"
                  v-html="sanitizedContent"
                  class="template-preview"
                  style="max-width: 100%; overflow-x: auto;"
                ></div>
                
                <!-- Fallback if no content -->
                <div v-else-if="!loading" class="p-8 text-center">
                  <FileX class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Preview Available</h3>
                  <p class="text-gray-500 dark:text-gray-400">
                    The template content could not be loaded for preview.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <Eye class="w-4 h-4 mr-1" />
                <span>{{ formatNumber(template.views || 0) }} views</span>
              </div>
              <div class="flex items-center">
                <Download class="w-4 h-4 mr-1" />
                <span>{{ formatNumber(template.downloads || 0) }} downloads</span>
              </div>
              <div v-if="template.rating" class="flex items-center">
                <Star class="w-4 h-4 mr-1 text-yellow-500" />
                <span>{{ template.rating }}/5</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button
                v-if="template.is_premium && !template.is_purchased"
                @click="$emit('purchase', template)"
                :disabled="!canAfford"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  canAfford
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <CreditCard class="w-4 h-4 mr-2 inline" />
                Purchase ({{ template.credit_cost }} credits)
              </button>
              
              <button
                @click="$emit('select', template)"
                :disabled="template.is_premium && !template.is_purchased && !canAfford"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check class="w-4 h-4 mr-2 inline" />
                Use This Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  X, Monitor, Smartphone, Eye, Download, Star, CreditCard, Check, FileX
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import { useSanitizer } from '@/composables/useSanitizer'

const props = defineProps<{
  template: any
}>()

defineEmits<{
  close: []
  select: [template: any]
  purchase: [template: any]
}>()

const { sanitizeEmailContent } = useSanitizer()

const loading = ref(true)
const viewMode = ref('desktop')

// Mock user credits - in real app, get from store
const userCredits = ref(250)

const sanitizedContent = computed(() => {
  if (!props.template.html_content) return null
  
  // Replace placeholder variables with sample data
  let content = props.template.html_content
    .replace(/\{\{first_name\}\}/g, 'John')
    .replace(/\{\{last_name\}\}/g, 'Doe')
    .replace(/\{\{email\}\}/g, 'john@example.com')
    .replace(/\{\{company\}\}/g, 'Your Company')
  
  return sanitizeEmailContent(content)
})

const canAfford = computed(() => {
  if (!props.template.is_premium) return true
  return userCredits.value >= (props.template.credit_cost || 0)
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

onMounted(() => {
  // Simulate loading time
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.template-preview {
  /* Ensure template content is properly contained */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsive template content adjustments */
@media (max-width: 640px) {
  .template-preview table {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .template-preview img {
    max-width: 100% !important;
    height: auto !important;
  }
}

/* Force white background for template content */
.template-preview {
  background-color: white;
  color: #333;
}
</style>
