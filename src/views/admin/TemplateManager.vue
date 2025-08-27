<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Template Manager</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Create and manage premium email templates</p>
          </div>
          <div class="flex items-center space-x-3">
            <button 
              @click="importTemplate"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload class="w-4 h-4 mr-2 inline" />
              Import
            </button>
            <button 
              @click="showCreateModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus class="w-4 h-4 mr-2 inline" />
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Analytics Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <FileText class="w-8 h-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Templates</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_templates }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Crown class="w-8 h-8 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Premium Templates</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.premium_templates }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Download class="w-8 h-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Downloads</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.total_downloads) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSign class="w-8 h-8 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Generated</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.total_revenue) }}</p>
            </div>
          </div>
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
            <select v-model="filterStatus" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>
            
            <select v-model="filterCategory" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option value="">All Categories</option>
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="corporate">Corporate</option>
              <option value="creative">Creative</option>
            </select>
            
            <select v-model="filterType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option value="">All Types</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Templates Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Templates</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Template</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="template in filteredTemplates" :key="template.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-12 h-12">
                      <img 
                        :src="template.preview_image || getDefaultPreview(template.name)" 
                        :alt="template.name"
                        class="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ template.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ template.description }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <Badge variant="secondary" size="sm">{{ template.category }}</Badge>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <Badge :variant="template.is_premium ? 'warning' : 'success'" size="sm">
                      {{ template.is_premium ? 'Premium' : 'Free' }}
                    </Badge>
                    <span v-if="template.is_premium" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {{ template.credit_cost }} credits
                    </span>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-4 text-sm">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <Eye class="w-4 h-4 mr-1" />
                      {{ formatNumber(template.views) }}
                    </div>
                    <div class="flex items-center text-green-600 dark:text-green-400">
                      <Download class="w-4 h-4 mr-1" />
                      {{ formatNumber(template.downloads) }}
                    </div>
                    <div class="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Star class="w-4 h-4 mr-1" />
                      {{ template.rating }}
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ formatNumber(template.purchases * template.credit_cost) }} credits
                    </div>
                    <div class="text-gray-500 dark:text-gray-400">
                      {{ template.purchases }} purchases
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex flex-col space-y-1">
                    <Badge 
                      :variant="template.is_active ? 'success' : 'secondary'" 
                      size="sm"
                    >
                      {{ template.is_active ? 'Active' : 'Inactive' }}
                    </Badge>
                    <Badge 
                      v-if="template.is_featured" 
                      variant="info" 
                      size="sm"
                    >
                      Featured
                    </Badge>
                  </div>
                </td>
                
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="previewTemplate(template)"
                      class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Preview"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button 
                      @click="editTemplate(template)"
                      class="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Edit"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button 
                      @click="duplicateTemplate(template)"
                      class="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      title="Duplicate"
                    >
                      <Copy class="w-4 h-4" />
                    </button>
                    <button 
                      @click="toggleFeatured(template)"
                      class="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                      :title="template.is_featured ? 'Remove from Featured' : 'Add to Featured'"
                    >
                      <Star :class="{ 'fill-current text-yellow-500': template.is_featured }" class="w-4 h-4" />
                    </button>
                    <div class="relative" ref="actionsDropdown">
                      <button 
                        @click="toggleActionsMenu(template.id)"
                        class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <MoreVertical class="w-4 h-4" />
                      </button>
                      
                      <!-- Actions Dropdown -->
                      <div v-if="activeActionsMenu === template.id" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-20">
                        <button @click="viewAnalytics(template)" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center">
                          <BarChart3 class="w-4 h-4 mr-3" />
                          View Analytics
                        </button>
                        <button @click="exportTemplate(template)" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center">
                          <Download class="w-4 h-4 mr-3" />
                          Export Template
                        </button>
                        <button @click="changeCategory(template)" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center">
                          <Tag class="w-4 h-4 mr-3" />
                          Change Category
                        </button>
                        <button @click="manageAccess(template)" class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center">
                          <Users class="w-4 h-4 mr-3" />
                          Manage Access
                        </button>
                        <hr class="my-2 border-gray-200 dark:border-gray-600" />
                        <button @click="deleteTemplate(template)" class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                          <Trash2 class="w-4 h-4 mr-3" />
                          Delete Template
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TemplateCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTemplateCreated"
    />

    <TemplateEditorModal
      v-if="editingTemplate"
      :template="editingTemplate"
      @close="editingTemplate = null"
      @updated="handleTemplateUpdated"
    />

    <TemplatePreviewModal
      v-if="previewingTemplate"
      :template="previewingTemplate"
      @close="previewingTemplate = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Plus, Upload, Search, FileText, Crown, Download, DollarSign, Eye, 
  Edit, Copy, Star, MoreVertical, BarChart3, Tag, Users, Trash2
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import Pagination from '@/components/common/Pagination.vue'
import TemplateCreateModal from '@/components/admin/templates/TemplateCreateModal.vue'
import TemplateEditorModal from '@/components/admin/templates/TemplateEditorModal.vue'
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal.vue'
import templatesAPI from '@/services/templates.api'
import { showSuccess, showError, showWarning } from '@/services/toast'

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const filterType = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const showCreateModal = ref(false)
const editingTemplate = ref(null)
const previewingTemplate = ref(null)
const activeActionsMenu = ref(null)
const loading = ref(true)

// Real data from API
const stats = ref({
  total_templates: 0,
  premium_templates: 0,
  total_downloads: 0,
  total_revenue: 0
})

const templates = ref([])
const totalItems = ref(0)

// Computed
const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      filtered = filtered.filter(t => t.is_active)
    } else if (filterStatus.value === 'draft') {
      filtered = filtered.filter(t => !t.is_active)
    } else if (filterStatus.value === 'featured') {
      filtered = filtered.filter(t => t.is_featured)
    }
  }

  if (filterCategory.value) {
    filtered = filtered.filter(t => t.category.toLowerCase() === filterCategory.value)
  }

  if (filterType.value) {
    if (filterType.value === 'premium') {
      filtered = filtered.filter(t => t.is_premium)
    } else if (filterType.value === 'free') {
      filtered = filtered.filter(t => !t.is_premium)
    }
  }

  return filtered
})

const totalPages = computed(() => 
  Math.ceil(totalItems.value / itemsPerPage)
)

const paginatedTemplates = computed(() => {
  return templates.value
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const loadTemplates = async () => {
  loading.value = true
  try {
    const params = {
      search: searchQuery.value || undefined,
      category: filterCategory.value || undefined,
      status: filterStatus.value || undefined,
      type: filterType.value || undefined,
      page: currentPage.value,
      per_page: itemsPerPage
    }

    const response = await templatesAPI.getTemplates(params)
    templates.value = response.templates || []
    totalItems.value = response.pagination?.total || 0
  } catch (error) {
    console.error('Failed to load templates:', error)
    
    if (error.response?.status === 401) {
      showError('Authentication required. Please login again.')
      // Redirect to login
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }
    
    if (error.response?.status === 403) {
      showError('Access denied. Admin role required.')
      return
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to load templates'
    console.error('Error details:', error.response?.data || errorMessage)
    showError(errorMessage)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const statsData = await templatesAPI.getStats()
    stats.value = statsData
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const getDefaultPreview = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=48`
}

const toggleActionsMenu = (templateId) => {
  activeActionsMenu.value = activeActionsMenu.value === templateId ? null : templateId
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
  activeActionsMenu.value = null
}

const editTemplate = (template) => {
  editingTemplate.value = template
  activeActionsMenu.value = null
}

const duplicateTemplate = async (template) => {
  try {
    const duplicatedTemplate = await templatesAPI.duplicateTemplate(template.id)
    templates.value.unshift(duplicatedTemplate)
    showSuccess(`Template "${template.name}" duplicated successfully`)
    activeActionsMenu.value = null
    await loadStats()
  } catch (error) {
    console.error('Failed to duplicate template:', error)
    showError('Failed to duplicate template')
  }
}

const toggleFeatured = async (template) => {
  try {
    const updatedTemplate = await templatesAPI.toggleFeatured(template.id)
    const index = templates.value.findIndex(t => t.id === template.id)
    if (index > -1) {
      templates.value[index] = updatedTemplate
    }
    showSuccess(`Template ${updatedTemplate.is_featured ? 'added to' : 'removed from'} featured`)
    activeActionsMenu.value = null
  } catch (error) {
    console.error('Failed to update featured status:', error)
    showError('Failed to update featured status')
  }
}

const viewAnalytics = (template) => {
  // TODO: Navigate to template analytics
  showSuccess(`Viewing analytics for "${template.name}"`)
  activeActionsMenu.value = null
}

const exportTemplate = async (template) => {
  try {
    const blob = await templatesAPI.exportTemplate(template.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess(`Template "${template.name}" exported successfully`)
    activeActionsMenu.value = null
  } catch (error) {
    console.error('Failed to export template:', error)
    showError('Failed to export template')
  }
}

const changeCategory = async (template) => {
  const newCategory = prompt('Enter new category:', template.category)
  if (newCategory && newCategory !== template.category) {
    try {
      const updatedTemplate = await templatesAPI.updateCategory(template.id, newCategory)
      const index = templates.value.findIndex(t => t.id === template.id)
      if (index > -1) {
        templates.value[index] = updatedTemplate
      }
      showSuccess(`Category updated for "${template.name}"`)
      activeActionsMenu.value = null
    } catch (error) {
      console.error('Failed to update category:', error)
      showError('Failed to update category')
    }
  }
}

const manageAccess = (template) => {
  // TODO: Open access management modal
  showSuccess(`Managing access for "${template.name}" - Coming in next update`)
  activeActionsMenu.value = null
}

const deleteTemplate = async (template) => {
  if (confirm(`Are you sure you want to delete "${template.name}"? This action cannot be undone.`)) {
    try {
      await templatesAPI.deleteTemplate(template.id)
      const index = templates.value.findIndex(t => t.id === template.id)
      if (index > -1) {
        templates.value.splice(index, 1)
      }
      showSuccess(`Template "${template.name}" deleted successfully`)
      activeActionsMenu.value = null
      await loadStats()
    } catch (error) {
      console.error('Failed to delete template:', error)
      showError('Failed to delete template')
    }
  }
}

const importTemplate = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.html,.htm'
  input.onchange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const importedTemplate = await templatesAPI.importTemplate(file)
        templates.value.unshift(importedTemplate)
        showSuccess(`Template imported successfully: "${importedTemplate.name}"`)
        await loadStats()
      } catch (error) {
        console.error('Failed to import template:', error)
        showError('Failed to import template')
      }
    }
  }
  input.click()
}

const handleTemplateCreated = async (template) => {
  showCreateModal.value = false
  await loadTemplates()
  await loadStats()
}

const handleTemplateUpdated = async (updatedTemplate) => {
  editingTemplate.value = null
  await loadTemplates()
  await loadStats()
}

const handlePageChange = (page) => {
  currentPage.value = page
  activeActionsMenu.value = null
  loadTemplates()
}

// Initialize
onMounted(async () => {
  await Promise.all([
    loadTemplates(),
    loadStats()
  ])
})

// Watch for filter changes
watch([searchQuery, filterStatus, filterCategory, filterType], () => {
  currentPage.value = 1
  loadTemplates()
}, { debounce: 300 })
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
