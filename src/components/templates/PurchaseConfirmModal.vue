<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Purchase Premium Template</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Template Info -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {{ template.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ template.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Premium Template</p>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">{{ template.description }}</p>
          </div>

          <!-- Purchase Details -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">Template Cost:</span>
              <span class="font-bold text-lg text-gray-900 dark:text-white">{{ template.credit_cost }} Credits</span>
            </div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-gray-700 dark:text-gray-300">Your Credits:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatCredits(userCredits) }}</span>
            </div>
            <hr class="my-3 border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">After Purchase:</span>
              <span class="font-bold text-lg" :class="remainingCredits >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCredits(remainingCredits) }}
              </span>
            </div>
          </div>

          <!-- Warning for insufficient credits -->
          <div v-if="remainingCredits < 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
            <p class="text-red-700 dark:text-red-300 text-sm">
              <AlertCircle class="w-4 h-4 inline mr-1" />
              Insufficient credits. You need {{ Math.abs(remainingCredits) }} more credits to purchase this template.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handlePurchase"
              :disabled="remainingCredits < 0 || loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Purchasing...</span>
              <span v-else>Purchase Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, AlertCircle } from 'lucide-vue-next'

interface Template {
  id: number
  name: string
  description: string
  credit_cost: number
}

interface Props {
  template: Template
  userCredits?: number
}

const props = withDefaults(defineProps<Props>(), {
  userCredits: 0
})

const emit = defineEmits<{
  close: []
  purchase: [template: Template]
}>()

const loading = ref(false)

const remainingCredits = computed(() => {
  return (props.userCredits || 0) - props.template.credit_cost
})

const formatCredits = (credits: number): string => {
  if (isNaN(credits) || credits === null || credits === undefined) {
    return '0 Credits'
  }
  return `${credits} Credits`
}

const handlePurchase = async () => {
  if (remainingCredits.value < 0) return
  
  loading.value = true
  try {
    emit('purchase', props.template)
  } finally {
    loading.value = false
  }
}
</script>
