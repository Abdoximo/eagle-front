<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-red-600 sm:text-5xl">403</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 dark:sm:border-gray-700 sm:pl-6">
            <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
              {{ t('errors.403.title') }}
            </h1>
            <p class="mt-1 text-base text-gray-500 dark:text-gray-400">
              {{ t('errors.403.description') }}
            </p>
          </div>
          <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <Button @click="goBack" variant="outline">
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ t('errors.403.go_back') }}
            </Button>
            <Button @click="goHome">
              <HomeIcon class="w-4 h-4 mr-2" />
              {{ t('errors.403.go_home') }}
            </Button>
          </div>
        </div>
      </main>

      <!-- Access information -->
      <div class="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ t('errors.403.access_denied') }}
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ t('errors.403.access_message') }}</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>{{ t('errors.403.reason_1') }}</li>
                  <li>{{ t('errors.403.reason_2') }}</li>
                  <li>{{ t('errors.403.reason_3') }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User information -->
      <div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ t('errors.403.current_access') }}
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('errors.403.logged_in_as') }}
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ authStore.user?.email || 'Anonymous' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('errors.403.current_role') }}
            </span>
            <Badge :variant="getRoleVariant(authStore.user?.role)">
              {{ authStore.user?.role || 'Guest' }}
            </Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('errors.403.account_status') }}
            </span>
            <Badge :variant="getStatusVariant(authStore.user?.status)">
              {{ authStore.user?.status || 'Unknown' }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Action suggestions -->
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ t('errors.403.what_can_you_do') }}
        </h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="action in suggestedActions"
            :key="action.title"
            class="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all cursor-pointer"
            @click="action.onClick"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <component :is="action.icon" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ action.title }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ action.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact admin -->
      <div class="mt-8 text-center">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex items-center justify-center">
            <InformationCircleIcon class="h-5 w-5 text-blue-400 mr-2" />
            <p class="text-sm text-blue-800 dark:text-blue-200">
              {{ t('errors.403.need_access') }}
              <button
                @click="contactAdmin"
                class="font-medium text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-300 underline ml-1"
              >
                {{ t('errors.403.contact_admin') }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Admin Modal -->
    <Modal
      :show="showContactModal"
      :title="t('errors.403.request_access')"
      @close="showContactModal = false"
    >
      <div class="space-y-4">
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400 mt-0.5" />
            <div class="ml-3">
              <p class="text-sm text-yellow-800 dark:text-yellow-200">
                {{ t('errors.403.access_request_info') }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label class="form-label">{{ t('errors.403.requested_resource') }}</label>
          <Input
            v-model="accessRequest.resource"
            :placeholder="t('errors.403.resource_placeholder')"
            readonly
          />
        </div>

        <div>
          <label class="form-label">{{ t('errors.403.business_justification') }}</label>
          <textarea
            v-model="accessRequest.justification"
            class="input w-full"
            rows="4"
            :placeholder="t('errors.403.justification_placeholder')"
            required
          ></textarea>
        </div>

        <div>
          <label class="form-label">{{ t('errors.403.urgency') }}</label>
          <select v-model="accessRequest.urgency" class="input w-full">
            <option value="low">{{ t('errors.403.urgency_low') }}</option>
            <option value="medium">{{ t('errors.403.urgency_medium') }}</option>
            <option value="high">{{ t('errors.403.urgency_high') }}</option>
            <option value="critical">{{ t('errors.403.urgency_critical') }}</option>
          </select>
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showContactModal = false">
            {{ t('common.buttons.cancel') }}
          </Button>
          <Button
            @click="submitAccessRequest"
            :loading="submittingRequest"
            :disabled="!accessRequest.justification.trim()"
          >
            {{ t('errors.403.submit_request') }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import {
  ArrowLeftIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  KeyIcon,
  CogIcon,
  PhoneIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const showContactModal = ref(false)
const submittingRequest = ref(false)
const accessRequest = ref({
  resource: '',
  justification: '',
  urgency: 'medium'
})

const suggestedActions = computed(() => [
  {
    title: t('errors.403.switch_account'),
    description: t('errors.403.switch_account_desc'),
    icon: UserIcon,
    onClick: () => {
      authStore.logout()
      router.push('/login')
    }
  },
  {
    title: t('errors.403.check_permissions'),
    description: t('errors.403.check_permissions_desc'),
    icon: KeyIcon,
    onClick: () => router.push('/settings/account')
  },
  {
    title: t('errors.403.view_help'),
    description: t('errors.403.view_help_desc'),
    icon: QuestionMarkCircleIcon,
    onClick: () => router.push('/help/permissions')
  },
  {
    title: t('errors.403.account_settings'),
    description: t('errors.403.account_settings_desc'),
    icon: CogIcon,
    onClick: () => router.push('/settings')
  }
])

const getRoleVariant = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'super_admin':
      return 'success'
    case 'manager':
    case 'moderator':
      return 'primary'
    case 'user':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success'
    case 'pending':
      return 'warning'
    case 'suspended':
    case 'banned':
      return 'danger'
    default:
      return 'secondary'
  }
}

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

const contactAdmin = () => {
  showContactModal.value = true
}

const submitAccessRequest = async () => {
  submittingRequest.value = true
  
  try {
    await authStore.submitAccessRequest({
      resource: accessRequest.value.resource,
      justification: accessRequest.value.justification,
      urgency: accessRequest.value.urgency,
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
    
    showContactModal.value = false
    accessRequest.value = {
      resource: '',
      justification: '',
      urgency: 'medium'
    }
    
    // Show success message
    alert(t('errors.403.request_submitted'))
    
  } catch (error) {
    console.error('Failed to submit access request:', error)
    alert(t('errors.403.request_failed'))
  } finally {
    submittingRequest.value = false
  }
}

onMounted(() => {
  // Pre-fill the resource field with current URL
  accessRequest.value.resource = window.location.pathname
})
</script>

<style scoped>
/* Scoped styles go here */
</style>