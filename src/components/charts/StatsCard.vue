<template>
  <div class="rounded-lg border bg-card p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <h3 class="mt-2 text-3xl font-bold">{{ value }}</h3>
      </div>
      <div
        class="rounded-full p-3"
        :class="{
          'bg-green-100 text-green-600': trend > 0,
          'bg-red-100 text-red-600': trend < 0,
          'bg-gray-100 text-gray-600': trend === 0
        }"
      >
        <component :is="trendIcon" class="h-6 w-6" />
      </div>
    </div>
    <div class="mt-4 flex items-center text-sm">
      <span
        :class="{
          'text-green-600': trend > 0,
          'text-red-600': trend < 0,
          'text-gray-600': trend === 0
        }"
      >
        {{ Math.abs(trend) }}%
      </span>
      <span class="ml-2 text-muted-foreground">vs last period</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/solid'

const props = defineProps<{
  title: string
  value: string | number
  trend: number
}>()

const trendIcon = computed(() => {
  if (props.trend > 0) return ArrowUpIcon
  if (props.trend < 0) return ArrowDownIcon
  return MinusIcon
})
</script> 