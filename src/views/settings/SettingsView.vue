<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <SettingsHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-3">
          <SettingsNavigation 
            :active-tab="activeTab" 
            :available-tabs="availableTabs"
            @tab-changed="handleTabChange" 
          />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-9">
          <component 
            :is="currentComponent" 
            :key="activeTab"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

// Components
import SettingsHeader from '@/components/settings/SettingsHeader.vue'
import SettingsNavigation from '@/components/settings/SettingsNavigation.vue'
import ProfileSettings from '@/components/settings/ProfileSettings.vue'
import PasswordSettings from '@/components/settings/PasswordSettings.vue'
import SmtpSettings from '@/components/settings/SmtpSettings.vue'
import PostalApiSettings from '@/views/settings/PostalApiSettingsView.vue'
import BillingSettings from '@/components/settings/BillingSettings.vue'
import AdminSettings from '@/components/settings/AdminSettings.vue'
import PreferencesSettings from '@/components/settings/PreferencesSettings.vue'

// Types
import type { SettingsTab } from '@/types/settings'

// Composables
const { t } = useI18n()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

// State
const activeTab = ref<string>('profile')

// Computed
const isAdmin = computed(() => authStore.user?.role === 'admin')

const availableTabs = computed((): SettingsTab[] => {
  const baseTabs: SettingsTab[] = [
    {
      id: 'profile',
      label: 'settings.tabs.profile',
      icon: 'User',
      component: 'ProfileSettings'
    },
    {
      id: 'password',
      label: 'settings.tabs.password',
      icon: 'Lock',
      component: 'PasswordSettings'
    },
    {
      id: 'smtp',
      label: 'settings.tabs.smtp',
      icon: 'Server',
      component: 'SmtpSettings'
    },
    {
      id: 'postal-api',
      label: 'settings.tabs.postal_api',
      icon: 'Globe',
      component: 'PostalApiSettings'
    }
  ]

  // Add billing for regular users
  if (!isAdmin.value) {
    baseTabs.push({
      id: 'billing',
      label: 'settings.tabs.billing',
      icon: 'CreditCard',
      component: 'BillingSettings'
    })
  }

  // Add admin tab for admins
  if (isAdmin.value) {
    baseTabs.push({
      id: 'admin',
      label: 'settings.tabs.admin',
      icon: 'Settings',
      component: 'AdminSettings'
    })
  }

  // Add preferences for all users
  baseTabs.push({
    id: 'preferences',
    label: 'settings.tabs.preferences',
    icon: 'Palette',
    component: 'PreferencesSettings'
  })

  return baseTabs
})

const currentComponent = computed(() => {
  const componentMap: Record<string, any> = {
    profile: ProfileSettings,
    password: PasswordSettings,
    smtp: SmtpSettings,
    'postal-api': PostalApiSettings,
    billing: BillingSettings,
    admin: AdminSettings,
    preferences: PreferencesSettings
  }
  
  return componentMap[activeTab.value] || ProfileSettings
})

// Methods
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

// Lifecycle
onMounted(async () => {
  await settingsStore.fetchUserSettings()
  if (isAdmin.value) {
    await settingsStore.fetchAdminSettings()
  }
})
</script>