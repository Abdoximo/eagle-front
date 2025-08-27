<template>
  <div class="text-center py-12">
    <!-- Icon -->
    <div class="mb-4">
      <component
        :is="iconComponent"
        :class="[
          'mx-auto h-12 w-12',
          iconColor || 'text-gray-400'
        ]"
      />
    </div>
    
    <!-- Title -->
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    
    <!-- Description -->
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>
    
    <!-- Action Button -->
    <button
      v-if="action"
      @click="action.onClick"
      :class="[
        'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors duration-200',
        action.variant === 'secondary'
          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      ]"
    >
      <component
        v-if="action.icon"
        :is="getIcon(action.icon)"
        class="w-4 h-4 mr-2"
      />
      {{ action.label }}
    </button>
    
    <!-- Secondary Action -->
    <button
      v-if="secondaryAction"
      @click="secondaryAction.onClick"
      class="block mx-auto mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
    >
      {{ secondaryAction.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Users,
  Mail,
  FileText,
  Folder,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Upload,
  Download,
  Eye,
  Heart
} from 'lucide-vue-next'

interface Action {
  label: string
  onClick: () => void
  icon?: string
  variant?: 'primary' | 'secondary'
}

interface Props {
  title: string
  description: string
  icon: string
  iconColor?: string
  action?: Action
  secondaryAction?: Action
}

const props = defineProps<Props>()

// Icon mapping
const iconMap = {
  Users,
  Mail,
  FileText,
  Folder,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Upload,
  Download,
  Eye,
  Heart
}

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || FileText
})

const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Plus
}
</script>

<style scoped>
/* Subtle animations */
.hover\:bg-gray-200:hover,
.hover\:bg-blue-700:hover,
.hover\:bg-gray-600:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .hover\:bg-gray-600:hover,
.dark .hover\:bg-blue-700:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Focus states */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Icon animation */
.mx-auto {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Text animation */
h3, p {
  animation: fadeIn 0.5s ease-out 0.1s both;
}

button {
  animation: fadeIn 0.5s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>