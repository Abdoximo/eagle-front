<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Form Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <User class="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? 'Edit Contact' : 'Add New Contact' }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ isEditing ? 'Update contact information' : 'Add a new contact to your list' }}
            </p>
          </div>
        </div>
        <button
          v-if="onCancel"
          @click="onCancel"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Form Body -->
    <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
      <!-- Contact List Selection -->
      <div v-if="!contact?.id">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contact List <span class="text-red-500 ml-1">*</span>
        </label>
        <select
          v-model="form.contact_list_id"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
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
        <p v-if="errors.contact_list_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.contact_list_id }}
        </p>
      </div>

      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Email -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address <span class="text-red-500 ml-1">*</span>
          </label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="john@example.com"
              :class="[
                'w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors',
                errors.email
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              ]"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            v-model="form.first_name"
            type="text"
            placeholder="John"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            v-model="form.last_name"
            type="text"
            placeholder="Doe"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div class="relative">
            <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Company -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company
          </label>
          <div class="relative">
            <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.company"
              type="text"
              placeholder="Acme Corp"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Custom Fields -->
      <div v-if="customFields.length > 0 || showCustomFields">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            Custom Fields
          </h3>
          <button
            v-if="!showCustomFields"
            @click="showCustomFields = true"
            type="button"
            class="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            + Add Custom Field
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(field, index) in customFields"
            :key="index"
            class="flex items-end space-x-3"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field Name
              </label>
              <input
                v-model="field.name"
                type="text"
                placeholder="e.g., Position, Department"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value
              </label>
              <input
                v-model="field.value"
                type="text"
                placeholder="Field value"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              @click="removeCustomField(index)"
              type="button"
              class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <button
            @click="addCustomField"
            type="button"
            class="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            <Plus class="w-4 h-4" />
            <span>Add Another Field</span>
          </button>
        </div>
      </div>

      <!-- Subscription Status -->
      <div class="flex items-start space-x-3">
        <input
          v-model="form.is_subscribed"
          type="checkbox"
          id="subscribed"
          class="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
        />
        <div>
          <label for="subscribed" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Subscribed to emails
          </label>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Contact will receive email campaigns
          </p>
        </div>
      </div>

      <!-- Contact Status (for editing) -->
      <div v-if="isEditing && contact?.bounce_count > 0" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <div class="flex items-center">
          <AlertCircle class="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
          <div class="text-sm">
            <p class="font-medium text-yellow-800 dark:text-yellow-200">
              Contact Status Warning
            </p>
            <p class="text-yellow-700 dark:text-yellow-300">
              This contact has {{ contact.bounce_count }} bounce(s).
              {{ contact.blocked_until ? `Blocked until ${formatDate(contact.blocked_until)}.` : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="submitError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
        <div class="flex items-center">
          <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
          <p class="text-sm text-red-600 dark:text-red-400">{{ submitError }}</p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          v-if="onCancel"
          @click="onCancel"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div v-if="loading" class="flex items-center">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </div>
          <span v-else>
            {{ isEditing ? 'Update Contact' : 'Create Contact' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { User, X, Mail, Phone, Building, Plus, Trash2, AlertCircle } from 'lucide-vue-next'
import { useContactsStore } from '@/stores/contacts'
import type { Contact, ContactList } from '@/types/contacts'

// Props
interface Props {
  contact?: Contact | null
  contactLists?: ContactList[]
  onCancel?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  contact: null,
  contactLists: () => []
})

// Emits
const emit = defineEmits<{
  created: [contact: Contact]
  updated: [contact: Contact]
  cancel: []
}>()

// Store
const contactsStore = useContactsStore()

// Reactive data
const loading = ref(false)
const submitError = ref('')
const showCustomFields = ref(false)

// Form data
const form = ref({
  contact_list_id: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  company: '',
  is_subscribed: true
})

// Custom fields
const customFields = ref<Array<{ name: string; value: string }>>([])

// Form errors
const errors = ref({
  contact_list_id: '',
  email: ''
})

// Computed
const isEditing = computed(() => !!props.contact)

const contactLists = computed(() => {
  return props.contactLists.length > 0 ? props.contactLists : contactsStore.contactLists
})

const isFormValid = computed(() => {
  return form.value.email.trim() && 
         (!isEditing.value ? form.value.contact_list_id : true) &&
         !errors.value.email && 
         !errors.value.contact_list_id
})

// Methods
const addCustomField = () => {
  customFields.value.push({ name: '', value: '' })
  showCustomFields.value = true
}

const removeCustomField = (index: number) => {
  customFields.value.splice(index, 1)
  if (customFields.value.length === 0) {
    showCustomFields.value = false
  }
}

const validateForm = () => {
  errors.value.email = ''
  errors.value.contact_list_id = ''

  // Email validation
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    return false
  }

  // Contact list validation (for new contacts)
  if (!isEditing.value && !form.value.contact_list_id) {
    errors.value.contact_list_id = 'Please select a contact list'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  submitError.value = ''

  try {
    // Prepare custom fields
    const customFieldsObj: Record<string, string> = {}
    customFields.value.forEach(field => {
      if (field.name.trim() && field.value.trim()) {
        customFieldsObj[field.name.trim()] = field.value.trim()
      }
    })

    const contactData = {
      ...form.value,
      custom_fields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
      email: form.value.email.trim(),
      first_name: form.value.first_name.trim() || undefined,
      last_name: form.value.last_name.trim() || undefined,
      phone: form.value.phone.trim() || undefined,
      company: form.value.company.trim() || undefined
    }

    if (isEditing.value && props.contact) {
      // Update existing contact
      const updatedContact = await contactsStore.updateContact(props.contact.id, contactData)
      emit('updated', updatedContact)
    } else {
      // Create new contact
      const newContact = await contactsStore.createContact(contactData)
      emit('created', newContact)
    }
  } catch (error: any) {
    submitError.value = error.message || 'An error occurred while saving the contact'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

// Initialize form with contact data (for editing)
const initializeForm = () => {
  if (props.contact) {
    form.value = {
      contact_list_id: props.contact.contact_list?.id?.toString() || '',
      email: props.contact.email || '',
      first_name: props.contact.first_name || '',
      last_name: props.contact.last_name || '',
      phone: props.contact.phone || '',
      company: props.contact.custom_fields?.company || '',
      is_subscribed: props.contact.is_subscribed !== false
    }

    // Initialize custom fields
    if (props.contact.custom_fields) {
      customFields.value = Object.entries(props.contact.custom_fields)
        .filter(([key]) => key !== 'company')
        .map(([name, value]) => ({ name, value: String(value) }))
      
      if (customFields.value.length > 0) {
        showCustomFields.value = true
      }
    }
  }
}

// Watch for contact changes
watch(() => props.contact, initializeForm, { immediate: true })

// Load contact lists if not provided
onMounted(() => {
  if (contactLists.value.length === 0) {
    contactsStore.fetchContactLists()
  }
})

// Real-time validation
watch(() => form.value.email, () => {
  if (errors.value.email) {
    validateForm()
  }
})

watch(() => form.value.contact_list_id, () => {
  if (errors.value.contact_list_id) {
    validateForm()
  }
})
</script>