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
          <TemplateFilters v-model="templateFilter" />
        </div>
        
        <TemplateGrid
          :templates="filteredTemplates"
          :selected-template="selectedTemplate"
          @select="selectTemplate"
        />
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
import { Layout, Code } from 'lucide-vue-next'
import StepHeader from '@/components/campaigns/create/StepHeader.vue'
import TemplateFilters from '@/components/templates/TemplateFilters.vue'
import TemplateGrid from '@/components/templates/TemplateGrid.vue'
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
const templateFilter = ref('all')
const selectedTemplate = ref<any>(null)

// Computed
const filteredTemplates = computed(() => {
  const templates = templatesStore.availableTemplates
  if (templateFilter.value === 'all') return templates
  return templates.filter(t => t.type === templateFilter.value)
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
  await templatesStore.fetchTemplates()
})
</script>