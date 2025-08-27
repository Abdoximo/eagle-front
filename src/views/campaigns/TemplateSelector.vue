<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3">
              <button @click="$router.back()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ArrowLeft class="w-5 h-5" />
              </button>
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Template</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Select and customize a template for your campaign</p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="text-right text-sm">
              <div class="text-gray-900 dark:text-white font-medium">{{ userCredits }} Credits</div>
              <div class="text-gray-500 dark:text-gray-400">Available</div>
            </div>
            <button @click="skipTemplate" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Skip & Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Quick Start Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div @click="createBlankTemplate" class="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 p-8 text-center transition-all duration-200">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
            <PlusCircle class="w-8 h-8 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start from Scratch</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Build your email with our drag-and-drop editor</p>
        </div>
        
        <div @click="importFromUrl" class="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 p-8 text-center transition-all duration-200">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
            <Globe class="w-8 h-8 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Import from URL</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Import an existing webpage as a template</p>
        </div>
        
        <div @click="uploadHtml" class="cursor-pointer group bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 p-8 text-center transition-all duration-200">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 group-hover:bg-purple-100 dark:group-hover:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
            <Upload class="w-8 h-8 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload HTML</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Upload your own HTML email template</p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search templates..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-3">
            <select v-model="selectedCategory" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>

            <select v-model="selectedType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">All Types</option>
              <option value="free">Free Templates</option>
              <option value="premium">Premium Templates</option>
              <option value="owned">My Templates</option>
            </select>

            <select v-model="sortBy" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
            </select>
          </div>
        </div>

        <!-- Quick Filter Tags -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button
            v-for="tag in quickFilters"
            :key="tag"
            @click="toggleQuickFilter(tag)"
            :class="[
              'px-3 py-1 text-sm rounded-full transition-colors',
              selectedTags.includes(tag)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Featured Templates Section -->
      <div v-if="featuredTemplates.length > 0 && !searchQuery" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Star class="w-6 h-6 text-yellow-500 mr-2" />
            Featured Templates
          </h2>
          <button class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
            View All Featured
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard
            v-for="template in featuredTemplates.slice(0, 6)"
            :key="template.id"
            :template="template"
            :show-actions="true"
            @preview="previewTemplate"
            @select="selectTemplate"
            @purchase="purchaseTemplate"
            class="ring-2 ring-yellow-400 ring-opacity-30"
          />
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ filteredTemplates.length }} Templates Available
          </h2>
          <div class="flex items-center space-x-2">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              ]"
            >
              <Grid3X3 class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              ]"
            >
              <List class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemplateCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- Templates Display -->
      <div v-else-if="filteredTemplates.length > 0">
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard
            v-for="template in paginatedTemplates"
            :key="template.id"
            :template="template"
            :show-actions="true"
            @preview="previewTemplate"
            @select="selectTemplate"
            @purchase="purchaseTemplate"
          />
        </div>
        
        <div v-else class="space-y-4">
          <TemplateListCard
            v-for="template in paginatedTemplates"
            :key="template.id"
            :template="template"
            @preview="previewTemplate"
            @select="selectTemplate"
            @purchase="purchaseTemplate"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <FileImage class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="clearFilters" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Clear Filters
          </button>
          <button @click="createBlankTemplate" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Start from Scratch
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TemplatePreviewModal
      v-if="previewingTemplate"
      :template="previewingTemplate"
      @close="previewingTemplate = null"
      @select="selectTemplate"
      @purchase="purchaseTemplate"
    />

    <TemplateCustomizationModal
      v-if="customizingTemplate"
      :template="customizingTemplate"
      @close="customizingTemplate = null"
      @save="saveCustomizedTemplate"
    />

    <PurchaseConfirmModal
      v-if="purchasingTemplate"
      :template="purchasingTemplate"
      :userCredits="userCredits"
      @close="purchasingTemplate = null"
      @purchase="confirmPurchase"
    />

    <ImportUrlModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @import="handleUrlImport"
    />

    <UploadHtmlModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleHtmlUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, Search, Star, Grid3X3, List, FileImage, 
  PlusCircle, Globe, Upload
} from 'lucide-vue-next'
import TemplateCard from '@/components/templates/TemplateCard.vue'
import TemplateListCard from '@/components/templates/TemplateListCard.vue'
import TemplateCardSkeleton from '@/components/templates/TemplateCardSkeleton.vue'
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal.vue'
import TemplateCustomizationModal from '@/components/templates/TemplateCustomizationModal.vue'
import PurchaseConfirmModal from '@/components/templates/PurchaseConfirmModal.vue'
import ImportUrlModal from '@/components/templates/ImportUrlModal.vue'
import UploadHtmlModal from '@/components/templates/UploadHtmlModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import { showSuccess, showError } from '@/services/toast'
import { useAuthStore } from '@/stores/auth'
import { billingAPI } from '@/services/billing.api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedType = ref('')
const selectedTags = ref([])
const sortBy = ref('popular')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 12

const previewingTemplate = ref(null)
const customizingTemplate = ref(null)
const purchasingTemplate = ref(null)
const showImportModal = ref(false)
const showUploadModal = ref(false)

// User data from auth store
const userCredits = computed(() => authStore.userCredits || 0)

// Process templates with can_afford property
const processedTemplates = computed(() => {
  return templates.value.map(template => ({
    ...template,
    can_afford: !template.is_premium || userCredits.value >= template.credit_cost
  }))
})

// Mock data
const categories = ref(['Newsletter', 'Promotional', 'Corporate', 'Creative', 'Healthcare'])
const quickFilters = ref(['responsive', 'modern', 'minimal', 'professional', 'colorful', 'clean'])

const templates = ref([
  {
    id: 1,
    name: 'Modern Newsletter Pro',
    description: 'A sleek, modern newsletter template perfect for technology companies',
    category: 'Newsletter',
    is_premium: true,
    credit_cost: 50,
    is_featured: true,
    rating: 4.8,
    downloads: 1250,
    preview_image: 'https://via.placeholder.com/400x300/3B82F6/white?text=Modern+Newsletter',
    tags: ['modern', 'responsive', 'professional'],
    is_purchased: false
  },
  // Add more mock templates...
])

// Computed
const featuredTemplates = computed(() => 
  processedTemplates.value.filter(t => t.is_featured)
)

const filteredTemplates = computed(() => {
  let filtered = processedTemplates.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  // Type filter
  if (selectedType.value) {
    if (selectedType.value === 'premium') {
      filtered = filtered.filter(t => t.is_premium)
    } else if (selectedType.value === 'free') {
      filtered = filtered.filter(t => !t.is_premium)
    } else if (selectedType.value === 'owned') {
      filtered = filtered.filter(t => t.is_purchased)
    }
  }

  // Tags filter
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(t => 
      selectedTags.value.some(tag => t.tags.includes(tag))
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'popular':
      filtered.sort((a, b) => b.downloads - a.downloads)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'price_low':
      filtered.sort((a, b) => (a.credit_cost || 0) - (b.credit_cost || 0))
      break
  }

  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredTemplates.value.length / itemsPerPage)
)

const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTemplates.value.slice(start, end)
})

// Methods
const loadTemplates = async () => {
  loading.value = true
  try {
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    showError('Failed to load templates')
  } finally {
    loading.value = false
  }
}

const toggleQuickFilter = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedType.value = ''
  selectedTags.value = []
  sortBy.value = 'popular'
  currentPage.value = 1
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
}

const selectTemplate = (template) => {
  if (template.is_premium && !template.is_purchased && !template.can_afford) {
    showError(`You need ${template.credit_cost} credits to use this template`)
    return
  }

  if (template.is_premium && !template.is_purchased) {
    purchasingTemplate.value = template
    return
  }

  // If template allows customization, show customization modal
  if (template.allow_modification) {
    customizingTemplate.value = template
  } else {
    // Use template as-is
    useTemplate(template)
  }
}

const purchaseTemplate = (template) => {
  purchasingTemplate.value = template
}

const confirmPurchase = async (template) => {
  try {
    // Purchase template via API
    await billingAPI.purchaseTemplate(template.id)
    
    // Refresh user data to get updated credits
    await authStore.refreshUser()
    
    // Mark template as purchased locally
    template.is_purchased = true
    purchasingTemplate.value = null
    
    showSuccess(`Successfully purchased ${template.name}!`)
    
    // Now allow customization or use
    selectTemplate(template)
  } catch (error) {
    console.error('Purchase failed:', error)
    showError(error.response?.data?.message || 'Failed to purchase template')
  }
}

const saveCustomizedTemplate = (customizedTemplate) => {
  customizingTemplate.value = null
  useTemplate(customizedTemplate)
}

const useTemplate = (template) => {
  // Navigate to campaign creation with template
  router.push({
    name: 'CampaignCreate',
    query: { 
      template: template.id,
      step: 'content'
    }
  })
}

const createBlankTemplate = () => {
  router.push({
    name: 'CampaignCreate',
    query: { step: 'content' }
  })
}

const importFromUrl = () => {
  showImportModal.value = true
}

const uploadHtml = () => {
  showUploadModal.value = true
}

const handleUrlImport = async (url) => {
  try {
    // TODO: Implement URL import
    showSuccess('Template imported successfully!')
    showImportModal.value = false
    // Navigate to editor with imported content
  } catch (error) {
    showError('Failed to import template')
  }
}

const handleHtmlUpload = async (htmlContent) => {
  try {
    // TODO: Implement HTML upload
    showSuccess('Template uploaded successfully!')
    showUploadModal.value = false
    // Navigate to editor with uploaded content
  } catch (error) {
    showError('Failed to upload template')
  }
}

const skipTemplate = () => {
  router.push({
    name: 'CampaignCreate',
    query: { step: 'content' }
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadTemplates()
  
  // If coming from campaign creation, pre-select filters
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.type) {
    selectedType.value = route.query.type
  }
})
</script>

<style scoped>
/* Add any specific styles for template selection */
.template-card-hover {
  transition: all 0.2s ease-in-out;
}

.template-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
