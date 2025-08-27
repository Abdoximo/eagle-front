<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div class="flex items-start justify-between">
      <!-- Campaign Info Skeleton -->
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-3">
          <!-- Icon Skeleton -->
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          
          <!-- Title and Subject Skeleton -->
          <div class="flex-1">
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          
          <!-- Status Badge Skeleton -->
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        </div>
        
        <!-- Stats Grid Skeleton -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div v-for="i in 4" :key="i" class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-2"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto mb-1"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto"></div>
          </div>
        </div>
        
        <!-- Contact List Skeleton -->
        <div class="flex items-center mb-4">
          <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    </div>
    
    <!-- Actions Skeleton -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
      
      <div class="flex items-center space-x-2">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script> 