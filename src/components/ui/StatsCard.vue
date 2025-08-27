
<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- Icon -->
        <div
          :class="[
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            iconBackground
          ]"
        >
          <component
            :is="iconComponent"
            :class="[
              'w-5 h-5',
              iconColor
            ]"
          />
        </div>
        
        <!-- Title -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {{ subtitle }}
          </p>
        </div>
      </div>
      
      <!-- Menu/Actions -->
      <div v-if="$slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
    
    <!-- Value -->
    <div class="mb-4">
      <div class="flex items-baseline space-x-2">
        <span class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ formattedValue }}
        </span>
        <span v-if="unit" class="text-sm text-gray-500 dark:text-gray-400">
          {{ unit }}
        </span>
      </div>
      
      <!-- Trend -->
      <div v-if="trend !== undefined" class="flex items-center mt-2">
        <component
          :is="trendIcon"
          :class="[
            'w-4 h-4 mr-1',
            trendColor
          ]"
        />
        <span
          :class="[
            'text-sm font-medium',
            trendColor
          ]"
        >
          {{ Math.abs(trend) }}%
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {{ trendPeriod || 'vs last period' }}
        </span>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div v-if="progress !== undefined" class="mb-4">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          :class="[
            'h-2 rounded-full transition-all duration-300',
            progressColor
          ]"
          :style="{ width: `${Math.min(progress, 100)}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Footer/Additional Info -->
    <div v-if="$slots.footer || description" class="text-xs text-gray-500 dark:text-gray-400">
      <slot name="footer">
        {{ description }}
      </slot>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 rounded-xl flex items-center justify-center">
      <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Mail,
  Send,
  Eye,
  MousePointer,
  CreditCard,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-vue-next'

// Props
interface Props {
  title: string
  value: number | string
  subtitle?: string
  unit?: string
  icon?: string
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'yellow' | 'indigo'
  trend?: number
  trendPeriod?: string
  progress?: number
  loading?: boolean
  description?: string
  formatValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'activity',
  variant: 'blue',
  formatValue: true
})

// Icon mapping
const iconMap = {
  'users': Users,
  'mail': Mail,
  'send': Send,
  'eye': Eye,
  'click': MousePointer,
  'credit': CreditCard,
  'target': Target,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'activity': Activity,
  'calendar': Calendar,
  'clock': Clock,
  'check': CheckCircle,
  'x': XCircle,
  'alert': AlertCircle
}

// Computed properties
const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || Activity
})

const iconBackground = computed(() => {
  const variants = {
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20',
    gray: 'bg-gray-100 dark:bg-gray-700',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20'
  }
  return variants[props.variant]
})

const iconColor = computed(() => {
  const variants = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-600 dark:text-gray-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    indigo: 'text-indigo-600 dark:text-indigo-400'
  }
  return variants[props.variant]
})

const progressColor = computed(() => {
  const variants = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500'
  }
  return variants[props.variant]
})

const trendIcon = computed(() => {
  if (props.trend === undefined) return null
  if (props.trend > 0) return TrendingUp
  if (props.trend < 0) return TrendingDown
  return Minus
})

const trendColor = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend > 0) return 'text-green-600 dark:text-green-400'
  if (props.trend < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-500 dark:text-gray-400'
})

const formattedValue = computed(() => {
  if (!props.formatValue) return props.value
  
  if (typeof props.value === 'number') {
    // Format numbers with commas
    if (props.value >= 1000000) {
      return (props.value / 1000000).toFixed(1) + 'M'
    } else if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + 'K'
    } else {
      return props.value.toLocaleString()
    }
  }
  
  return props.value
})
</script>