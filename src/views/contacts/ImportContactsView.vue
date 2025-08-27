<template>
  <div class="space-y-6 pt-6">
    <!-- Import steps -->
    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="mb-6">
          <nav aria-label="Progress">
            <ol class="flex items-center">
              <li v-for="(step, index) in steps" :key="step.name" class="relative">
                <div v-if="index !== steps.length - 1" class="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300" aria-hidden="true"></div>
                <div class="relative flex items-start">
                  <span class="h-9 flex items-center">
                    <span
                      :class="[
                        'relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold',
                        currentStep >= index + 1
                          ? 'bg-primary text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-500'
                      ]"
                    >
                      {{ index + 1 }}
                    </span>
                  </span>
                  <span class="ml-4 min-w-0 flex flex-col">
                    <span
                      :class="[
                        'text-xs font-semibold tracking-wide uppercase',
                        currentStep >= index + 1 ? 'text-primary' : 'text-gray-500'
                      ]"
                    >
                      {{ step.name }}
                    </span>
                    <span class="text-sm text-gray-500">{{ step.description }}</span>
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <!-- Step 1: Upload File -->
        <div v-if="currentStep === 1" class="space-y-6">
          <Card title="Upload CSV File">
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="importMethod"
                    type="radio"
                    value="file"
                    name="import_method"
                    class="mr-2"
                  />
                  Upload CSV file
                </label>
                <label class="flex items-center">
                  <input
                    v-model="importMethod"
                    type="radio"
                    value="paste"
                    name="import_method"
                    class="mr-2"
                  />
                  Paste data
                </label>
              </div>

              <div v-if="importMethod === 'file'">
                <FileUpload
                  v-model="uploadedFile"
                  accept=".csv"
                  @file-selected="handleFileSelected"
                  :loading="processing"
                />
                
                <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p class="font-medium mb-2">CSV format requirements:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>First row should contain column headers</li>
                    <li>Required columns: email</li>
                    <li>Optional columns: first_name, last_name, company, phone</li>
                    <li>Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>

              <div v-else-if="importMethod === 'paste'">
                <textarea
                  v-model="pastedData"
                  class="input w-full h-32"
                  placeholder="Paste your CSV data here..."
                ></textarea>
                <Button
                  @click="processPastedData"
                  :loading="processing"
                  :disabled="!pastedData.trim()"
                  class="mt-2"
                >
                  Process Data
                </Button>
              </div>
            </div>
          </Card>

          <div v-if="previewData.length > 0">
            <Card title="Data Preview">
              <div class="space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Found {{ previewData.length }} contacts. Review the data below:
                </p>
                
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th v-for="header in headers" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr v-for="(row, index) in previewData.slice(0, 5)" :key="index">
                        <td v-for="header in headers" :key="header" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{ row[header] || '-' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div v-if="previewData.length > 5" class="text-sm text-gray-500 dark:text-gray-400">
                  Showing first 5 rows of {{ previewData.length }} total contacts
                </div>

                <Button @click="currentStep = 2" class="w-full">
                  Continue to Mapping
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <!-- Step 2: Field Mapping -->
        <div v-if="currentStep === 2" class="space-y-6">
          <Card title="Map Fields">
            <div class="space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Map your CSV columns to contact fields:
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="field in requiredFields" :key="field.key" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500 ml-1">*</span>
                  </label>
                  <select v-model="fieldMapping[field.key]" class="input w-full">
                    <option value="">Select column</option>
                    <option v-for="header in headers" :key="header" :value="header">
                      {{ header }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact List
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="flex space-x-2">
                  <select v-model="selectedContactList" class="input flex-1">
                    <option value="">Select existing list</option>
                    <option v-for="list in contactsStore.contactLists" :key="list.id" :value="list.id">
                      {{ list.name }}
                    </option>
                  </select>
                  <Button variant="outline" @click="showCreateListModal = true">
                    New List
                  </Button>
                </div>
              </div>

              <div class="flex space-x-2">
                <Button variant="outline" @click="currentStep = 1">
                  Back
                </Button>
                <Button 
                  @click="currentStep = 3" 
                  :disabled="!fieldMapping.email || !selectedContactList"
                >
                  Continue to Review
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Step 3: Review & Import -->
        <div v-if="currentStep === 3" class="space-y-6">
          <Card title="Review Import">
            <div class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div class="flex">
                  <InformationCircleIcon class="h-5 w-5 text-blue-400 mt-0.5" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Import Summary
                    </h3>
                    <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <ul class="space-y-1">
                        <li>{{ validContacts.length }} valid contacts will be imported</li>
                        <li>{{ invalidContacts.length }} invalid contacts will be skipped</li>
                        <li>Contacts will be added to: {{ selectedContactListName }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="invalidContacts.length > 0">
                <details class="mt-4">
                  <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    View {{ invalidContacts.length }} invalid contacts
                  </summary>
                  <div class="mt-2 max-h-40 overflow-y-auto">
                    <div v-for="(contact, index) in invalidContacts" :key="index" class="text-sm text-red-600 dark:text-red-400">
                      Row {{ contact.row }}: {{ contact.error }}
                    </div>
                  </div>
                </details>
              </div>

              <div class="flex items-center space-x-2">
                <input
                  id="update_existing"
                  v-model="updateExisting"
                  type="checkbox"
                  class="rounded border-gray-300"
                />
                <label for="update_existing" class="text-sm text-gray-700 dark:text-gray-300">
                  Update existing contacts with the same email
                </label>
              </div>

              <div class="flex space-x-2">
                <Button variant="outline" @click="currentStep = 2">
                  Back
                </Button>
                <Button 
                  @click="performImport" 
                  :loading="importing"
                  :disabled="validContacts.length === 0"
                >
                  Import {{ validContacts.length }} Contacts
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Step 4: Complete -->
        <div v-if="currentStep === 4" class="space-y-6">
          <Card>
            <div class="text-center py-8">
              <CheckCircleIcon class="mx-auto h-16 w-16 text-green-500" />
              <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Import Complete!
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Successfully imported {{ importResults.imported }} contacts.
                {{ importResults.updated }} existing contacts were updated.
              </p>
              <div class="mt-6 flex justify-center space-x-4">
                <Button @click="$router.push('/contacts')">
                  View Contacts
                </Button>
                <Button variant="outline" @click="resetImport">
                  Import More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Create List Modal -->
    <Modal
      :show="showCreateListModal"
      title="Create Contact List"
      @close="showCreateListModal = false"
    >
      <ContactListForm
        @success="handleListCreated"
        @cancel="showCreateListModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import { useUIStore } from '@/stores/ui'
import Papa from 'papaparse'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Modal from '@/components/ui/Modal.vue'
import FileUpload from '@/components/ui/FileUpload.vue'
import ContactListForm from '@/components/forms/ContactListForm.vue'
import {
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const contactsStore = useContactsStore()
const uiStore = useUIStore()

const currentStep = ref(1)
const importMethod = ref('file')
const uploadedFile = ref<File | null>(null)
const pastedData = ref('')
const processing = ref(false)
const importing = ref(false)
const previewData = ref<any[]>([])
const headers = ref<string[]>([])
const fieldMapping = ref<Record<string, string>>({})
const selectedContactList = ref<number | null>(null)
const updateExisting = ref(false)
const showCreateListModal = ref(false)
const importResults = ref({ imported: 0, updated: 0 })

const steps = [
  { name: 'Upload', description: 'Upload or paste your data' },
  { name: 'Map', description: 'Map fields to contact properties' },
  { name: 'Review', description: 'Review and confirm import' },
  { name: 'Complete', description: 'Import completed' }
]

const requiredFields = [
  { key: 'email', label: 'Email Address', required: true },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'company', label: 'Company', required: false },
  { key: 'phone', label: 'Phone', required: false }
]

const selectedContactListName = computed(() => {
  const list = contactsStore.contactLists.find(l => l.id === selectedContactList.value)
  return list?.name || ''
})

const validContacts = computed(() => {
  return previewData.value.filter(contact => {
    const email = contact[fieldMapping.value.email]
    return email && isValidEmail(email)
  })
})

const invalidContacts = computed(() => {
  return previewData.value.map((contact, index) => {
    const email = contact[fieldMapping.value.email]
    if (!email) {
      return { row: index + 2, error: 'Missing email address' }
    }
    if (!isValidEmail(email)) {
      return { row: index + 2, error: `Invalid email: ${email}` }
    }
    return null
  }).filter(Boolean)
})

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleFileSelected = (file: File) => {
  uploadedFile.value = file
  processFile(file)
}

const processFile = (file: File) => {
  processing.value = true
  
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      headers.value = results.meta.fields || []
      previewData.value = results.data as any[]
      
      // Auto-map common fields
      autoMapFields()
      
      processing.value = false
    },
    error: (error) => {
      console.error('Error parsing CSV:', error)
      processing.value = false
    }
  })
}

const processPastedData = () => {
  processing.value = true
  
  Papa.parse(pastedData.value, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      headers.value = results.meta.fields || []
      previewData.value = results.data as any[]
      
      // Auto-map common fields
      autoMapFields()
      
      processing.value = false
    },
    error: (error) => {
      console.error('Error parsing data:', error)
      processing.value = false
    }
  })
}

const autoMapFields = () => {
  const mapping: Record<string, string> = {}
  
  for (const field of requiredFields) {
    const possibleHeaders = headers.value.filter(header => 
      header.toLowerCase().includes(field.key.toLowerCase()) ||
      header.toLowerCase().includes(field.key.replace('_', ' ').toLowerCase())
    )
    
    if (possibleHeaders.length > 0) {
      mapping[field.key] = possibleHeaders[0]
    }
  }
  
  fieldMapping.value = mapping
}

const performImport = async () => {
  importing.value = true
  
  try {
    const contactsToImport = validContacts.value.map(contact => {
      const mapped: any = {}
      
      for (const [field, column] of Object.entries(fieldMapping.value)) {
        if (column && contact[column]) {
          mapped[field] = contact[column]
        }
      }
      
      return mapped
    })

    const result = await contactsStore.importContacts({
      contacts: contactsToImport,
      contact_list_id: selectedContactList.value!,
      update_existing: updateExisting.value
    })

    importResults.value = {
      imported: result.imported,
      updated: result.updated
    }

    currentStep.value = 4
  } catch (error) {
    console.error('Import failed:', error)
  } finally {
    importing.value = false
  }
}

const resetImport = () => {
  currentStep.value = 1
  importMethod.value = 'file'
  uploadedFile.value = null
  pastedData.value = ''
  previewData.value = []
  headers.value = []
  fieldMapping.value = {}
  selectedContactList.value = null
  updateExisting.value = false
  importResults.value = { imported: 0, updated: 0 }
}

const handleListCreated = (newList: any) => {
  showCreateListModal.value = false
  selectedContactList.value = newList.id
  contactsStore.fetchContactLists()
}

onMounted(async () => {
  uiStore.setBreadcrumbs([
    { label: $t('contacts.title'), to: '/contacts' },
    { label: $t('contacts.import') }
  ])

  await contactsStore.fetchContactLists()
})
</script>