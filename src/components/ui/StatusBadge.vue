<template>
  <span :class="[
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    sizeClasses,
    variantClasses
  ]">
    <component 
      v-if="showIcon" 
      :is="getStatusIcon()" 
      :class="iconClasses" 
    />
    <span :class="{ 'ml-1.5': showIcon }">{{ getStatusLabel() }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Clock, CheckCircle, Send, Pause, XCircle, AlertTriangle,
  Mail, Eye, MousePointer, RefreshCw
} from 'lucide-vue-next'

interface Props {
  status: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showIcon: true
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs'
    case 'lg':
      return 'px-3 py-1 text-sm'
    default:
      return 'px-2.5 py-0.5 text-xs'
  }
})

const iconClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    default:
      return 'w-3 h-3'
  }
})

const variantClasses = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'sending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'sent':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'paused':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'queued':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'opened':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'clicked':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'bounced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'complained':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'unsubscribed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
})

const getStatusIcon = () => {
  switch (props.status.toLowerCase()) {
    case 'draft':
      return Clock
    case 'scheduled':
      return Clock
    case 'sending':
      return RefreshCw
    case 'sent':
      return CheckCircle
    case 'paused':
      return Pause
    case 'cancelled':
    case 'failed':
      return XCircle
    case 'queued':
      return Clock
    case 'delivered':
      return Mail
    case 'opened':
      return Eye
    case 'clicked':
      return MousePointer
    case 'bounced':
      return AlertTriangle
    case 'complained':
      return AlertTriangle
    case 'unsubscribed':
      return XCircle
    default:
      return Clock
  }
}

const getStatusLabel = () => {
  switch (props.status.toLowerCase()) {
    case 'draft':
      return 'Draft'
    case 'scheduled':
      return 'Scheduled'
    case 'sending':
      return 'Sending'
    case 'sent':
      return 'Sent'
    case 'paused':
      return 'Paused'
    case 'cancelled':
      return 'Cancelled'
    case 'failed':
      return 'Failed'
    case 'queued':
      return 'Queued'
    case 'delivered':
      return 'Delivered'
    case 'opened':
      return 'Opened'
    case 'clicked':
      return 'Clicked'
    case 'bounced':
      return 'Bounced'
    case 'complained':
      return 'Complained'
    case 'unsubscribed':
      return 'Unsubscribed'
    default:
      return props.status
  }
}
</script>