<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Template Gallery - MVP</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Simple template selection for testing</p>
          </div>
          <router-link 
            to="/templates"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Templates
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Simple Template Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="template in templates" :key="template.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <!-- Preview -->
          <div class="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <div class="text-center">
              <FileText class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-600 dark:text-gray-400">{{ template.name }}</p>
            </div>
          </div>
          
          <!-- Info -->
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ template.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ template.description }}</p>
            
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center space-x-2">
                <Badge :variant="template.is_premium ? 'warning' : 'success'" size="sm">
                  {{ template.is_premium ? `${template.credits} Credits` : 'Free' }}
                </Badge>
              </div>
              
              <div class="flex space-x-2">
                <button @click="previewTemplate(template)" class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Preview
                </button>
                <button @click="useTemplate(template)" class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Use
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Soon Message -->
      <div class="text-center py-12">
        <Star class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">More Templates Coming Soon!</h3>
        <p class="text-gray-600 dark:text-gray-400">This is the MVP version. Full gallery features will be added in the next update.</p>
      </div>
    </div>

    <!-- Simple Preview Modal -->
    <div v-if="previewingTemplate" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ previewingTemplate.name }}</h3>
          <button @click="previewingTemplate = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 dark:text-gray-400">{{ previewingTemplate.description }}</p>
        </div>
        
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">Template preview would appear here. This is the MVP version.</p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="previewingTemplate = null" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="useTemplate(previewingTemplate)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Use This Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, Star, X } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import { showSuccess } from '@/services/toast'

const router = useRouter()
const previewingTemplate = ref(null)

// Simple mock templates for MVP
const templates = ref([
  {
    id: 1,
    name: 'Newsletter Basic',
    description: 'Simple newsletter template',
    is_premium: false,
    credits: 0
  },
  {
    id: 2,
    name: 'Promotional Pro',
    description: 'Professional promotion template',
    is_premium: true,
    credits: 25
  },
  {
    id: 3,
    name: 'Welcome Email',
    description: 'Warm welcome email template',
    is_premium: false,
    credits: 0
  },
  {
    id: 4,
    name: 'Corporate Elite',
    description: 'Premium corporate template',
    is_premium: true,
    credits: 50
  }
])

const previewTemplate = (template) => {
  previewingTemplate.value = template
}

const useTemplate = (template) => {
  previewingTemplate.value = null
  showSuccess(`Using template: ${template.name}`)
  
  // Navigate to campaign creation with template
  router.push({
    name: 'CreateCampaign',
    query: { template: template.id }
  })
}
</script>
