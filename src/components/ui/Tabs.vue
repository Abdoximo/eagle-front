<template>
  <div class="w-full">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="setActiveTab(tab.key)"
          :class="getTabClasses(tab.key)"
          :aria-selected="activeTab === tab.key"
          type="button"
        >
          <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4 mr-2" />
          {{ tab.label }}
          <span v-if="tab.badge" class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300">
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>
    
    <div class="mt-4">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Tab {
  key: string
  label: string
  icon?: any
  badge?: string | number
}

interface Props {
  tabs: Tab[]
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'tab-change': [tab: string]
}>()

const activeTab = ref(props.modelValue || props.tabs[0]?.key || '')

const setActiveTab = (tabKey: string) => {
  activeTab.value = tabKey
  emit('update:modelValue', tabKey)
  emit('tab-change', tabKey)
}

const getTabClasses = (tabKey: string) => {
  const baseClasses = 'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
  const activeClasses = 'border-primary text-primary'
  const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
  
  return activeTab.value === tabKey 
    ? `${baseClasses} ${activeClasses}`
    : `${baseClasses} ${inactiveClasses}`
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})
</script>