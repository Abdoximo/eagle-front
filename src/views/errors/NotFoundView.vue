<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-primary sm:text-5xl">404</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 dark:sm:border-gray-700 sm:pl-6">
            <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
              {{ $t('errors.404.title') }}
            </h1>
            <p class="mt-1 text-base text-gray-500 dark:text-gray-400">
              {{ $t('errors.404.description') }}
            </p>
          </div>
          <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <Button @click="goBack" variant="outline">
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ $t('errors.404.go_back') }}
            </Button>
            <Button @click="goHome">
              <HomeIcon class="w-4 h-4 mr-2" />
              {{ $t('errors.404.go_home') }}
            </Button>
          </div>
        </div>
      </main>

      <!-- Additional help section -->
      <div class="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('errors.404.help_title') }}
          </h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="link in helpfulLinks" :key="link.name">
              <router-link :to="link.to" class="relative block p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <component :is="link.icon" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <h3 class="mt-2 text-base font-medium text-gray-900 dark:text-white">
                  {{ link.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ link.description }}
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Search section -->
      <div class="mt-8 max-w-md mx-auto">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {{ $t('errors.404.search_title') }}
          </h3>
          <div class="flex space-x-2">
            <Input
              v-model="searchQuery"
              type="search"
              :placeholder="$t('errors.404.search_placeholder')"
              class="flex-1"
              @keyup.enter="performSearch"
            />
            <Button @click="performSearch" :disabled="!searchQuery.trim()">
              <MagnifyingGlassIcon class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Contact support -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('errors.404.still_need_help') }}
          <button
            @click="openSupportModal"
            class="font-medium text-primary hover:text-primary/80"
          >
            {{ $t('errors.404.contact_support') }}
          </button>
        </p>
      </div>
    </div>

    <!-- Support Modal -->
    <Modal
      :show="showSupportModal"
      :title="$t('support.contact_title')"
      @close="showSupportModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="form-label">{{ $t('support.subject') }}</label>
          <Input
            v-model="supportForm.subject"
            :placeholder="$t('support.subject_placeholder')"
          />
        </div>
        
        <div>
          <label class="form-label">{{ $t('support.message') }}</label>
          <textarea
            v-model="supportForm.message"
            class="input w-full"
            rows="4"
            :placeholder="$t('support.message_placeholder')"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showSupportModal = false">
            {{ $t('common.buttons.cancel') }}
          </Button>
          <Button
            @click="submitSupport"
            :loading="supportSubmitting"
            :disabled="!supportForm.subject.trim() || !supportForm.message.trim()"
          >
            {{ $t('support.send_message') }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import {
  ArrowLeftIcon,
  HomeIcon,
  EnvelopeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const showSupportModal = ref(false)
const supportSubmitting = ref(false)
const supportForm = ref({
  subject: '',
  message: ''
})

const helpfulLinks = [
  {
    name: 'Dashboard',
    description: 'View your campaign overview',
    icon: ChartBarIcon,
    to: '/dashboard'
  },
  {
    name: 'Campaigns',
    description: 'Manage your email campaigns',
    icon: EnvelopeIcon,
    to: '/campaigns'
  },
  {
    name: 'Contacts',
    description: 'Manage your contact lists',
    icon: UsersIcon,
    to: '/contacts'
  },
  {
    name: 'Templates',
    description: 'Create and edit email templates',
    icon: DocumentTextIcon,
    to: '/templates'
  },
  {
    name: 'Settings',
    description: 'Configure your account',
    icon: CogIcon,
    to: '/settings'
  },
  {
    name: 'Help Center',
    description: 'Browse documentation and guides',
    icon: QuestionMarkCircleIcon,
    to: '/help'
  }
]

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const goHome = () => {
  router.push('/dashboard')
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // Navigate to search results or campaigns with search filter
  router.push({
    path: '/campaigns',
    query: { search: searchQuery.value.trim() }
  })
}

const openSupportModal = () => {
  showSupportModal.value = true
  supportForm.value = {
    subject: '404 Error - Page Not Found',
    message: `I was trying to access a page that doesn't exist. The URL was: ${window.location.href}\n\nPlease help me find what I was looking for.`
  }
}

const submitSupport = async () => {
  supportSubmitting.value = true
  
  try {
    // Submit support request
    await authStore.submitSupportRequest({
      subject: supportForm.value.subject,
      message: supportForm.value.message,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
    
    showSupportModal.value = false
    supportForm.value = { subject: '', message: '' }
    
    // Show success message
    // This would typically be handled by a toast/notification system
    alert('Support request submitted successfully!')
    
  } catch (error) {
    console.error('Failed to submit support request:', error)
    alert('Failed to submit support request. Please try again.')
  } finally {
    supportSubmitting.value = false
  }
}
</script>