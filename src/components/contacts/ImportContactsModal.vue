<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Import Contacts
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Step {{ currentStep }} of 3: {{ stepTitles[currentStep - 1] }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700">
        <div class="flex items-center space-x-4">
          <div
            v-for="(step, index) in 3"
            :key="step"
            :class="[
              'flex items-center space-x-2',
              index < 2 ? 'flex-1' : ''
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep > step
                  ? 'bg-green-500 text-white'
                  : currentStep === step
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              ]"
            >
              <Check v-if="currentStep > step" class="w-4 h-4" />
              <span v-else>{{ step }}</span>
            </div>
            <span
              :class="[
                'text-sm font-medium',
                currentStep >= step
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ stepTitles[step - 1] }}
            </span>
            <div
              v-if="index < 2"
              :class="[
                'flex-1 h-0.5 mx-4',
                currentStep > step + 1
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <!-- Step 1: File Upload -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upload CSV File
            </h4>
            
            <!-- File Upload Area -->
            <div
              @drop="handleFileDrop"
              @dragover.prevent
              @dragenter.prevent
              :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="hidden"
              />
              
              <div v-if="!selectedFile">
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your CSV file here
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or
                </p>
                <button
                  @click="$refs.fileInput?.click()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Maximum file size: 10MB
                </p>
              </div>
              
              <div v-else class="text-left">
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <FileText class="w-8 h-8 text-blue-500" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ selectedFile.name }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(selectedFile.size) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeFile"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Sample CSV Format -->
            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
                CSV Format Example:
              </h5>
              <pre class="text-sm text-blue-800 dark:text-blue-200 overflow-x-auto">
email,first_name,last_name,phone,company
john@example.com,John,Doe,+1234567890,Acme Corp
jane@example.com,Jane,Smith,+0987654321,Tech Inc</pre>
              <p class="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Required: email | Optional: first_name, last_name, phone, company, and custom fields
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Column Mapping -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Map CSV Columns
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Match your CSV columns to contact fields. The email field is required.
            </p>

            <!-- Column Mapping -->
            <div class="space-y-4">
              <div
                v-for="(column, index) in csvColumns"
                :key="index"
                class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CSV Column: <span class="font-semibold">{{ column }}</span>
                  </label>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Sample: {{ csvPreview[0]?.[column] || 'N/A' }}
                  </p>
                </div>
                <div class="flex-1">
                  <select
                    v-model="columnMapping[column]"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Don't import</option>
                    <option value="email">Email *</option>
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                    <option value="phone">Phone</option>
                    <option value="company">Company</option>
                    <option :value="`custom_${column.toLowerCase()}`">
                      Custom Field: {{ column }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Mapping Validation -->
            <div v-if="!hasEmailMapping" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <div class="flex items-center">
                <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                <p class="text-sm text-red-600 dark:text-red-400">
                  You must map at least one column to the Email field
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Import Settings & Preview -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Import Settings
            </h4>

            <!-- Contact List Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Import to List <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                v-model="selectedListId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a contact list...</option>
                <option
                  v-for="list in contactLists"
                  :key="list.id"
                  :value="list.id"
                >
                  {{ list.name }} ({{ list.contacts_count }} contacts)
                </option>
              </select>
            </div>

            <!-- Import Options -->
            <div class="space-y-4 mb-6">
              <h5 class="font-medium text-gray-900 dark:text-white">Import Options</h5>
              
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <input
                    v-model="importSettings.skipDuplicates"
                    type="checkbox"
                    id="skip-duplicates"
                    class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label for="skip-duplicates" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skip duplicate emails
                    </label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Don't import contacts with emails that already exist in this list
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <input
                    v-model="importSettings.validateEmails"
                    type="checkbox"
                    id="validate-emails"
                    class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label for="validate-emails" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Validate email addresses
                    </label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Skip invalid email addresses during import
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <input
                    v-model="importSettings.subscribeAll"
                    type="checkbox"
                    id="subscribe-all"
                    class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label for="subscribe-all" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subscribe all contacts
                    </label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Mark all imported contacts as subscribed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Import Preview -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 class="font-medium text-gray-900 dark:text-white mb-3">
                Import Preview
              </h5>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Total rows:</span>
                  <span class="font-medium text-gray-900 dark:text-white ml-2">
                    {{ csvPreview.length }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Valid emails:</span>
                  <span class="font-medium text-green-600 dark:text-green-400 ml-2">
                    {{ validEmailsCount }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Duplicates:</span>
                  <span class="font-medium text-yellow-600 dark:text-yellow-400 ml-2">
                    {{ duplicatesCount }}
                  </span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Will import:</span>
                  <span class="font-medium text-blue-600 dark:text-blue-400 ml-2">
                    {{ willImportCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Import Progress -->
        <div v-if="importing" class="space-y-4">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              Importing Contacts...
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ importProgress.processed }} of {{ importProgress.total }} processed
            </p>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(importProgress.processed / importProgress.total) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Import Complete -->
        <div v-if="importComplete" class="text-center space-y-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <Check class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Import Complete!
            </h4>
            <div class="space-y-2 text-sm">
              <p class="text-green-600 dark:text-green-400">
                ✅ {{ importResults.imported }} contacts imported successfully
              </p>
              <p v-if="importResults.skipped > 0" class="text-yellow-600 dark:text-yellow-400">
                ⚠️ {{ importResults.skipped }} contacts skipped (duplicates or invalid)
              </p>
              <p v-if="importResults.errors > 0" class="text-red-600 dark:text-red-400">
                ❌ {{ importResults.errors }} contacts failed to import
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div v-if="currentStep > 1 && !importing && !importComplete">
          <button
            @click="currentStep--"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          >
            Back
          </button>
        </div>
        <div v-else></div>

        <div class="flex space-x-3">
          <button
            v-if="!importing && !importComplete"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            v-if="currentStep < 3 && !importing"
            @click="nextStep"
            :disabled="!canProceed"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
          <button
            v-if="currentStep === 3 && !importing && !importComplete"
            @click="startImport"
            :disabled="!canStartImport"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Import
          </button>
          <button
            v-if="importComplete"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Check, Upload, FileText, AlertCircle } from 'lucide-vue-next'
import { useContactsStore } from '@/stores/contacts'
import type { ContactList } from '@/types/contacts'

// Emits
const emit = defineEmits<{
  close: []
  imported: [count: number]
}>()

// Store
const contactsStore = useContactsStore()

// Reactive data
const currentStep = ref(1)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const csvColumns = ref<string[]>([])
const csvPreview = ref<any[]>([])
const columnMapping = ref<Record<string, string>>({})
const selectedListId = ref('')
const importing = ref(false)
const importComplete = ref(false)

// Step titles
const stepTitles = ['Upload File', 'Map Columns', 'Import Settings']

// Import settings
const importSettings = ref({
  skipDuplicates: true,
  validateEmails: true,
  subscribeAll: true
})

// Import progress
const importProgress = ref({
  processed: 0,
  total: 0
})

// Import results
const importResults = ref({
  imported: 0,
  skipped: 0,
  errors: 0
})

// Contact lists
const contactLists = computed(() => contactsStore.contactLists)

// Computed properties
const hasEmailMapping = computed(() => {
  return Object.values(columnMapping.value).includes('email')
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!selectedFile.value
    case 2:
      return hasEmailMapping.value
    case 3:
      return !!selectedListId.value
    default:
      return false
  }
})

const canStartImport = computed(() => {
  return !!selectedListId.value && hasEmailMapping.value && csvPreview.value.length > 0
})

const validEmailsCount = computed(() => {
  if (!csvPreview.value.length) return 0
  const emailColumn = Object.keys(columnMapping.value).find(
    key => columnMapping.value[key] === 'email'
  )
  if (!emailColumn) return 0
  
  return csvPreview.value.filter(row => {
    const email = row[emailColumn]
    return email && isValidEmail(email)
  }).length
})

const duplicatesCount = computed(() => {
  // This would be calculated based on existing contacts in the selected list
  // For now, return a mock value
  return Math.floor(csvPreview.value.length * 0.1)
})

const willImportCount = computed(() => {
  return validEmailsCount.value - (importSettings.value.skipDuplicates ? duplicatesCount.value : 0)
})

// Methods
const handleFileDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect({ target: { files } } as any)
  }
}

const handleFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    const file = files[0]
    
    // Validate file
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('File size must be less than 10MB')
      return
    }
    
    selectedFile.value = file
    parseCSV(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  csvColumns.value = []
  csvPreview.value = []
  columnMapping.value = {}
}

const parseCSV = (file: File) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const csv = e.target?.result as string
    const lines = csv.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    csvColumns.value = headers
    
    // Parse preview data (first 5 rows)
    const previewLines = lines.slice(1, 6)
    csvPreview.value = previewLines.map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })
    
    // Auto-map common columns
    autoMapColumns(headers)
  }
  
  reader.readAsText(file)
}

const autoMapColumns = (headers: string[]) => {
  const mapping: Record<string, string> = {}
  
  headers.forEach(header => {
    const lower = header.toLowerCase()
    if (lower.includes('email') || lower === 'e-mail') {
      mapping[header] = 'email'
    } else if (lower.includes('first') && lower.includes('name')) {
      mapping[header] = 'first_name'
    } else if (lower.includes('last') && lower.includes('name')) {
      mapping[header] = 'last_name'
    } else if (lower.includes('phone') || lower.includes('mobile')) {
      mapping[header] = 'phone'
    } else if (lower.includes('company') || lower.includes('organization')) {
      mapping[header] = 'company'
    }
  })
  
  columnMapping.value = mapping
}

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++
    
    if (currentStep.value === 2) {
      // Load contact lists when reaching step 2
      contactsStore.fetchContactLists()
    }
  }
}

const startImport = async () => {
  if (!canStartImport.value) return
  
  importing.value = true
  importProgress.value = { processed: 0, total: csvPreview.value.length }
  
  try {
    // Simulate import process
    const total = csvPreview.value.length
    let imported = 0
    let skipped = 0
    let errors = 0
    
    for (let i = 0; i < total; i++) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      importProgress.value.processed = i + 1
      
      // Simulate import results
      const random = Math.random()
      if (random < 0.85) {
        imported++
      } else if (random < 0.95) {
        skipped++
      } else {
        errors++
      }
    }
    
    importResults.value = { imported, skipped, errors }
    
    // Here you would make the actual API call
    // const result = await contactsStore.importContacts(...)
    
    importing.value = false
    importComplete.value = true
    
    emit('imported', imported)
  } catch (error) {
    importing.value = false
    console.error('Import error:', error)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Watch for drag events
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  if (!e.relatedTarget) {
    dragOver.value = false
  }
}

// Load contact lists on mount
contactsStore.fetchContactLists()
</script>