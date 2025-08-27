<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Edit Template: {{ template.name }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="newsletter">Newsletter</option>
                  <option value="promotional">Promotional</option>
                  <option value="corporate">Corporate</option>
                  <option value="creative">Creative</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <!-- Premium Settings -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Premium Settings</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="form.is_premium"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Premium</span>
                  </label>
                </div>
                
                <div v-if="form.is_premium">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Credit Cost
                  </label>
                  <input
                    v-model.number="form.credit_cost"
                    type="number"
                    min="1"
                    max="1000"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="form.is_featured"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      v-model="form.is_active"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Analytics -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Template Analytics</h4>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div class="text-sm font-medium text-blue-900 dark:text-blue-200">Views</div>
                  <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ formatNumber(template.views) }}</div>
                </div>
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div class="text-sm font-medium text-green-900 dark:text-green-200">Downloads</div>
                  <div class="text-2xl font-bold text-green-900 dark:text-green-100">{{ formatNumber(template.downloads) }}</div>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div class="text-sm font-medium text-purple-900 dark:text-purple-200">Purchases</div>
                  <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ formatNumber(template.purchases) }}</div>
                </div>
                <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <div class="text-sm font-medium text-yellow-900 dark:text-yellow-200">Rating</div>
                  <div class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ template.rating }}/5</div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                v-model="form.tags"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- Preview Image URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview Image URL
              </label>
              <input
                v-model="form.preview_image"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- HTML Content Editor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTML Content *
              </label>
              <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <textarea
                  v-model="form.html_content"
                  required
                  rows="12"
                  class="w-full px-3 py-2 border-0 focus:ring-0 dark:bg-gray-700 dark:text-white font-mono text-sm resize-none"
                ></textarea>
              </div>
              <div class="flex justify-between items-center mt-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Lines: {{ form.html_content.split('\n').length }} | Characters: {{ form.html_content.length }}
                </p>
                <button
                  type="button"
                  @click="previewTemplate"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Preview Template
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="deleteTemplate"
                class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                Delete Template
              </button>
              
              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <span v-if="loading" class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

const props = defineProps<{
  template: any
}>()

const emit = defineEmits<{
  close: []
  updated: [template: any]
}>()

const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  category: '',
  is_premium: false,
  credit_cost: 50,
  is_featured: false,
  is_active: true,
  tags: '',
  html_content: '',
  preview_image: ''
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Process tags
    const tags = form.value.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const templateData = {
      ...form.value,
      tags
    }

    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updatedTemplate = {
      ...props.template,
      ...templateData,
      updated_at: new Date().toISOString()
    }

    showSuccess(`Template "${form.value.name}" updated successfully!`)
    emit('updated', updatedTemplate)
    
  } catch (error) {
    showError('Failed to update template')
  } finally {
    loading.value = false
  }
}

const previewTemplate = () => {
  // Open preview in new window
  const previewWindow = window.open('', '_blank', 'width=800,height=600')
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Template Preview</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${form.value.html_content}
        </body>
      </html>
    `)
    previewWindow.document.close()
  }
}

const deleteTemplate = async () => {
  if (confirm(`Are you sure you want to delete "${props.template.name}"? This action cannot be undone.`)) {
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      showSuccess(`Template "${props.template.name}" deleted successfully!`)
      emit('close')
    } catch (error) {
      showError('Failed to delete template')
    }
  }
}

onMounted(() => {
  // Initialize form with template data
  form.value = {
    name: props.template.name || '',
    description: props.template.description || '',
    category: props.template.category || '',
    is_premium: props.template.is_premium || false,
    credit_cost: props.template.credit_cost || 50,
    is_featured: props.template.is_featured || false,
    is_active: props.template.is_active ?? true,
    tags: Array.isArray(props.template.tags) ? props.template.tags.join(', ') : '',
    html_content: props.template.html_content || '',
    preview_image: props.template.preview_image || ''
  }
})
</script>
