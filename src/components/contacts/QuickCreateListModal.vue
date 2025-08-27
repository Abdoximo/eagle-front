<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Quick Create List</h2>
            <button
              @click="close"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <div class="space-y-4">
            <!-- List Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                List Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g., Newsletter Subscribers"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Describe this contact list..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <!-- Quick Add Contacts -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Contacts (Optional)
              </label>
              <textarea
                v-model="contactsText"
                rows="4"
                placeholder="Add email addresses, one per line:&#10;john@example.com&#10;jane@example.com"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ contactsCount }} email{{ contactsCount !== 1 ? 's' : '' }} detected
              </p>
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
              type="submit"
              :disabled="!form.name.trim() || loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Creating...</span>
              <span v-else>Create List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { showSuccess, showError } from '@/services/toast'

interface Emits {
  (e: 'close'): void
  (e: 'created', list: any): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)
const form = ref({
  name: '',
  description: ''
})
const contactsText = ref('')

const contactsCount = computed(() => {
  if (!contactsText.value.trim()) return 0
  const emails = contactsText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && /\S+@\S+\.\S+/.test(line))
  return emails.length
})

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) return
  
  loading.value = true
  try {
    // For now, simulate creating the contact list
    // In a real implementation, you would call the API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    const newList = {
      id: Math.floor(Math.random() * 1000),
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      contacts_count: contactsCount.value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    emit('created', newList)
    showSuccess(`Created "${newList.name}" with ${contactsCount.value} contacts`)
  } catch (error: any) {
    showError(error.message || 'Failed to create contact list')
  } finally {
    loading.value = false
  }
}
</script>
