<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <!-- Preview Image -->
    <div class="relative group">
      <div class="aspect-w-4 aspect-h-3 bg-gray-200 dark:bg-gray-700">
        <img
          :src="template.preview_image || defaultPreview"
          :alt="template.name"
          class="w-full h-48 object-cover"
        />
        
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="space-x-3">
            <button
              @click="$emit('preview', template)"
              class="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye class="w-4 h-4 inline mr-2" />
              Preview
            </button>
            <button
              v-if="template.is_premium && !template.is_purchased"
              @click="$emit('purchase', template)"
              :disabled="!template.can_afford"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart class="w-4 h-4 inline mr-2" />
              Buy
            </button>
            <button
              v-else
              @click="$emit('use', template)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play class="w-4 h-4 inline mr-2" />
              Use
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Badge -->
      <div v-if="template.is_premium" class="absolute top-3 left-3">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
          <Crown class="w-3 h-3 mr-1" />
          Premium
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="template.is_featured" class="absolute top-3 right-3">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Star class="w-3 h-3 mr-1" />
          Featured
        </span>
      </div>

      <!-- Purchased Badge -->
      <div v-if="template.is_purchased" class="absolute bottom-3 right-3">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Check class="w-3 h-3 mr-1" />
          Owned
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
            {{ template.name }}
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Badge variant="secondary" size="sm">{{ template.category }}</Badge>
            <span>•</span>
            <span>{{ template.industry }}</span>
          </div>
        </div>
        
        <!-- Price -->
        <div v-if="template.is_premium" class="text-right">
          <div class="text-lg font-bold text-gray-900 dark:text-white">
            {{ template.credit_cost }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">credits</div>
        </div>
        <div v-else class="text-right">
          <div class="text-lg font-bold text-green-600 dark:text-green-400">Free</div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
        {{ template.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-4">
        <span
          v-for="tag in template.tags?.slice(0, 3)"
          :key="tag"
          class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
        >
          {{ tag }}
        </span>
        <span
          v-if="template.tags?.length > 3"
          class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
        >
          +{{ template.tags.length - 3 }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <Star class="w-4 h-4 text-yellow-400 mr-1" />
            <span>{{ template.rating }}</span>
          </div>
          <div class="flex items-center">
            <Download class="w-4 h-4 mr-1" />
            <span>{{ formatNumber(template.downloads) }}</span>
          </div>
        </div>
        
        <!-- Responsive indicator -->
        <div v-if="template.is_responsive" class="flex items-center text-green-600 dark:text-green-400">
          <Smartphone class="w-4 h-4 mr-1" />
          <span class="text-xs">Responsive</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-2">
        <button
          @click="$emit('preview', template)"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <Eye class="w-4 h-4 inline mr-2" />
          Preview
        </button>
        
        <button
          v-if="template.is_premium && !template.is_purchased"
          @click="$emit('purchase', template)"
          :disabled="!template.can_afford"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <ShoppingCart class="w-4 h-4 inline mr-2" />
          Purchase
        </button>
        
        <button
          v-else
          @click="$emit('use', template)"
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Play class="w-4 h-4 inline mr-2" />
          Use Template
        </button>
      </div>

      <!-- Insufficient credits warning -->
      <div v-if="template.is_premium && !template.is_purchased && !template.can_afford" class="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center text-red-700 dark:text-red-400 text-xs">
          <AlertCircle class="w-4 h-4 mr-1" />
          <span>Insufficient credits. You need {{ template.credit_cost }} credits.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Eye, ShoppingCart, Play, Crown, Star, Check, Download, 
  Smartphone, AlertCircle 
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['preview', 'purchase', 'use'])

const defaultPreview = computed(() => 
  `https://via.placeholder.com/400x300/6B7280/white?text=${encodeURIComponent(props.template.name)}`
)

const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.aspect-w-4 {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio */
}

.aspect-w-4 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
