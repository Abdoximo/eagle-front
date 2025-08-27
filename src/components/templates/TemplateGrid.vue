<template>
  <div v-if="templates.length === 0" class="text-center py-12">
    <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No Templates Found
    </h3>
    <p class="text-gray-600 dark:text-gray-400">
      No templates match your current filter selection
    </p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="template in templates"
      :key="template.id"
      @click="selectTemplate(template)"
      :class="[
        'relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105',
        selectedTemplate?.id === template.id
          ? 'ring-4 ring-blue-500 shadow-2xl'
          : 'hover:shadow-xl'
      ]"
    >
      <!-- Template Preview -->
      <div class="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
        <img
          v-if="template.thumbnail"
          :src="template.thumbnail"
          :alt="template.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <FileText class="w-16 h-16 text-gray-400" />
        </div>
        
        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="text-center">
            <Eye class="w-6 h-6 text-white mx-auto mb-2" />
            <span class="text-white text-sm font-medium">Preview</span>
          </div>
        </div>
        
        <!-- Selected Indicator -->
        <div
          v-if="selectedTemplate?.id === template.id"
          class="absolute top-4 right-4 p-2 bg-blue-500 rounded-full shadow-lg"
        >
          <Check class="w-4 h-4 text-white" />
        </div>

        <!-- Premium Badge -->
        <div
          v-if="template.type === 'premium'"
          class="absolute top-4 left-4 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full flex items-center"
        >
          <Crown class="w-3 h-3 mr-1" />
          Pro
        </div>
      </div>
      
      <!-- Template Info -->
      <div class="p-4 bg-white dark:bg-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
              {{ template.name }}
            </h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {{ template.description || 'No description available' }}
            </p>
          </div>
        </div>
        
        <!-- Template Stats -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center text-xs text-gray-500">
            <Users class="w-3 h-3 mr-1" />
            {{ template.usage_count || 0 }} uses
          </div>
          <div class="flex items-center text-xs text-gray-500">
            <Star class="w-3 h-3 mr-1" />
            {{ template.rating || '4.5' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Eye, Check, Crown, Users, Star } from 'lucide-vue-next'

interface Template {
  id: number
  name: string
  description?: string
  thumbnail?: string
  type: 'free' | 'premium'
  usage_count?: number
  rating?: string
}

interface Props {
  templates: Template[]
  selectedTemplate?: Template | null
}

interface Emits {
  (e: 'select', template: Template): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Methods
const selectTemplate = (template: Template) => {
  emit('select', template)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover scale effect */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Ring effect for selected template */
.ring-4 {
  box-shadow: 0 0 0 4px currentColor;
}

/* Gradient animation for premium badge */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>