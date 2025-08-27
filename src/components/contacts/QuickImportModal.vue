<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Quick Import Contacts</h2>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div class="space-y-6">
            <!-- Import Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Import Method
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  @click="importMethod = 'paste'"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all',
                    importMethod === 'paste'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  ]"
                >
                  <FileText class="w-6 h-6 mb-2 text-blue-600" />
                  <div class="font-medium">Paste Text</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Copy & paste emails</div>
                </button>
                
                <button
                  @click="importMethod = 'file'"
                  :class="[
                    'p-4 border-2 rounded-lg text-left transition-all',
                    importMethod === 'file'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  ]"
                >
                  <Upload class="w-6 h-6 mb-2 text-blue-600" />
                  <div class="font-medium">Upload CSV</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Import from file</div>
                </button>
              </div>
            </div>

            <!-- Paste Method -->
            <div v-if="importMethod === 'paste'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste Email Addresses
              </label>
              <textarea
                v-model="contactsText"
                rows="8"
                placeholder="Paste email addresses here, one per line:&#10;&#10;john@example.com&#10;jane@example.com&#10;user@domain.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ validEmailsCount }} valid email{{ validEmailsCount !== 1 ? 's' : '' }} detected
              </p>
            </div>

            <!-- File Method -->
            <div v-if="importMethod === 'file'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload CSV File
              </label>
              <div
                @drop="handleFileDrop"
                @dragover.prevent
                @dragenter.prevent
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your CSV file here, or 
                  <button
                    @click="$refs.fileInput?.click()"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    browse
                  </button>
                </p>
                <p class="text-xs text-gray-500">CSV format: email, first_name, last_name</p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".csv"
                  @change="handleFileSelect"
                  class="hidden"
                />
              </div>
              
              <div v-if="selectedFile" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center space-x-2">
                  <FileText class="w-4 h-4 text-gray-600" />
                  <span class="text-sm">{{ selectedFile.name }}</span>
                  <button @click="selectedFile = null" class="text-red-500 hover:text-red-700">
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleImport"
              :disabled="!canImport || loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Importing...</span>
              <span v-else>Import Contacts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Upload, FileText } from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

interface Emits {
  (e: 'close'): void
  (e: 'imported', listId: number): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)
const importMethod = ref<'paste' | 'file'>('paste')
const contactsText = ref('')
const selectedFile = ref<File | null>(null)

const validEmailsCount = computed(() => {
  if (!contactsText.value.trim()) return 0
  const emails = contactsText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && /\S+@\S+\.\S+/.test(line))
  return emails.length
})

const canImport = computed(() => {
  if (importMethod.value === 'paste') {
    return validEmailsCount.value > 0
  }
  return selectedFile.value !== null
})

const close = () => {
  emit('close')
}

const handleFileDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files[0] && files[0].type === 'text/csv') {
    selectedFile.value = files[0]
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
  }
}

const handleImport = async () => {
  loading.value = true
  try {
    // For now, just simulate the import
    // In a real implementation, you would:
    // 1. Create a new contact list or select existing one
    // 2. Parse the data (CSV or text)
    // 3. Validate emails
    // 4. Bulk import contacts
    
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    
    // Mock response - in real implementation, return the actual list ID
    const mockListId = Math.floor(Math.random() * 1000)
    
    emit('imported', mockListId)
    showSuccess(`Successfully imported ${validEmailsCount.value} contacts`)
  } catch (error: any) {
    showError(error.message || 'Failed to import contacts')
  } finally {
    loading.value = false
  }
}
</script>
