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
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Upload HTML Template</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Upload an HTML file to create a new email template. Accepted formats: .html, .htm
          </p>

          <!-- Form -->
          <form @submit.prevent="handleUpload">
            <div class="space-y-4">
              <!-- File Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HTML File
                </label>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".html,.htm"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div v-if="!selectedFile" class="cursor-pointer" @click="$refs.fileInput?.click()">
                    <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p class="text-gray-600 dark:text-gray-300">Click to select HTML file</p>
                    <p class="text-gray-400 text-sm">or drag and drop</p>
                  </div>
                  
                  <div v-else class="text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <FileText class="w-5 h-5 text-blue-600" />
                      <span class="text-gray-900 dark:text-white font-medium">{{ selectedFile.name }}</span>
                    </div>
                    <p class="text-gray-500 text-sm">{{ formatFileSize(selectedFile.size) }}</p>
                    <button
                      type="button"
                      @click="clearFile"
                      class="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Remove file
                    </button>
                  </div>
                </div>
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

            <!-- File Info -->
            <div v-if="selectedFile" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-4">
              <p class="text-gray-700 dark:text-gray-300 text-sm">
                <FileText class="w-4 h-4 inline mr-1" />
                File will be processed and saved as a reusable template.
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
                :disabled="loading || !selectedFile || !form.name"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="loading">Uploading...</span>
                <span v-else>Upload Template</span>
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
import { X, Upload, FileText } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
  upload: [data: { file: File; name: string; description: string }]
}>()

const loading = ref(false)
const selectedFile = ref<File | null>(null)

const form = ref({
  name: '',
  description: ''
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    
    // Auto-fill name from filename if empty
    if (!form.value.name) {
      const fileName = target.files[0].name
      form.value.name = fileName.replace(/\.[^/.]+$/, "") // Remove extension
    }
  }
}

const clearFile = () => {
  selectedFile.value = null
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  try {
    emit('upload', {
      file: selectedFile.value,
      name: form.value.name,
      description: form.value.description
    })
  } finally {
    loading.value = false
  }
}
</script>
