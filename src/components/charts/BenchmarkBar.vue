<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <div class="flex items-center space-x-2">
        <span :class="[
          'font-bold',
          getComparisonColor()
        ]">
          {{ value.toFixed(1) }}%
        </span>
        <div :class="[
          'flex items-center text-xs px-2 py-1 rounded-full',
          getComparisonBg()
        ]">
          <component :is="getComparisonIcon()" class="w-3 h-3 mr-1" />
          {{ getComparisonText() }}
        </div>
      </div>
    </div>
    
    <div class="relative">
      <!-- Background bar -->
      <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <!-- Value bar -->
        <div 
          :class="['h-full transition-all duration-500 ease-out', getValueBarColor()]"
          :style="{ width: `${Math.min(valuePercentage, 100)}%` }"
        ></div>
        
        <!-- Benchmark indicator -->
        <div 
          class="absolute top-0 w-0.5 h-full bg-gray-800 dark:bg-gray-200"
          :style="{ left: `${Math.min(benchmarkPercentage, 100)}%` }"
        >
          <div class="absolute -top-1 -left-2 w-4 h-4 bg-gray-800 dark:bg-gray-200 transform rotate-45"></div>
        </div>
      </div>
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>0%</span>
      <span class="flex items-center">
        <span class="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full mr-1"></span>
        Benchmark: {{ benchmark.toFixed(1) }}%
      </span>
      <span>{{ maxValue }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  benchmark: {
    type: Number,
    required: true
  },
  inverted: {
    type: Boolean,
    default: false
  },
  maxValue: {
    type: Number,
    default: 100
  }
})

const valuePercentage = computed(() => 
  (props.value / props.maxValue) * 100
)

const benchmarkPercentage = computed(() => 
  (props.benchmark / props.maxValue) * 100
)

const difference = computed(() => 
  props.value - props.benchmark
)

const isAboveBenchmark = computed(() => 
  props.inverted ? difference.value < 0 : difference.value > 0
)

const getComparisonIcon = () => {
  if (Math.abs(difference.value) < 0.1) return Minus
  return isAboveBenchmark.value ? TrendingUp : TrendingDown
}

const getComparisonColor = () => {
  if (Math.abs(difference.value) < 0.1) return 'text-gray-500 dark:text-gray-400'
  return isAboveBenchmark.value 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
}

const getComparisonBg = () => {
  if (Math.abs(difference.value) < 0.1) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  return isAboveBenchmark.value 
    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
}

const getValueBarColor = () => {
  if (Math.abs(difference.value) < 0.1) return 'bg-gray-400'
  return isAboveBenchmark.value ? 'bg-green-500' : 'bg-red-500'
}

const getComparisonText = () => {
  if (Math.abs(difference.value) < 0.1) return 'On target'
  const diff = Math.abs(difference.value).toFixed(1)
  return isAboveBenchmark.value ? `+${diff}%` : `-${diff}%`
}
</script>
