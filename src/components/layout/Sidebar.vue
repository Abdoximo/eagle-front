<template>
  <!-- Mobile sidebar overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click="$emit('closeMobile')"
    >
      <div class="fixed inset-0 bg-black/50" />
    </div>
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 flex flex-col',
      collapsed ? 'w-16' : 'w-64',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <router-link to="/dashboard" class="flex items-center">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">ES</span>
        </div>
        <span v-if="!collapsed" class="ml-3 text-xl font-bold text-gray-900 dark:text-white">
          EmailSaaS
        </span>
      </router-link>
    </div>

    <!-- Navigation - Scrollable -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <!-- Main Navigation -->
      <ul class="space-y-1">
        <li v-for="item in navigationItems" :key="item.name">
          <router-link
            :to="item.to"
            :class="[
              'sidebar-nav-item',
              'group',
              $route.path.startsWith(item.to) 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :title="collapsed ? item.name : ''"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="ml-3 truncate">{{ $t(item.label) }}</span>
          </router-link>
        </li>
      </ul>

      <!-- Admin section -->
      <div v-if="authStore.isAdmin" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 v-if="!collapsed" class="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ $t('admin.title') }}
        </h3>
        <ul class="space-y-1">
          <li v-for="item in adminItems" :key="item.name">
            <router-link
              :to="item.to"
              :class="[
                'sidebar-nav-item',
                'group',
                $route.path.startsWith(item.to)
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
              :title="collapsed ? item.name : ''"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!collapsed" class="ml-3 truncate">{{ $t(item.label) }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom section -->
    <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
      <!-- Credits display -->
      <div v-if="!collapsed" class="p-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Credits</span>
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
              {{ formatNumber(authStore.userCredits) }}
            </span>
          </div>
          <router-link
            to="/settings/billing"
            class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('settings.billing.purchase_credits') }}
          </router-link>
        </div>
      </div>

      <!-- Collapse toggle -->
      <div class="p-4">
        <button
          @click="uiStore.toggleSidebar"
          :class="[
            'w-full flex items-center justify-center py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors',
            collapsed ? 'px-2' : 'px-3'
          ]"
        >
          <ChevronLeftIcon v-if="!collapsed" class="w-5 h-5" />
          <ChevronRightIcon v-else class="w-5 h-5" />
          <span v-if="!collapsed" class="ml-2 text-sm font-medium">Collapse</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { formatNumber } from '@/utils/helpers'
import {
  HomeIcon,
  EnvelopeIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  ServerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

interface Props {
  collapsed: boolean
  mobileOpen: boolean
}

defineProps<Props>()
defineEmits<{
  closeMobile: []
}>()

const authStore = useAuthStore()
const uiStore = useUIStore()

const navigationItems = computed(() => [
  {
    name: 'Dashboard',
    label: 'dashboard.title',
    to: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Campaigns',
    label: 'campaigns.title',
    to: '/campaigns',
    icon: EnvelopeIcon
  },
  {
    name: 'Contacts',
    label: 'contacts.title',
    to: '/contacts',
    icon: UsersIcon
  },
  {
    name: 'Templates',
    label: 'templates.title',
    to: '/templates',
    icon: DocumentTextIcon
  },
  {
    name: 'Billing',
    label: 'billing.title',
    to: '/billing',
    icon: CreditCardIcon
  },
  {
    name: 'Settings',
    label: 'settings.title',
    to: '/settings',
    icon: CogIcon
  }
])

const adminItems = computed(() => [
  {
    name: 'Admin Dashboard',
    label: 'admin.dashboard.title',
    to: '/admin/dashboard',
    icon: ChartBarIcon
  },
  {
    name: 'Users',
    label: 'admin.users.title',
    to: '/admin/users',
    icon: UserGroupIcon
  },
  {
    name: 'SMTP Servers',
    label: 'admin.smtp.title',
    to: '/admin/smtp',
    icon: ServerIcon
  },
  {
    name: 'System Settings',
    label: 'admin.settings.title',
    to: '/admin/settings',
    icon: Cog6ToothIcon
  },
  {
    name: 'Stripe Settings',
    label: 'admin.stripe.title',
    to: '/admin/stripe',
    icon: CreditCardIcon
  },
  {
    name: 'Templates',
    label: 'admin.templates.title',
    to: '/admin/templates',
    icon: DocumentTextIcon
  },
  {
    name: 'Reports',
    label: 'admin.reports.title',
    to: '/admin/reports',
    icon: DocumentChartBarIcon
  }
])
</script>

<style scoped>
.sidebar-nav-item {
  @apply flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors;
}

.sidebar-nav-item.active {
  @apply bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300;
}

.sidebar-nav-item:not(.active) {
  @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}
</style>