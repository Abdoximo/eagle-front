<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">Subscribe to Newsletter</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Campaign Info -->
          <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-medium text-blue-900">{{ campaign.company_name }}</h4>
            <p class="text-sm text-blue-700 mt-1">Stay updated with our latest news and offers</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubscribe" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                v-model="form.firstName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your first name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                v-model="form.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your last name"
              />
            </div>

            <!-- Privacy consent -->
            <div class="flex items-start">
              <input
                v-model="form.consent"
                type="checkbox"
                required
                class="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label class="ml-2 text-sm text-gray-600">
                I agree to receive email newsletters and promotional content. I can unsubscribe at any time.
              </label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !form.consent"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <span v-if="loading" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </span>
                <span v-else>Subscribe</span>
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
import { X } from 'lucide-vue-next'

const props = defineProps<{
  campaign: any
}>()

const emit = defineEmits<{
  close: []
  subscribe: [email: string]
}>()

const loading = ref(false)

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  consent: false
})

const handleSubscribe = async () => {
  loading.value = true
  
  try {
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('subscribe', form.value.email)
    
  } catch (error) {
    console.error('Subscription failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
