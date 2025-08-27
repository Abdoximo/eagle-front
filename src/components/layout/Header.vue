<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Mobile menu button -->
      <button
        @click="uiStore.toggleMobileMenu"
        class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>

      <!-- Search -->
      <div class="hidden sm:block flex-1 max-w-lg mx-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <button
          @click="uiStore.toggleTheme"
          class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          :title="uiStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <SunIcon v-if="uiStore.isDark" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <BellIcon class="w-5 h-5" />
            <span
              v-if="uiStore.unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ uiStore.unreadCount > 9 ? '9+' : uiStore.unreadCount }}
            </span>
          </button>

          <!-- Notifications dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                  <button
                    v-if="uiStore.unreadCount > 0"
                    @click="uiStore.markAllAsRead"
                    class="text-sm text-primary hover:text-primary/80"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in uiStore.notifications.slice(0, 10)"
                  :key="notification.id"
                  class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="flex items-start">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ notification.title }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {{ formatDistanceFromNow(notification.timestamp) }}
                      </p>
                    </div>
                    <div v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full ml-2 mt-2"></div>
                  </div>
                </div>
                
                <div v-if="uiStore.notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Language selector -->
        <Dropdown>
          <template #trigger>
            <button class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <GlobeAltIcon class="w-5 h-5" />
            </button>
          </template>
          
          <div class="py-1">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 dark:bg-gray-700': uiStore.language === lang.code }"
            >
              {{ lang.name }}
            </button>
          </div>
        </Dropdown>

        <!-- User menu -->
        <Dropdown position="right">
          <template #trigger>
            <button class="flex items-center space-x-2 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                {{ authStore.user?.name }}
              </span>
              <ChevronDownIcon class="w-4 h-4 text-gray-500" />
            </button>
          </template>
          
          <div class="py-1">
            <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
            </div>
            
            <router-link
              to="/settings/profile"
              class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UserIcon class="w-4 h-4 mr-2" />
              {{ $t('settings.profile.title') }}
            </router-link>
            
            <router-link
              to="/settings/billing"
              class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CreditCardIcon class="w-4 h-4 mr-2" />
              {{ $t('settings.billing.title') }}
            </router-link>
            
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
              {{ $t('auth.logout') }}
            </button>
          </div>
        </Dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { formatDistanceFromNow } from '@/utils/helpers'
import Dropdown from '@/components/ui/Dropdown.vue'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  UserIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const uiStore = useUIStore()

const showNotifications = ref(false)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
]

const changeLanguage = (langCode: string) => {
  uiStore.setLanguage(langCode)
}

const handleLogout = async () => {
  await authStore.logout()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notifications-dropdown')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>