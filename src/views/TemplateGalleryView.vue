<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('templates.gallery.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('templates.gallery.description') }}
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg">
          <div class="flex items-center space-x-2">
            <Coins class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
              {{ $t('common.credits') }}: {{ userCredits }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <Card class="p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <SearchField
            v-model="searchQuery"
            :placeholder="$t('templates.gallery.searchPlaceholder')"
            @search="handleSearch"
          />
        </div>
        
        <div class="flex items-center space-x-3">
          <SelectField
            v-model="filters.type"
            :options="typeOptions"
            :placeholder="$t('templates.gallery.filterByType')"
            class="w-40"
          />
          
          <SelectField
            v-model="filters.category"
            :options="categoryOptions"
            :placeholder="$t('templates.gallery.filterByCategory')"
            class="w-40"
          />
          
          <Button
            variant="outline"
            @click="resetFilters"
            v-if="hasActiveFilters"
          >
            {{ $t('common.reset') }}
          </Button>
        </div>
      </div>
    </Card>

    <!-- Template Gallery -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg"></div>
      </div>
    </div>
    
    <div v-else-if="paginatedTemplates.length === 0" class="text-center py-12">
      <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('templates.gallery.noTemplates') }}
      </p>
    </div>
    
    <!-- Templates Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in paginatedTemplates"
        :key="template.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Template Preview -->
        <div class="relative h-48 bg-gray-100 dark:bg-gray-700">
          <img
            v-if="template.thumbnail"
            :src="template.thumbnail"
            :alt="template.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full">
            <FileText class="h-12 w-12 text-gray-400" />
          </div>
          
          <!-- Type Badge -->
          <div class="absolute top-2 left-2">
            <Badge :variant="template.type === 'premium' ? 'warning' : 'success'">
              {{ $t(`templates.gallery.types.${template.type}`) }}
            </Badge>
          </div>
          
          <!-- Price Badge -->
          <div v-if="template.type === 'premium'" class="absolute top-2 right-2">
            <Badge variant="info" class="bg-blue-600 text-white">
              <Coins class="h-3 w-3 mr-1" />
              {{ template.price || 5 }} {{ $t('common.credits') }}
            </Badge>
          </div>
          
          <!-- Purchased Badge -->
          <div v-if="isPurchased(template)" class="absolute bottom-2 left-2">
            <Badge variant="success">
              <CheckCircle class="h-3 w-3 mr-1" />
              {{ $t('templates.gallery.purchased') }}
            </Badge>
          </div>
          
          <!-- Preview Button -->
          <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              @click="previewTemplate(template)"
            >
              <Eye class="h-4 w-4 mr-2" />
              {{ $t('templates.gallery.preview') }}
            </Button>
          </div>
        </div>
        
        <!-- Template Info -->
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ template.name }}
          </h3>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ template.description || $t('templates.gallery.noDescription') }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span>{{ $t('templates.gallery.category') }}: {{ template.category }}</span>
            <span>{{ formatDate(template.updated_at) }}</span>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                @click="previewTemplate(template)"
              >
                <Eye class="h-4 w-4 mr-2" />
                {{ $t('templates.gallery.preview') }}
              </Button>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Free Template - Use Button -->
              <Button
                v-if="template.type === 'free'"
                size="sm"
                @click="useTemplate(template)"
                class="bg-green-600 hover:bg-green-700"
              >
                <Download class="h-4 w-4 mr-2" />
                {{ $t('templates.gallery.use') }}
              </Button>
              
              <!-- Premium Template - Purchase/Use Button -->
              <template v-else-if="template.type === 'premium'">
                <!-- Already Purchased -->
                <Button
                  v-if="isPurchased(template)"
                  size="sm"
                  @click="useTemplate(template)"
                  class="bg-green-600 hover:bg-green-700"
                >
                  <Download class="h-4 w-4 mr-2" />
                  {{ $t('templates.gallery.use') }}
                </Button>
                
                <!-- Not Purchased -->
                <Button
                  v-else
                  size="sm"
                  @click="purchaseTemplate(template)"
                  :disabled="userCredits < (template.price || 5)"
                  class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <ShoppingCart class="h-4 w-4 mr-2" />
                  {{ $t('templates.gallery.purchase') }}
                </Button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center">
      <Pagination
        v-model:page="currentPage"
        :total="filteredTemplates.length"
        :per-page="perPage"
      />
    </div>

    <!-- Template Preview Dialog -->
    <TemplatePreviewDialog
      v-model="showPreviewDialog"
      :template="selectedTemplate"
    />

    <!-- Purchase Confirmation Dialog -->
    <PurchaseConfirmDialog
      v-model="showPurchaseDialog"
      :template="selectedTemplate"
      :user-credits="userCredits"
      @confirmed="handlePurchaseConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  FileText,
  Eye,
  Download,
  ShoppingCart,
  CheckCircle,
  Coins
} from 'lucide-vue-next'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SearchField from '@/components/ui/SearchField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Badge from '@/components/ui/Badge.vue'
import Pagination from '@/components/ui/Pagination.vue'
import TemplatePreviewDialog from '@/components/templates/TemplatePreviewDialog.vue'
import PurchaseConfirmDialog from '@/components/templates/PurchaseConfirmDialog.vue'

// Stores
import { useTemplateGalleryStore } from '@/stores/templateGallery'
import { useNotificationStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/user'

// Types
import type { Template } from '@/types/templates'

const { t } = useI18n()
const router = useRouter()
const galleryStore = useTemplateGalleryStore()
const notificationStore = useNotificationStore()
const userStore = useUserStore()

// Reactive data
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(12)
const showPreviewDialog = ref(false)
const showPurchaseDialog = ref(false)
const selectedTemplate = ref<Template | null>(null)

const filters = ref({
  type: '',
  category: ''
})

// Computed
const loading = computed(() => galleryStore.loading)
const templates = computed(() => galleryStore.templates || [])
const userCredits = computed(() => userStore.user?.credits || 0)
const purchasedTemplates = computed(() => galleryStore.purchasedTemplates || [])

const typeOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'free', label: t('templates.gallery.types.free') },
  { value: 'premium', label: t('templates.gallery.types.premium') }
])

const categoryOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'newsletter', label: t('templates.gallery.categories.newsletter') },
  { value: 'promotional', label: t('templates.gallery.categories.promotional') },
  { value: 'transactional', label: t('templates.gallery.categories.transactional') },
  { value: 'welcome', label: t('templates.gallery.categories.welcome') }
])

const hasActiveFilters = computed(() => {
  return filters.value.type || filters.value.category || searchQuery.value
})

const filteredTemplates = computed(() => {
  let result = templates.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query)
    )
  }

  if (filters.value.type) {
    result = result.filter(template => template.type === filters.value.type)
  }

  if (filters.value.category) {
    result = result.filter(template => template.category === filters.value.category)
  }

  return result
})

const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredTemplates.value.slice(start, end)
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = { type: '', category: '' }
  currentPage.value = 1
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const isPurchased = (template: Template): boolean => {
  return template.type === 'free' || purchasedTemplates.value.includes(template.id)
}

const previewTemplate = (template: Template) => {
  selectedTemplate.value = template
  showPreviewDialog.value = true
}

const purchaseTemplate = (template: Template) => {
  selectedTemplate.value = template
  showPurchaseDialog.value = true
}

const handlePurchaseConfirmed = async (template: Template) => {
  try {
    await galleryStore.purchaseTemplate(template.id)
    await userStore.fetchUser() // Update user credits
    notificationStore.success(t('templates.gallery.purchaseSuccess', { name: template.name }))
  } catch (error) {
    notificationStore.error(t('templates.gallery.purchaseError'))
  }
}

const useTemplate = (template: Template) => {
  // Navigate to campaign creation with selected template
  router.push({
    name: 'CreateCampaign',
    query: { templateId: template.id }
  })
}

// Lifecycle
onMounted(() => {
  galleryStore.fetchTemplates()
  galleryStore.fetchPurchasedTemplates()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 