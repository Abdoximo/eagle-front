<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Email Address *
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="john@example.com"
      />
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Name
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="John Doe"
      />
    </div>

    <div class="flex items-center space-x-3 pt-4">
      <button
        type="submit"
        :disabled="!form.email || loading"
        class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </span>
        <span v-else>Add Contact</span>
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import { showError } from '@/services/toast'

interface Props {
  listId?: number
}

const props = withDefaults(defineProps<Props>(), {
  listId: undefined
})

const emit = defineEmits<{
  success: [contact: any]
  cancel: []
}>()

const contactsStore = useContactsStore()
const loading = ref(false)

const form = ref({
  email: '',
  name: ''
})

const handleSubmit = async () => {
  if (!form.value.email) return

  loading.value = true
  try {
    const contactData = {
      email: form.value.email,
      name: form.value.name || '',
      contact_list_ids: props.listId ? [props.listId] : []
    }

    const contact = await contactsStore.createContact(contactData)
    emit('success', contact)
  } catch (error: any) {
    showError(error.message || 'Failed to add contact')
  } finally {
    loading.value = false
  }
}
</script>
