<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Import Template from URL</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Import an email template from a public URL. The URL should point to an HTML file or email template.
          </p>

          <!-- Form -->
          <form @submit.prevent="handleImport">
            <div class="space-y-4">
              <!-- URL Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template URL
                </label>
                <input
                  v-model="form.url"
                  type="url"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/template.html"
                />
              </div>

              <!-- Template Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Name
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter template name..."
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe this template..."
                ></textarea>
              </div>
            </div>

            <!-- Info Notice -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
              <p class="text-blue-700 dark:text-blue-300 text-sm">
                <Globe class="w-4 h-4 inline mr-1" />
                Make sure the URL is publicly accessible and contains valid HTML content.
              </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !form.url || !form.name"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="loading">Importing...</span>
                <span v-else>Import Template</span>
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
import { X, Globe } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
  import: [data: { url: string; name: string; description: string }]
}>()

const loading = ref(false)

const form = ref({
  url: '',
  name: '',
  description: ''
})

const handleImport = async () => {
  loading.value = true
  try {
    emit('import', {
      url: form.value.url,
      name: form.value.name,
      description: form.value.description
    })
  } finally {
    loading.value = false
  }
}
</script>
