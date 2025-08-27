<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Create, browse, and manage your email templates</p>
          </div>
          <div class="flex items-center space-x-3">
            <router-link 
              to="/templates/gallery"
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Star class="w-4 h-4 mr-2 inline" />
              Browse Gallery
            </router-link>
            <router-link 
              to="/templates/create"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus class="w-4 h-4 mr-2 inline" />
              Create Template
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Plus class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create Template</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Choose your preferred editor</p>
            </div>
          </div>
          <div class="flex gap-2">
            <router-link 
              to="/templates/visual-editor"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium text-center"
            >
              <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
              </svg>
              Visual Editor
            </router-link>
            <router-link 
              to="/templates/create"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-center"
            >
              <Edit class="w-4 h-4 mr-1 inline" />
              Code Editor
            </router-link>
          </div>
        </div>

        <router-link 
          to="/templates/gallery"
          class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
              <Star class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Premium Gallery</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Browse professional templates</p>
            </div>
          </div>
        </router-link>

        <router-link 
          to="/campaigns/templates"
          class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <Send class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Start Campaign</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Choose template for campaign</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- My Templates Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">My Templates</h2>
            <div class="flex items-center space-x-3">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search templates..."
                  class="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select v-model="categoryFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
                <option value="">All Categories</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="transactional">Transactional</option>
                <option value="welcome">Welcome</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Templates Grid -->
        <div class="p-6">
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
              <div class="mt-3 space-y-2">
                <div class="bg-gray-200 dark:bg-gray-700 rounded h-4"></div>
                <div class="bg-gray-200 dark:bg-gray-700 rounded h-3 w-2/3"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredTemplates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="template in filteredTemplates" 
              :key="template.id"
              class="group bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <!-- Template Preview -->
              <div class="relative h-48 bg-gray-100 dark:bg-gray-600">
                <img 
                  v-if="template.preview_image"
                  :src="template.preview_image" 
                  :alt="template.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <FileText class="w-12 h-12 text-gray-400" />
                </div>
                
                <!-- Overlay Actions -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div class="flex space-x-2">
                    <button 
                      @click="previewTemplate(template)"
                      class="px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      <Eye class="w-4 h-4 mr-1 inline" />
                      Preview
                    </button>
                    <div class="flex gap-2">
                      <button 
                        @click="editTemplateVisual(template)"
                        class="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                        title="Edit with drag & drop visual editor"
                      >
                        <svg class="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                        </svg>
                        Visual
                      </button>
                      <button 
                        @click="editTemplate(template)"
                        class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        title="Edit with code/HTML editor"
                      >
                        <Edit class="w-4 h-4 mr-1 inline" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Template Info -->
              <div class="p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">{{ template.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ template.description }}</p>
                  </div>
                  <div class="ml-3 flex-shrink-0">
                    <button 
                      @click="showTemplateMenu(template)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                    <Badge variant="secondary" size="sm">{{ template.category }}</Badge>
                    <span>{{ formatDate(template.updated_at) }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="useTemplate(template)"
                      class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <FileText class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first email template</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <router-link 
                to="/templates/create"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </router-link>
              <router-link 
                to="/templates/gallery"
                class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Browse Gallery
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TemplatePreviewModal
      v-if="previewingTemplate"
      :template="previewingTemplate"
      @close="previewingTemplate = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Star, Send, Search, Eye, Edit, MoreVertical, FileText
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import TemplatePreviewModal from '@/components/templates/TemplatePreviewModal.vue'
import { showSuccess, showError } from '@/services/toast'

const router = useRouter()

// State
const loading = ref(true)
const searchQuery = ref('')
const categoryFilter = ref('')
const previewingTemplate = ref(null)

// Mock data - replace with real API call
const templates = ref([
  {
    id: 1,
    name: 'Welcome Newsletter',
    description: 'A warm welcome email for new subscribers',
    category: 'welcome',
    preview_image: 'https://via.placeholder.com/400x300/3B82F6/white?text=Welcome+Email',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Monthly Newsletter',
    description: 'Regular monthly update template',
    category: 'newsletter',
    preview_image: 'https://via.placeholder.com/400x300/10B981/white?text=Newsletter',
    updated_at: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    name: 'Product Launch',
    description: 'Exciting product announcement template',
    category: 'promotional',
    preview_image: 'https://via.placeholder.com/400x300/8B5CF6/white?text=Product+Launch',
    updated_at: '2024-01-12T09:15:00Z'
  }
])

// Computed
const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(t => t.category === categoryFilter.value)
  }

  return filtered
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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
}

const editTemplate = (template) => {
  router.push(`/templates/${template.id}/edit`)
}

const editTemplateVisual = (template) => {
  router.push(`/templates/visual-editor/${template.id}`)
}

const useTemplate = (template) => {
  router.push({
    name: 'CreateCampaign',
    query: { template: template.id }
  })
}

const showTemplateMenu = (template) => {
  // TODO: Show context menu with options like duplicate, delete, etc.
  console.log('Show menu for template:', template.name)
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
