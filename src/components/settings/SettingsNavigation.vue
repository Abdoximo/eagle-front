<template>
  <nav class="space-y-1">
    <button
      v-for="tab in availableTabs"
      :key="tab.id"
      @click="$emit('tabChanged', tab.id)"
      :class="[
        activeTab === tab.id
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
          : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left transition-colors duration-200'
      ]"
    >
      <component :is="getIcon(tab.icon)" class="flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
      <span>{{ $t(tab.label) }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { 
  User, 
  Lock, 
  Server, 
  CreditCard, 
  Settings, 
  Palette,
  Globe
} from 'lucide-vue-next'

import type { SettingsTab } from '@/types/settings'

interface Props {
  activeTab: string
  availableTabs: SettingsTab[]
}

interface Emits {
  (e: 'tabChanged', tabId: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()

const iconMap = {
  User,
  Lock,
  Server,
  CreditCard,
  Settings,
  Palette,
  Globe
}

const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || User
}
</script>