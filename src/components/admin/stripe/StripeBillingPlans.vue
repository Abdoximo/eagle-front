<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Billing Plans</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage subscription plans and pricing
        </p>
      </div>
      
      <button
        @click="$emit('create', { name: 'New Plan', price: 29.99, interval: 'month' })"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add Plan
      </button>
    </div>

    <div v-if="plans.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <CreditCard class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Billing Plans</h3>
      <p class="text-gray-600 dark:text-gray-400">Create your first billing plan to get started</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ plan.name }}</h3>
        <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ plan.price }}/{{ plan.interval }}</p>
        
        <div class="mt-4 flex space-x-2">
          <button
            @click="$emit('update', plan.id, plan)"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            Edit
          </button>
          <button
            @click="$emit('delete', plan.id)"
            class="text-sm text-red-600 dark:text-red-400 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, CreditCard } from 'lucide-vue-next'

interface Props {
  plans: any[]
  loading?: boolean
}

interface Emits {
  (e: 'create', data: any): void
  (e: 'update', id: string, data: any): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script> 