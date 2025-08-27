<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <!-- Preview Image Skeleton -->
    <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
    
    <!-- Content -->
    <div class="p-6">
      <!-- Title Skeleton -->
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
      
      <!-- Description Skeleton -->
      <div class="space-y-2 mb-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      
      <!-- Stats Row Skeleton -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      
      <!-- Tags Skeleton -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
      </div>
      
      <!-- Actions Skeleton -->
      <div class="flex items-center justify-between">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script>
