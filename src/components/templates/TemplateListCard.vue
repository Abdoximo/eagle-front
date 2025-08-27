<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
    <div class="flex">
      <!-- Preview Image -->
      <div class="w-48 h-32 flex-shrink-0">
        <img 
          v-if="template.preview_image" 
          :src="template.preview_image" 
          :alt="template.name"
          class="w-full h-full object-cover"
        />
        <div 
          v-else 
          class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
        >
          {{ template.name.charAt(0).toUpperCase() }}
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ template.name }}</h3>
              
              <!-- Premium Badge -->
              <Badge v-if="template.is_premium" variant="warning" size="sm">
                Premium - {{ template.credit_cost }} Credits
              </Badge>
              
              <!-- Featured Badge -->
              <Badge v-if="template.is_featured" variant="success" size="sm">
                Featured
              </Badge>
            </div>
            
            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {{ template.description }}
            </p>
            
            <!-- Stats Row -->
            <div class="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <Eye class="w-4 h-4" />
                <span>{{ formatNumber(template.views || 0) }} views</span>
              </div>
              <div class="flex items-center gap-1">
                <Download class="w-4 h-4" />
                <span>{{ formatNumber(template.downloads || 0) }} downloads</span>
              </div>
              <div class="flex items-center gap-1">
                <Star class="w-4 h-4" />
                <span>{{ template.rating || '0.0' }}</span>
              </div>
              <div v-if="template.category" class="flex items-center gap-1">
                <Tag class="w-4 h-4" />
                <span>{{ template.category }}</span>
              </div>
            </div>
            
            <!-- Tags -->
            <div v-if="template.tags && template.tags.length" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in template.tags.slice(0, 3)" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {{ tag }}
              </span>
              <span 
                v-if="template.tags.length > 3"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full"
              >
                +{{ template.tags.length - 3 }} more
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col gap-2 ml-4">
            <button
              @click="$emit('preview', template)"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Eye class="w-4 h-4 mr-2 inline" />
              Preview
            </button>
            
            <button
              @click="$emit('select', template)"
              :disabled="template.is_premium && !canAfford"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <template v-if="template.is_premium && !canAfford">
                Insufficient Credits
              </template>
              <template v-else-if="template.is_premium">
                Use ({{ template.credit_cost }} Credits)
              </template>
              <template v-else>
                Use Template
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Eye, Download, Star, Tag } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

interface Template {
  id: number
  name: string
  description: string
  preview_image?: string
  is_premium: boolean
  credit_cost: number
  is_featured: boolean
  views?: number
  downloads?: number
  rating?: string
  category?: string
  tags?: string[]
}

interface Props {
  template: Template
  userCredits?: number
}

const props = withDefaults(defineProps<Props>(), {
  userCredits: 0
})

defineEmits<{
  preview: [template: Template]
  select: [template: Template]
}>()

const canAfford = computed(() => {
  if (!props.template.is_premium) return true
  return props.userCredits >= props.template.credit_cost
})

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
