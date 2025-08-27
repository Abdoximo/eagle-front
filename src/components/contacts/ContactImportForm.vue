<template>
  <div class="space-y-6">
    <!-- File Upload Section -->
    <div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Import Contacts from CSV</h3>
      
      <!-- Upload Area -->
      <div
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        :class="{ 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragOver }"
      >
        <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div class="space-y-2">
          <p class="text-lg font-medium text-gray-900 dark:text-white">
            Drop your CSV file here
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            or
          </p>
          <label class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              @change="handleFileSelect"
              class="hidden"
            />
            Choose CSV File
          </label>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Maximum file size: 10MB. Supported format: CSV
        </p>
      </div>

      <!-- File Info -->
      <div v-if="selectedFile" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button @click="removeFile" class="text-red-600 dark:text-red-400 hover:text-red-700">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- CSV Mapping Section -->
    <div v-if="csvData.length > 0" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Map CSV Columns</h3>
      
      <!-- Preview Table -->
      <div class="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th v-for="(header, index) in csvHeaders" :key="index" 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="(row, index) in csvData.slice(0, 3)" :key="index">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex" 
                  class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="csvData.length > 3" class="p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
          ... and {{ csvData.length - 3 }} more rows
        </div>
      </div>

      <!-- Column Mapping -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Column *
          </label>
          <select v-model="mapping.email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Select column...</option>
            <option v-for="(header, index) in csvHeaders" :key="index" :value="index">
              {{ header }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name Column
          </label>
          <select v-model="mapping.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Select column...</option>
            <option v-for="(header, index) in csvHeaders" :key="index" :value="index">
              {{ header }}
            </option>
          </select>
        </div>
      </div>

      <!-- Target List Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Contact List *
        </label>
        <select v-model="targetListId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="">Select or create list...</option>
          <option v-for="list in contactLists" :key="list.id" :value="list.id">
            {{ list.name }} ({{ list.contacts_count || 0 }} contacts)
          </option>
          <option value="new">+ Create New List</option>
        </select>
      </div>

      <!-- New List Creation -->
      <div v-if="targetListId === 'new'" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          New List Name *
        </label>
        <input
          v-model="newListName"
          type="text"
          placeholder="Enter list name..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Import Options -->
    <div v-if="csvData.length > 0" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Import Options</h3>
      
      <div class="space-y-3">
        <label class="flex items-center">
          <input v-model="options.skipDuplicates" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Skip duplicate email addresses</span>
        </label>
        
        <label class="flex items-center">
          <input v-model="options.subscribeAll" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Subscribe all imported contacts</span>
        </label>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span v-if="csvData.length > 0">
          Ready to import {{ csvData.length }} contacts
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        
        <button
          @click="handleImport"
          :disabled="!canImport || importing"
          class="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="importing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Importing...
          </span>
          <span v-else>Import Contacts</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Upload, FileText, X } from 'lucide-vue-next'
import { useContactsStore } from '@/stores/contacts'
import { showError, showSuccess } from '@/services/toast'

const emit = defineEmits<{
  success: [result: any]
  cancel: []
}>()

const contactsStore = useContactsStore()

// State
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const csvData = ref<string[][]>([])
const csvHeaders = ref<string[]>([])
const importing = ref(false)

const mapping = ref({
  email: '',
  name: ''
})

const targetListId = ref('')
const newListName = ref('')

const options = ref({
  skipDuplicates: true,
  subscribeAll: true
})

// Computed
const contactLists = computed(() => contactsStore.contactLists || [])

const canImport = computed(() => {
  return csvData.value.length > 0 && 
         mapping.value.email !== '' && 
         (targetListId.value !== '' && targetListId.value !== 'new' || 
          (targetListId.value === 'new' && newListName.value.trim() !== ''))
})

// Methods
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = async (file: File) => {
  if (!file.name.endsWith('.csv')) {
    showError('Please select a CSV file')
    return
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    showError('File size must be less than 10MB')
    return
  }

  selectedFile.value = file
  await parseCSV(file)
}

const parseCSV = async (file: File) => {
  try {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      showError('CSV file is empty')
      return
    }

    // Parse headers
    csvHeaders.value = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
    
    // Parse data
    csvData.value = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    )

    // Auto-detect email column
    const emailIndex = csvHeaders.value.findIndex(header => 
      header.toLowerCase().includes('email') || header.toLowerCase().includes('mail')
    )
    if (emailIndex !== -1) {
      mapping.value.email = emailIndex.toString()
    }

    // Auto-detect name column
    const nameIndex = csvHeaders.value.findIndex(header => 
      header.toLowerCase().includes('name') || header.toLowerCase().includes('first')
    )
    if (nameIndex !== -1) {
      mapping.value.name = nameIndex.toString()
    }

  } catch (error) {
    showError('Failed to parse CSV file')
  }
}

const removeFile = () => {
  selectedFile.value = null
  csvData.value = []
  csvHeaders.value = []
  mapping.value = { email: '', name: '' }
}

const handleImport = async () => {
  if (!canImport.value) return

  importing.value = true
  try {
    let listId = targetListId.value

    // Create new list if needed
    if (targetListId.value === 'new') {
      const newList = await contactsStore.createContactList({
        name: newListName.value.trim(),
        description: `Imported from CSV on ${new Date().toLocaleDateString()}`
      })
      listId = newList.id
    }

    // Prepare contact data
    const contacts = csvData.value.map(row => {
      const contact: any = {
        email: row[parseInt(mapping.value.email)],
        is_subscribed: options.value.subscribeAll
      }

      if (mapping.value.name && row[parseInt(mapping.value.name)]) {
        contact.name = row[parseInt(mapping.value.name)]
      }

      return contact
    }).filter(contact => contact.email && contact.email.includes('@'))

    // Import contacts
    const result = await contactsStore.importContacts({
      list_id: listId,
      contacts,
      skip_duplicates: options.value.skipDuplicates
    })

    emit('success', result)
    showSuccess(`Successfully imported ${result.imported} contacts`)

  } catch (error: any) {
    showError(error.message || 'Failed to import contacts')
  } finally {
    importing.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(async () => {
  await contactsStore.fetchContactLists()
})
</script>
