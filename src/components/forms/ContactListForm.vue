<template>
  <div class="space-y-6">
    <!-- Form Header -->
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
        <Users class="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Contact List' : 'Create Contact List' }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isEditing ? 'Update contact list information' : 'Organize your contacts into targeted lists' }}
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="submitError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
      <div class="flex items-center">
        <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
        <p class="text-sm text-red-600 dark:text-red-400">{{ submitError }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- List Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          List Name <span class="text-red-500 ml-1">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="e.g., Newsletter Subscribers"
          :class="[
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-11',
            errors.name
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600',
            'dark:bg-gray-700 dark:text-white'
          ]"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.name }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Describe the purpose of this contact list..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ form.description?.length || 0 }}/200 characters
        </p>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        <div class="space-y-3">
          <!-- Tag Input -->
          <div class="flex space-x-2">
            <input
              v-model="newTag"
              @keydown.enter.prevent="addTag"
              type="text"
              placeholder="Add a tag..."
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-11"
            />
            <button
              @click="addTag"
              type="button"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors h-11"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <!-- Tags Display -->
          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              {{ tag }}
              <button
                @click="removeTag(index)"
                type="button"
                class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
          List Settings
        </h3>
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="form.settings.double_optin"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Require double opt-in confirmation
            </span>
          </label>
          <label class="flex items-center">
            <input
              v-model="form.settings.auto_cleanup"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Automatically remove bounced emails
            </span>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors h-11"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-11"
        >
          <div v-if="loading" class="flex items-center">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </div>
          <span v-else>
            {{ isEditing ? 'Update List' : 'Create List' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Users, X, Plus, AlertCircle } from 'lucide-vue-next'
import { useContactsStore } from '@/stores/contacts'
import type { ContactList } from '@/types/contacts'

// Props
interface Props {
  contactList?: ContactList | null
}

const props = withDefaults(defineProps<Props>(), {
  contactList: null
})

// Emits
const emit = defineEmits<{
  success: [list: ContactList]
  cancel: []
}>()

// Store
const contactsStore = useContactsStore()

// Reactive data
const loading = ref(false)
const submitError = ref('')
const newTag = ref('')

// Form data
const form = ref({
  name: '',
  description: '',
  tags: [] as string[],
  settings: {
    double_optin: false,
    auto_cleanup: true
  }
})

// Form errors
const errors = ref({
  name: ''
})

// Computed
const isEditing = computed(() => !!props.contactList)

const isFormValid = computed(() => {
  return form.value.name.trim().length >= 2 && !errors.value.name
})

// Methods
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
}

const validateForm = () => {
  errors.value.name = ''
  
  if (!form.value.name.trim()) {
    errors.value.name = 'List name is required'
    return false
  }
  
  if (form.value.name.trim().length < 2) {
    errors.value.name = 'List name must be at least 2 characters'
    return false
  }
  
  if (form.value.name.trim().length > 100) {
    errors.value.name = 'List name must be less than 100 characters'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  submitError.value = ''
  
  try {
    const data = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || '',
      tags: form.value.tags,
      settings: form.value.settings
    }
    
    if (isEditing.value && props.contactList) {
      // Update existing list
      const updatedList = await contactsStore.updateContactList(props.contactList.id, data)
      emit('success', updatedList)
    } else {
      // Create new list
      const newList = await contactsStore.createContactList(data)
      emit('success', newList)
    }
  } catch (error: any) {
    submitError.value = error.message || 'An error occurred while saving the contact list'
  } finally {
    loading.value = false
  }
}

// Watch for contact list changes (for editing)
watch(
  () => props.contactList,
  (contactList) => {
    if (contactList) {
      form.value.name = contactList.name
      form.value.description = contactList.description || ''
      form.value.tags = [...(contactList.tags || [])]
      form.value.settings = {
        double_optin: contactList.settings?.double_optin || false,
        auto_cleanup: contactList.settings?.auto_cleanup !== false
      }
    } else {
      // Reset form for new list
      form.value.name = ''
      form.value.description = ''
      form.value.tags = []
      form.value.settings = {
        double_optin: false,
        auto_cleanup: true
      }
    }
    errors.value.name = ''
    submitError.value = ''
  },
  { immediate: true }
)

// Real-time validation
watch(
  () => form.value.name,
  () => {
    if (errors.value.name) {
      validateForm()
    }
  }
)
</script>

<style scoped>
/* Scoped styles go here */
</style>
