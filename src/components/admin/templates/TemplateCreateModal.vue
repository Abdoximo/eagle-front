<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Create Premium Template</h3>
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
                  placeholder="Enter template name..."
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
                  <option value="">Select category</option>
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
                placeholder="Describe your template..."
              ></textarea>
            </div>

            <!-- Premium Settings -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Premium Settings</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="form.is_premium"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Premium Template</span>
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
                    placeholder="50"
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
                placeholder="modern, responsive, professional"
              />
            </div>

            <!-- HTML Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTML Content *
              </label>
              <textarea
                v-model="form.html_content"
                required
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder="<html>...</html>"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter the complete HTML email template code
              </p>
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
                placeholder="https://example.com/preview.jpg"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                  Creating...
                </span>
                <span v-else>Create Template</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

const emit = defineEmits<{
  close: []
  created: [template: any]
}>()

const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  category: '',
  is_premium: false,
  credit_cost: 50,
  is_featured: false,
  tags: '',
  html_content: '',
  preview_image: ''
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Process tags
    const tags = form.value.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const templateData = {
      name: form.value.name,
      description: form.value.description,
      category: form.value.category,
      is_premium: form.value.is_premium,
      credit_cost: form.value.is_premium ? form.value.credit_cost : 0,
      is_featured: form.value.is_featured,
      tags,
      html_content: form.value.html_content,
      preview_image: form.value.preview_image || null
    }

    // Import the API service
    const { templatesAPI } = await import('@/services/templates.api')
    const newTemplate = await templatesAPI.createTemplate(templateData)

    showSuccess(`Template "${form.value.name}" created successfully!`)
    emit('created', newTemplate)
    
  } catch (error: any) {
    console.error('Failed to create template:', error)
    showError(error?.response?.data?.message || 'Failed to create template')
  } finally {
    loading.value = false
  }
}
</script>
