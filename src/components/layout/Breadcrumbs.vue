<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-4">
      <li>
        <div>
          <router-link to="/dashboard" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="flex-shrink-0 h-5 w-5" />
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      
      <li v-for="(item, index) in items" :key="index">
        <div class="flex items-center">
          <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-300" />
          <router-link
            v-if="item.to && index < items.length - 1"
            :to="item.to"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {{ item.label }}
          </router-link>
          <span
            v-else
            class="ml-4 text-sm font-medium text-gray-900 dark:text-white"
            aria-current="page"
          >
            {{ item.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { BreadcrumbItem } from '@/types/common'

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>