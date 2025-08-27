<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="relative p-8 text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-t-2xl">
          <button
            @click="close"
            class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
          
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🦅</span>
          </div>
          
          <h2 class="text-2xl font-bold mb-2">Welcome to Eagle Email!</h2>
          <p class="text-blue-100">Let's get you started with your first email campaign</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <div class="space-y-6">
            <!-- Steps -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Here's how to send your first campaign:
              </h3>
              
              <div v-for="(step, index) in steps" :key="step.id" class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ step.title }}</h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ step.description }}</p>
                  <button
                    v-if="step.action"
                    @click="step.action"
                    class="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {{ step.actionText }} →
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Credits Info -->
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div class="flex items-center space-x-2 text-green-700 dark:text-green-400">
                <Gift class="w-5 h-5" />
                <span class="font-medium">You have {{ userCredits }} free credits to start!</span>
              </div>
              <p class="text-green-600 dark:text-green-300 text-sm mt-1">
                Each email sent costs 1 credit. Perfect for testing your campaigns.
              </p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <label class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                v-model="dontShowAgain"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Don't show this again</span>
            </label>
            
            <div class="flex items-center space-x-3">
              <button
                @click="close"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Skip for now
              </button>
              <button
                @click="startFirstCampaign"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Create First Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { X, Gift } from 'lucide-vue-next'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const authStore = useAuthStore()

const dontShowAgain = ref(false)

const userCredits = computed(() => authStore.userCredits || 500)

const steps = [
  {
    id: 'contacts',
    title: 'Add Your Contacts',
    description: 'Create a contact list and add email addresses of people who want to receive your emails.',
    action: () => {
      close()
      router.push('/contacts')
    },
    actionText: 'Go to Contacts'
  },
  {
    id: 'template',
    title: 'Choose a Template',
    description: 'Select from our beautiful email templates or create your own design.',
    action: () => {
      close()
      router.push('/templates')
    },
    actionText: 'Browse Templates'
  },
  {
    id: 'campaign',
    title: 'Create Campaign',
    description: 'Combine your contacts and template to create a professional email campaign.',
    action: () => {
      close()
      router.push('/campaigns/create')
    },
    actionText: 'Create Campaign'
  },
  {
    id: 'send',
    title: 'Send & Track',
    description: 'Send your campaign and track opens, clicks, and engagement in real-time.',
    action: null,
    actionText: null
  }
]

const close = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('eagle_welcome_dismissed', 'true')
  }
  emit('close')
}

const startFirstCampaign = () => {
  close()
  router.push('/campaigns/create')
}
</script>

