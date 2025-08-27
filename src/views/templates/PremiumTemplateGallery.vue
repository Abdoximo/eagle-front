<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">Premium Email Templates</h1>
          <p class="text-xl opacity-90 mb-8">Professional, responsive templates designed to increase engagement</p>
          <div class="flex justify-center space-x-4">
            <div class="bg-white/20 rounded-lg px-4 py-2">
              <span class="text-2xl font-bold">{{ templates.length }}</span>
              <span class="text-sm block">Templates</span>
            </div>
            <div class="bg-white/20 rounded-lg px-4 py-2">
              <span class="text-2xl font-bold">4.8★</span>
              <span class="text-sm block">Avg Rating</span>
            </div>
            <div class="bg-white/20 rounded-lg px-4 py-2">
              <span class="text-2xl font-bold">10K+</span>
              <span class="text-sm block">Downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters & Search -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
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
          <div class="flex flex-wrap gap-4">
            <!-- Category Filter -->
            <select v-model="selectedCategory" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>

            <!-- Industry Filter -->
            <select v-model="selectedIndustry" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">All Industries</option>
              <option v-for="industry in industries" :key="industry" :value="industry">
                {{ industry }}
              </option>
            </select>

            <!-- Type Filter -->
            <select v-model="selectedType" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="">All Types</option>
              <option value="free">Free Templates</option>
              <option value="premium">Premium Templates</option>
            </select>

            <!-- Sort -->
            <select v-model="sortBy" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="toggleTag(tag)"
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

      <!-- Featured Templates -->
      <div v-if="featuredTemplates.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Star class="w-6 h-6 text-yellow-500 mr-2" />
          Featured Templates
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard
            v-for="template in featuredTemplates"
            :key="template.id"
            :template="template"
            @preview="showPreview"
            @purchase="purchaseTemplate"
            @use="useTemplate"
            class="ring-2 ring-yellow-400 ring-opacity-50"
          />
        </div>
      </div>

      <!-- Template Grid -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ filteredTemplates.length }} Templates Found
          </h2>
          <div class="flex items-center space-x-2">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
            >
              <Grid3X3 class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg',
                viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
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

      <!-- Templates Grid/List -->
      <div v-else-if="filteredTemplates.length > 0">
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemplateCard
            v-for="template in paginatedTemplates"
            :key="template.id"
            :template="template"
            @preview="showPreview"
            @purchase="purchaseTemplate"
            @use="useTemplate"
          />
        </div>
        
        <div v-else class="space-y-4">
          <TemplateListItem
            v-for="template in paginatedTemplates"
            :key="template.id"
            :template="template"
            @preview="showPreview"
            @purchase="purchaseTemplate"
            @use="useTemplate"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex justify-center">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <FileImage class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
        <button @click="clearFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <TemplatePreviewModal
      v-if="previewTemplate"
      :template="previewTemplate"
      @close="previewTemplate = null"
      @purchase="purchaseTemplate"
      @use="useTemplate"
    />

    <!-- Purchase Success Modal -->
    <PurchaseSuccessModal
      v-if="showPurchaseSuccess"
      :template="purchasedTemplate"
      @close="showPurchaseSuccess = false"
      @use="useTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Star, Grid3X3, List, FileImage 
} from 'lucide-vue-next'
import TemplateCard from '@/components/templates/TemplateCard.vue'
import TemplateListItem from '@/components/templates/TemplateListItem.vue'
import TemplateCardSkeleton from '@/components/templates/TemplateCardSkeleton.vue'
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal.vue'
import PurchaseSuccessModal from '@/components/templates/PurchaseSuccessModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import { showSuccess, showError } from '@/services/toast'

const router = useRouter()

// State
const loading = ref(true)
const templates = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedIndustry = ref('')
const selectedType = ref('')
const selectedTags = ref([])
const sortBy = ref('popular')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 12
const previewTemplate = ref(null)
const showPurchaseSuccess = ref(false)
const purchasedTemplate = ref(null)

// Mock data - replace with real API calls
const categories = ref(['Newsletter', 'Promotional', 'Corporate', 'Creative', 'Healthcare'])
const industries = ref(['Technology', 'E-commerce', 'Finance', 'Design', 'Healthcare'])
const popularTags = ref(['modern', 'responsive', 'clean', 'professional', 'creative', 'minimal'])

const mockTemplates = [
  {
    id: 1,
    name: 'Modern Newsletter Pro',
    description: 'A sleek, modern newsletter template perfect for technology companies',
    category: 'Newsletter',
    industry: 'Technology',
    credit_cost: 50,
    is_premium: true,
    is_featured: true,
    rating: 4.8,
    downloads: 1250,
    preview_image: 'https://via.placeholder.com/400x300/3B82F6/white?text=Modern+Newsletter',
    tags: ['modern', 'tech', 'responsive', 'clean'],
    is_purchased: false,
    can_afford: true
  },
  {
    id: 2,
    name: 'E-commerce Promo Elite',
    description: 'High-converting promotional template for e-commerce businesses',
    category: 'Promotional',
    industry: 'E-commerce',
    credit_cost: 75,
    is_premium: true,
    is_featured: true,
    rating: 4.9,
    downloads: 980,
    preview_image: 'https://via.placeholder.com/400x300/EF4444/white?text=E-commerce+Promo',
    tags: ['ecommerce', 'sales', 'conversion'],
    is_purchased: false,
    can_afford: true
  },
  // Add more mock templates...
]

// Computed
const featuredTemplates = computed(() => 
  templates.value.filter(t => t.is_featured).slice(0, 6)
)

const filteredTemplates = computed(() => {
  let filtered = templates.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.industry.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  // Industry filter
  if (selectedIndustry.value) {
    filtered = filtered.filter(t => t.industry === selectedIndustry.value)
  }

  // Type filter
  if (selectedType.value) {
    if (selectedType.value === 'premium') {
      filtered = filtered.filter(t => t.is_premium)
    } else if (selectedType.value === 'free') {
      filtered = filtered.filter(t => !t.is_premium)
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
      filtered.sort((a, b) => a.credit_cost - b.credit_cost)
      break
    case 'price_high':
      filtered.sort((a, b) => b.credit_cost - a.credit_cost)
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
    // const response = await api.get('/api/templates')
    // templates.value = response.data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    templates.value = mockTemplates
  } catch (error) {
    showError('Failed to load templates')
  } finally {
    loading.value = false
  }
}

const toggleTag = (tag) => {
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
  selectedIndustry.value = ''
  selectedType.value = ''
  selectedTags.value = []
  sortBy.value = 'popular'
  currentPage.value = 1
}

const showPreview = (template) => {
  previewTemplate.value = template
}

const purchaseTemplate = async (template) => {
  try {
    // TODO: Replace with real API call
    // const response = await api.post(`/api/templates/${template.id}/purchase`)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update template status
    template.is_purchased = true
    purchasedTemplate.value = template
    showPurchaseSuccess.value = true
    
    showSuccess(`Successfully purchased ${template.name}!`)
  } catch (error) {
    showError('Failed to purchase template')
  }
}

const useTemplate = (template) => {
  if (template.is_premium && !template.is_purchased) {
    showError('Please purchase this template first')
    return
  }
  
  router.push({
    name: 'CampaignCreate',
    query: { template: template.id }
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCategory, selectedIndustry, selectedType, selectedTags, sortBy], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadTemplates()
})
</script>
