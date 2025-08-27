<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
        <p :class="['text-2xl font-bold mt-1', colorClasses]">{{ value }}</p>
      </div>
      <div :class="['p-3 rounded-full', backgroundColorClasses]">
        <component :is="iconComponent" :class="['w-6 h-6', colorClasses]" />
      </div>
    </div>
    
    <div v-if="trend" class="mt-4 flex items-center">
      <component :is="trendIcon" :class="['w-4 h-4 mr-1', trendColorClasses]" />
      <span :class="['text-sm font-medium', trendColorClasses]">
        {{ formatTrend(trend) }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Users, Eye, MousePointer, TrendingUp, TrendingDown, 
  Mail, Target, DollarSign, BarChart 
} from 'lucide-vue-next'

interface Props {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  trend?: number
}

const props = defineProps<Props>()

const iconMap = {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Mail,
  Target,
  DollarSign,
  BarChart
}

const colorConfig = {
  blue: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20'
  },
  green: {
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20'
  },
  purple: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/20'
  },
  orange: {
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/20'
  },
  red: {
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/20'
  },
  yellow: {
    text: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20'
  }
}

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || Users
})

const colorClasses = computed(() => {
  return colorConfig[props.color].text
})

const backgroundColorClasses = computed(() => {
  return colorConfig[props.color].bg
})

const trendIcon = computed(() => {
  if (!props.trend) return TrendingUp
  return props.trend >= 0 ? TrendingUp : TrendingDown
})

const trendColorClasses = computed(() => {
  if (!props.trend) return 'text-gray-500'
  return props.trend >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
})

const formatTrend = (trend: number): string => {
  const sign = trend >= 0 ? '+' : ''
  return `${sign}${trend.toFixed(1)}%`
}
</script> 