<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customize Template</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Template Info -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ template.name }}</h4>
            <p class="text-gray-600 dark:text-gray-300 text-sm">{{ template.description }}</p>
          </div>

          <!-- Customization Form -->
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <!-- Subject Line -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Subject Line
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email subject..."
                />
              </div>

              <!-- Variables -->
              <div v-if="template.variables && template.variables.length">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Variables
                </label>
                <div class="space-y-3">
                  <div v-for="variable in template.variables" :key="variable" class="flex items-center gap-3">
                    <label class="text-sm text-gray-600 dark:text-gray-300 w-32">{{ variable }}:</label>
                    <input
                      v-model="form.variables[variable]"
                      type="text"
                      class="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm dark:bg-gray-700 dark:text-white"
                      :placeholder="`Enter ${variable}...`"
                    />
                  </div>
                </div>
              </div>
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
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

interface Template {
  id: number
  name: string
  description: string
  variables?: string[]
}

interface Props {
  template: Template
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  customize: [data: any]
}>()

const form = ref({
  subject: '',
  variables: {} as Record<string, string>
})

onMounted(() => {
  // Initialize variables with placeholders
  if (props.template.variables) {
    props.template.variables.forEach(variable => {
      form.value.variables[variable] = ''
    })
  }
})

const handleSubmit = () => {
  emit('customize', {
    template: props.template,
    subject: form.value.subject,
    variables: form.value.variables
  })
}
</script>
