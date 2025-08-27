<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <StepHeader
      title="Choose Template"
      subtitle="Pick a design or start from scratch"
      icon="Layout"
      gradient="from-purple-600 to-pink-600"
    />
    
    <!-- Content -->
    <div class="p-8 space-y-6">
      <!-- Template Options -->
      <div class="flex items-center space-x-6">
        <label class="flex items-center space-x-3 cursor-pointer group">
          <input
            :checked="useTemplate"
            @change="updateUseTemplate(true)"
            type="radio"
            name="template_option"
            class="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-600 focus:ring-2"
          />
          <div class="flex items-center space-x-2">
            <Layout class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
            <span class="font-medium text-gray-900 dark:text-white">Use Template</span>
          </div>
        </label>
        
        <label class="flex items-center space-x-3 cursor-pointer group">
          <input
            :checked="!useTemplate"
            @change="updateUseTemplate(false)"
            type="radio"
            name="template_option"
            class="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-600 focus:ring-2"
          />
          <div class="flex items-center space-x-2">
            <Code class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
            <span class="font-medium text-gray-900 dark:text-white">Start from Scratch</span>
          </div>
        </label>
      </div>

      <!-- Template Gallery -->
      <div v-if="useTemplate" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Available Templates
          </h3>
        </div>
        
        <!-- Loading State -->
        <div v-if="templatesStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
          ></div>
        </div>
        
        <!-- Templates Grid -->
        <div v-else-if="availableTemplates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="template in availableTemplates.slice(0, 6)"
            :key="template.id"
            @click="selectTemplate(template)"
            :class="[
              'relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 border-2',
              selectedTemplate?.id === template.id
                ? 'border-blue-500 shadow-xl'
                : 'border-gray-200 dark:border-gray-600 hover:shadow-lg'
            ]"
          >
            <!-- Template Preview -->
            <div class="aspect-[4/5] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 relative flex items-center justify-center">
              <Layout class="w-16 h-16 text-gray-400" />
              
              <!-- Selected Indicator -->
              <div
                v-if="selectedTemplate?.id === template.id"
                class="absolute top-4 right-4 p-2 bg-blue-500 rounded-full shadow-lg"
              >
                <Check class="w-4 h-4 text-white" />
              </div>
            </div>
            
            <!-- Template Info -->
            <div class="p-4 bg-white dark:bg-gray-800">
              <h4 class="font-semibold text-gray-900 dark:text-white text-sm">
                {{ template.name || `Template ${template.id}` }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {{ template.description || 'Professional email template' }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- No Templates State -->
        <div v-else class="text-center py-12">
          <Layout class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Templates Available
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Templates will be loaded here. For now, you can start from scratch.
          </p>
          <button
            @click="updateUseTemplate(false)"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start from Scratch Instead
          </button>
        </div>
      </div>

      <!-- From Scratch Message -->
      <div v-else class="text-center py-12">
        <Code class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Start with a Blank Canvas
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          You'll be able to design your email from scratch in the next step
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Layout, Code, Check } from 'lucide-vue-next'
import StepHeader from '@/components/campaigns/create/StepHeader.vue'
import { useTemplatesStore } from '@/stores/templates'

interface Props {
  modelValue: {
    email_template_id?: number
    html_content: string
    text_content: string
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
const templatesStore = useTemplatesStore()

// Local state
const useTemplate = ref(true)
const selectedTemplate = ref<any>(null)

// Computed
const availableTemplates = computed(() => {
  return templatesStore.availableTemplates || []
})

// Methods
const updateUseTemplate = (value: boolean) => {
  useTemplate.value = value
  if (!value) {
    selectedTemplate.value = null
    updateModelValue({
      email_template_id: undefined,
      html_content: '',
      text_content: ''
    })
  }
}

const selectTemplate = (template: any) => {
  selectedTemplate.value = template
  updateModelValue({
    email_template_id: template.id,
    html_content: template.html_content || '',
    text_content: template.text_content || ''
  })
}

const updateModelValue = (updates: Partial<Props['modelValue']>) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...updates
  })
}

// Initialize
onMounted(async () => {
  try {
    await templatesStore.fetchTemplates()
  } catch (error) {
    console.error('Failed to load templates:', error)
  }
})
</script>