<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
  <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.templates.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('admin.templates.description') }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <Button
          variant="outline"
          @click="importTemplates"
          :loading="importing"
          class="flex items-center"
        >
          <Upload class="w-4 h-4 mr-2" />
          {{ $t('admin.templates.import') }}
        </Button>
        <Button
          @click="showCreateDialog = true"
          class="flex items-center"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('admin.templates.create') }}
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <FileText class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.templates.totalTemplates') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ totalTemplates }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <Globe class="h-8 w-8 text-green-600 dark:text-green-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.templates.globalTemplates') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ globalTemplates }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <Crown class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.templates.premiumTemplates') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ premiumTemplates }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <Activity class="h-8 w-8 text-orange-600 dark:text-orange-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.templates.activeTemplates') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ activeTemplates }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <SearchField
            v-model="searchQuery"
            :placeholder="$t('admin.templates.searchPlaceholder')"
            @search="handleSearch"
          />
        </div>
        
        <div class="flex items-center space-x-3">
          <SelectField
            v-model="filters.type"
            :options="typeOptions"
            :placeholder="$t('admin.templates.filterByType')"
            class="w-40"
          />
          
          <SelectField
            v-model="filters.category"
            :options="categoryOptions"
            :placeholder="$t('admin.templates.filterByCategory')"
            class="w-40"
          />
          
          <SelectField
            v-model="viewMode"
            :options="viewModeOptions"
            class="w-32"
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

    <!-- Templates Grid/List -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
      </div>
    </div>
    
    <div v-else-if="paginatedTemplates.length === 0" class="text-center py-12">
      <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('admin.templates.noTemplates') }}
      </p>
    </div>
    
    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Badge :variant="getTypeVariant(template.type)">
              {{ $t(`admin.templates.types.${template.type}`) }}
            </Badge>
          </div>
          
          <!-- Global Badge -->
          <div v-if="template.is_global" class="absolute top-2 right-2">
            <Badge variant="success">
              <Globe class="h-3 w-3 mr-1" />
              {{ $t('admin.templates.global') }}
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
              {{ $t('admin.templates.preview') }}
            </Button>
          </div>
        </div>
        
        <!-- Template Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
              {{ template.name }}
            </h3>
            <Dropdown>
              <template #trigger>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </template>
              
              <template #content>
                <DropdownItem @click="editTemplate(template)">
                  <Edit class="h-4 w-4 mr-2" />
                  {{ $t('common.edit') }}
                </DropdownItem>
                <DropdownItem @click="duplicateTemplate(template)">
                  <Copy class="h-4 w-4 mr-2" />
                  {{ $t('admin.templates.duplicate') }}
                </DropdownItem>
                <DropdownItem @click="previewTemplate(template)">
                  <Eye class="h-4 w-4 mr-2" />
                  {{ $t('admin.templates.preview') }}
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  v-if="!template.is_global"
                  @click="makeGlobal(template)"
                >
                  <Globe class="h-4 w-4 mr-2" />
                  {{ $t('admin.templates.makeGlobal') }}
                </DropdownItem>
                <DropdownItem
                  v-else
                  @click="removeGlobal(template)"
                >
                  <Globe class="h-4 w-4 mr-2" />
                  {{ $t('admin.templates.removeGlobal') }}
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  @click="deleteTemplate(template)"
                  class="text-red-600"
                >
                  <Trash2 class="h-4 w-4 mr-2" />
                  {{ $t('common.delete') }}
                </DropdownItem>
              </template>
            </Dropdown>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ template.description || $t('admin.templates.noDescription') }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ $t('admin.templates.category') }}: {{ template.category }}</span>
            <span>{{ formatDate(template.updated_at) }}</span>
          </div>
          
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ $t('admin.templates.usageCount', { count: template.usage_count || 0 }) }}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                @click="editTemplate(template)"
              >
                {{ $t('common.edit') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <Card v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Checkbox
                  v-model="selectAll"
                  @change="handleSelectAll"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.type') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.category') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.usage') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.updated') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.templates.list.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="template in paginatedTemplates"
              :key="template.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <Checkbox
                  v-model="selectedTemplates"
                  :value="template.id"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="template.thumbnail"
                      :src="template.thumbnail"
                      :alt="template.name"
                      class="h-10 w-10 rounded object-cover"
                    />
                    <div v-else class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <FileText class="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ template.name }}
                      </div>
                      <Globe v-if="template.is_global" class="h-4 w-4 ml-2 text-green-600" />
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {{ template.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getTypeVariant(template.type)">
                  {{ $t(`admin.templates.types.${template.type}`) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ template.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ template.usage_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(template.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="previewTemplate(template)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="editTemplate(template)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Dropdown>
                    <template #trigger>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </template>
                    
                    <template #content>
                      <DropdownItem @click="duplicateTemplate(template)">
                        <Copy class="h-4 w-4 mr-2" />
                        {{ $t('admin.templates.duplicate') }}
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem
                        v-if="!template.is_global"
                        @click="makeGlobal(template)"
                      >
                        <Globe class="h-4 w-4 mr-2" />
                        {{ $t('admin.templates.makeGlobal') }}
                      </DropdownItem>
                      <DropdownItem
                        v-else
                        @click="removeGlobal(template)"
                      >
                        <Globe class="h-4 w-4 mr-2" />
                        {{ $t('admin.templates.removeGlobal') }}
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem
                        @click="deleteTemplate(template)"
                        class="text-red-600"
                      >
                        <Trash2 class="h-4 w-4 mr-2" />
                        {{ $t('common.delete') }}
                      </DropdownItem>
                    </template>
                  </Dropdown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          v-model:page="currentPage"
          :total="filteredTemplates.length"
          :per-page="perPage"
          :show-size-changer="true"
          @update:per-page="perPage = $event"
        />
      </div>
    </Card>

    <!-- Bulk Actions -->
    <div
      v-if="selectedTemplates.length > 0"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
    >
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('admin.templates.selectedCount', { count: selectedTemplates.length }) }}
        </span>
        
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction('makeGlobal')"
          >
            {{ $t('admin.templates.bulkMakeGlobal') }}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction('removeGlobal')"
          >
            {{ $t('admin.templates.bulkRemoveGlobal') }}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            @click="bulkAction('delete')"
          >
            {{ $t('common.delete') }}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          @click="selectedTemplates = []"
        >
          {{ $t('common.cancel') }}
        </Button>
      </div>
    </div>

    <!-- Dialogs -->
    <TemplateCreateDialog
      v-model="showCreateDialog"
      @created="handleTemplateCreated"
    />
    
    <TemplateEditDialog
      v-model="showEditDialog"
      :template="selectedTemplate"
      @updated="handleTemplateUpdated"
    />
    
    <TemplateImportDialog
      v-model="showImportDialog"
      @imported="handleTemplatesImported"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  FileText,
  Globe,
  Crown,
  Activity,
  Plus,
  Upload,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  Grid3X3,
  List
} from 'lucide-vue-next'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SearchField from '@/components/ui/SearchField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Badge from '@/components/ui/Badge.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'
import DropdownSeparator from '@/components/ui/DropdownSeparator.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

// Dialogs
import TemplateCreateDialog from '@/components/admin/templates/TemplateCreateDialog.vue'
import TemplateEditDialog from '@/components/admin/templates/TemplateEditDialog.vue'
import TemplateImportDialog from '@/components/admin/templates/TemplateImportDialog.vue'
// import TemplatePreviewDialog from '@/components/admin/templates/TemplatePreviewDialog.vue'

// Stores
import { useTemplatesStore } from '@/stores/templates'
import { useNotificationStore } from '@/stores/notifications'

// Types
import type { Template } from '@/types/templates'

const { t } = useI18n()
const templateStore = useTemplatesStore()
const notificationStore = useNotificationStore()

// Reactive data
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(12)
const viewMode = ref('grid')
const selectedTemplates = ref<number[]>([])
const selectAll = ref(false)
const importing = ref(false)

const filters = ref({
  type: '',
  category: ''
})

// Dialogs
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showImportDialog = ref(false)
const selectedTemplate = ref<Template | null>(null)

// Computed
const loading = computed(() => templateStore.loading)
const templates = computed(() => {
  console.log('View templates computed:', templateStore.templates)
  console.log('Templates length:', templateStore.templates?.length)
  return templateStore.templates || []
})

const totalTemplates = computed(() => templates.value.length)
const globalTemplates = computed(() => templates.value.filter(t => t.is_global).length)
const premiumTemplates = computed(() => templates.value.filter(t => t.type === 'premium').length)
const activeTemplates = computed(() => templates.value.filter(t => t.is_active).length)

const typeOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'free', label: t('admin.templates.types.free') },
  { value: 'premium', label: t('admin.templates.types.premium') },
  { value: 'global', label: t('admin.templates.types.global') }
])

const categoryOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'newsletter', label: t('admin.templates.categories.newsletter') },
  { value: 'promotional', label: t('admin.templates.categories.promotional') },
  { value: 'transactional', label: t('admin.templates.categories.transactional') },
  { value: 'welcome', label: t('admin.templates.categories.welcome') }
])

const viewModeOptions = computed(() => [
  { value: 'grid', label: t('admin.templates.viewModes.grid'), icon: Grid3X3 },
  { value: 'list', label: t('admin.templates.viewModes.list'), icon: List }
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

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedTemplates.value = paginatedTemplates.value.map(template => template.id)
  } else {
    selectedTemplates.value = []
  }
}

const getTypeVariant = (type: string) => {
  switch (type) {
    case 'premium': return 'warning'
    case 'global': return 'success'
    default: return 'default'
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const editTemplate = (template: Template) => {
  selectedTemplate.value = template
  showEditDialog.value = true
}

const previewTemplate = (template: Template) => {
  selectedTemplate.value = template
  // showPreviewDialog.value = true
}

const duplicateTemplate = async (template: Template) => {
  try {
    await templateStore.duplicateTemplate(template.id)
    notificationStore.success(t('admin.templates.templateDuplicated'))
  } catch (error) {
    notificationStore.error(t('admin.templates.duplicateError'))
  }
}

const makeGlobal = async (template: Template) => {
  try {
    await templateStore.makeGlobal(template.id)
    notificationStore.success(t('admin.templates.madeGlobal'))
  } catch (error) {
    notificationStore.error(t('admin.templates.makeGlobalError'))
  }
}

const removeGlobal = async (template: Template) => {
  try {
    await templateStore.removeGlobal(template.id)
    notificationStore.success(t('admin.templates.removedGlobal'))
  } catch (error) {
    notificationStore.error(t('admin.templates.removeGlobalError'))
  }
}

const deleteTemplate = async (template: Template) => {
  if (confirm(t('admin.templates.confirmDelete', { name: template.name }))) {
    try {
      await templateStore.deleteTemplate(template.id)
      notificationStore.success(t('admin.templates.templateDeleted'))
    } catch (error) {
      notificationStore.error(t('admin.templates.deleteError'))
    }
  }
}

const bulkAction = async (action: string) => {
  const count = selectedTemplates.value.length
  const confirmMessage = t(`admin.templates.confirm${action.charAt(0).toUpperCase() + action.slice(1)}`, { count })
  
  if (confirm(confirmMessage)) {
    try {
      await templateStore.bulkAction(action, selectedTemplates.value)
      notificationStore.success(t('admin.templates.bulkActionSuccess'))
      selectedTemplates.value = []
    } catch (error) {
      notificationStore.error(t('admin.templates.bulkActionError'))
    }
  }
}

const importTemplates = () => {
  showImportDialog.value = true
}

const handleTemplateCreated = () => {
  templateStore.fetchTemplates()
  notificationStore.success(t('admin.templates.templateCreated'))
}

const handleTemplateUpdated = () => {
  templateStore.fetchTemplates()
  notificationStore.success(t('admin.templates.templateUpdated'))
}

const handleTemplatesImported = () => {
  templateStore.fetchTemplates()
  notificationStore.success(t('admin.templates.templatesImported'))
}

// Watchers
watch(selectedTemplates, () => {
  selectAll.value = selectedTemplates.value.length === paginatedTemplates.value.length && paginatedTemplates.value.length > 0
})

// Lifecycle
onMounted(() => {
  templateStore.fetchTemplates()
})
</script>

<style scoped>
/* Scoped styles go here */
</style> 