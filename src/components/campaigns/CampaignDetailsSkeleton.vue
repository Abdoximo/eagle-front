<template>
  <div class="space-y-8 animate-pulse">
    <!-- Stats Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Main Content Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Campaign Overview Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="i in 6" :key="i" class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>

        <!-- Analytics Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="h-8 bg-gray-200 dark:bg-gray-600 rounded w-8 mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Email Preview Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <div class="bg-gray-50 dark:bg-gray-700 p-4">
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="i in 6" :key="i" class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Skeleton -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-6"></div>
          <div class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script> 