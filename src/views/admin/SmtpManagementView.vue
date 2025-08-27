<template>
  <div class="p-6 space-y-6">
    <!-- Debug Info (remove in production) -->
    <div v-if="isDevelopment" class="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
      Debug: showAddModal = {{ showAddModal }}, editingServer = {{ !!editingServer }}
    </div>
    
    <!-- Header -->
    <div class="flex items-center justify-between">
  <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.smtp.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('admin.smtp.description') }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <Button
          variant="outline"
          @click="refreshData"
          :loading="loading"
          class="flex items-center"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          {{ $t('common.refresh', 'Refresh') }}
        </Button>
        
        <!-- Debug Test Button (remove in production) -->
        <Button
          v-if="isDevelopment"
          variant="outline"
          @click="() => { showAddModal = !showAddModal; console.log('Debug toggle:', showAddModal) }"
          class="flex items-center"
        >
          Test Modal
        </Button>
        
        <Button @click="handleAddServer" class="flex items-center">
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('admin.smtp.addServer', 'Add Server') }}
        </Button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        :title="$t('admin.smtp.stats.totalServers')"
        :value="totalServers.toString()"
        :icon="Server"
        color="blue"
      />
      <StatsCard
        :title="$t('admin.smtp.stats.activeServers')"
        :value="activeServers.length.toString()"
        :icon="CheckCircle"
        color="green"
      />
      <StatsCard
        :title="$t('admin.smtp.stats.dailyEmails')"
        :value="totalDailyEmails.toString()"
        :icon="Mail"
        color="purple"
      />
      <StatsCard
        :title="$t('admin.smtp.stats.avgSuccessRate')"
        :value="`${avgSuccessRate}%`"
        :icon="TrendingUp"
        color="orange"
      />
    </div>

    <!-- Filters & Search -->
    <Card class="p-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              v-model="searchQuery"
              :placeholder="$t('admin.smtp.searchPlaceholder')"
              class="pl-10 w-64"
            />
          </div>
          <SelectField
            v-model="statusFilter"
            :options="statusOptions"
            :placeholder="$t('admin.smtp.filterByStatus')"
            class="w-40"
          />
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction = 'activate'"
            :disabled="selectedServers.length === 0"
          >
            {{ $t('admin.smtp.bulkActivate') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction = 'deactivate'"
            :disabled="selectedServers.length === 0"
          >
            {{ $t('admin.smtp.bulkDeactivate') }}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            @click="bulkAction = 'delete'"
            :disabled="selectedServers.length === 0"
          >
            {{ $t('admin.smtp.bulkDelete') }}
          </Button>
        </div>
      </div>
    </Card>

    <!-- SMTP Servers Table -->
    <Card class="overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('admin.smtp.serversList') }}
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedServers.length }} {{ $t('common.selected') }}
            </span>
            <Checkbox
              :checked="isAllSelected"
              @update:checked="toggleSelectAll"
            />
          </div>
        </div>
      </div>

      <div v-if="loading && smtpServers.length === 0" class="p-8">
        <SkeletonLoader :rows="5" />
      </div>

      <div v-else-if="filteredServers.length === 0" class="p-8">
        <EmptyState
          :icon="Server"
          :title="$t('admin.smtp.noServers', 'No SMTP Servers')"
          :description="$t('admin.smtp.noServersDescription', 'No SMTP servers found. Add your first server to get started.')"
          :action-label="$t('admin.smtp.addServer', 'Add Server')"
          @action="handleAddServer"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Checkbox
                  :checked="isAllSelected"
                  @update:checked="toggleSelectAll"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.server') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.usage') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.performance') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.lastUsed') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('admin.smtp.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="server in filteredServers"
              :key="server.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <Checkbox
                  :checked="selectedServers.includes(server.id)"
                  @update:checked="toggleServerSelection(server.id)"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full flex items-center justify-center"
                         :class="server.is_active 
                           ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                           : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    >
                      <Server class="h-4 w-4" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ server.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ server.host }}:{{ server.port }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <StatusBadge
                    :status="server.is_active ? 'active' : 'inactive'"
                    :label="server.is_active ? $t('common.active') : $t('common.inactive')"
                  />
                  <Badge
                    v-if="server.is_shared"
                    variant="secondary"
                    size="sm"
                  >
                    {{ $t('admin.smtp.shared') }}
                  </Badge>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  <div>{{ server.emails_sent_today || 0 }} / {{ server.daily_limit || '∞' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('admin.smtp.dailyUsage') }}
                  </div>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{ width: `${getUsagePercentage(server)}%` }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ server.stats?.success_rate || 0 }}%
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('admin.smtp.successRate') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(server.last_used_at) || $t('common.never') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Dropdown :items="getServerActions(server)">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal class="w-4 h-4" />
                  </Button>
                </Dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Performance Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.smtp.analytics.usage') }}
        </h3>
        <SmtpUsageChart :servers="smtpServers" />
      </Card>
      
      <Card class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ $t('admin.smtp.analytics.performance') }}
        </h3>
        <SmtpPerformanceChart :servers="smtpServers" />
      </Card>
    </div>

    <!-- Add/Edit Server Modal -->
    <Modal 
      :model-value="showAddModal || !!editingServer" 
      :title="editingServer ? $t('admin.smtp.editServer', 'Edit SMTP Server') : $t('admin.smtp.addServer', 'Add SMTP Server')"
      size="2xl"
      @close="closeModal"
    >
      <SmtpServerForm
        :server="editingServer"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="closeModal"
        @test="handleTestConnection"
      />
    </Modal>

    <!-- Bulk Action Confirmation -->
    <ConfirmDialog
      v-if="bulkAction"
      :title="getBulkActionTitle()"
      :message="getBulkActionMessage()"
      :type="bulkAction === 'delete' ? 'danger' : 'warning'"
      @confirm="handleBulkAction"
      @cancel="bulkAction = null"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="deletingServer"
      :title="$t('admin.smtp.deleteTitle')"
      :message="$t('admin.smtp.deleteMessage', { name: deletingServer.name })"
      type="danger"
      @confirm="confirmDelete"
      @cancel="deletingServer = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import {
  Server,
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  Mail,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-vue-next'

// Stores
import { useSmtpStore } from '@/stores/smtp'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Modal from '@/components/ui/Modal.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Badge from '@/components/ui/Badge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import SmtpServerForm from '@/components/settings/smtp/SmtpServerForm.vue'
import SmtpUsageChart from '@/components/settings/smtp/SmtpUsageChart.vue'
import SmtpPerformanceChart from '@/components/settings/smtp/SmtpPerformanceChart.vue'

// Types
import type { SmtpServer, CreateSmtpServerData, UpdateSmtpServerData } from '@/types/smtp'

const { t } = useI18n()
const toast = useToast()

// Store
const smtpStore = useSmtpStore()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const selectedServers = ref<number[]>([])
const showAddModal = ref(false)
const editingServer = ref<SmtpServer | null>(null)
const deletingServer = ref<SmtpServer | null>(null)
const bulkAction = ref<'activate' | 'deactivate' | 'delete' | null>(null)

// Computed properties
const smtpServers = computed(() => smtpStore.smtpServers)
const loading = computed(() => smtpStore.loading)
const totalServers = computed(() => smtpStore.totalServers)
const activeServers = computed(() => smtpStore.activeServers)

const totalDailyEmails = computed(() => 
  smtpServers.value.reduce((total, server) => total + (server.emails_sent_today || 0), 0)
)

const avgSuccessRate = computed(() => {
  if (smtpServers.value.length === 0) return 0
  const total = smtpServers.value.reduce((sum, server) => sum + (server.stats?.success_rate || 0), 0)
  return Math.round(total / smtpServers.value.length)
})

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'active', label: t('common.active') },
  { value: 'inactive', label: t('common.inactive') },
  { value: 'shared', label: t('admin.smtp.shared') },
])

const filteredServers = computed(() => {
  let filtered = smtpServers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(server =>
      server.name.toLowerCase().includes(query) ||
      server.host.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(server => {
      switch (statusFilter.value) {
        case 'active':
          return server.is_active
        case 'inactive':
          return !server.is_active
        case 'shared':
          return server.is_shared
        default:
          return true
      }
    })
  }

  return filtered
})

const isAllSelected = computed(() => 
  filteredServers.value.length > 0 && 
  filteredServers.value.every(server => selectedServers.value.includes(server.id))
)

const isDevelopment = computed(() => {
  try {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost'
  } catch {
    return false
  }
})

// Methods
const refreshData = async () => {
  try {
    await Promise.all([
      smtpStore.fetchSmtpServers(),
      smtpStore.fetchSharedServers()
    ])
  } catch (error) {
    console.error('Error refreshing data:', error)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedServers.value = []
  } else {
    selectedServers.value = filteredServers.value.map(server => server.id)
  }
}

const toggleServerSelection = (serverId: number) => {
  const index = selectedServers.value.indexOf(serverId)
  if (index > -1) {
    selectedServers.value.splice(index, 1)
  } else {
    selectedServers.value.push(serverId)
  }
}

const getUsagePercentage = (server: SmtpServer) => {
  if (!server.daily_limit) return 0
  return Math.min(100, ((server.emails_sent_today || 0) / server.daily_limit) * 100)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString()
}

const getServerActions = (server: SmtpServer) => [
  {
    label: t('admin.smtp.actions.test'),
    icon: 'TestTube',
    action: () => handleTestServer(server.id)
  },
  {
    label: t('admin.smtp.actions.edit'),
    icon: 'Edit',
    action: () => {
      editingServer.value = server
    }
  },
  {
    label: server.is_active ? t('admin.smtp.actions.deactivate') : t('admin.smtp.actions.activate'),
    icon: server.is_active ? 'PowerOff' : 'Power',
    action: () => handleToggleServer(server)
  },
  {
    label: t('admin.smtp.actions.delete'),
    icon: 'Trash',
    action: () => {
      deletingServer.value = server
    },
    class: 'text-red-600 hover:text-red-700'
  }
]

const handleTestServer = async (serverId: number) => {
  try {
    await smtpStore.testSmtpConnection(serverId)
  } catch (error) {
    console.error('Error testing server:', error)
  }
}

const handleToggleServer = async (server: SmtpServer) => {
  try {
    await smtpStore.updateSmtpServer(server.id, {
      is_active: !server.is_active
    })
  } catch (error) {
    console.error('Error toggling server:', error)
  }
}

const handleSubmit = async (data: CreateSmtpServerData | UpdateSmtpServerData) => {
  try {
    if (editingServer.value) {
      await smtpStore.updateSmtpServer(editingServer.value.id, data as UpdateSmtpServerData)
    } else {
      await smtpStore.createSmtpServer(data as CreateSmtpServerData)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving server:', error)
  }
}

const handleTestConnection = async (data: CreateSmtpServerData) => {
  // Implement test connection logic
  toast.info(t('admin.smtp.testing'))
}

const closeModal = () => {
  showAddModal.value = false
  editingServer.value = null
}

const getBulkActionTitle = () => {
  switch (bulkAction.value) {
    case 'activate':
      return t('admin.smtp.bulkActivateTitle')
    case 'deactivate':
      return t('admin.smtp.bulkDeactivateTitle')
    case 'delete':
      return t('admin.smtp.bulkDeleteTitle')
    default:
      return ''
  }
}

const getBulkActionMessage = () => {
  switch (bulkAction.value) {
    case 'activate':
      return t('admin.smtp.bulkActivateMessage', { count: selectedServers.value.length })
    case 'deactivate':
      return t('admin.smtp.bulkDeactivateMessage', { count: selectedServers.value.length })
    case 'delete':
      return t('admin.smtp.bulkDeleteMessage', { count: selectedServers.value.length })
    default:
      return ''
  }
}

const handleBulkAction = async () => {
  try {
    const promises = selectedServers.value.map(serverId => {
      switch (bulkAction.value) {
        case 'activate':
          return smtpStore.updateSmtpServer(serverId, { is_active: true })
        case 'deactivate':
          return smtpStore.updateSmtpServer(serverId, { is_active: false })
        case 'delete':
          return smtpStore.deleteSmtpServer(serverId)
        default:
          return Promise.resolve()
      }
    })

    await Promise.all(promises)
    selectedServers.value = []
    bulkAction.value = null
    toast.success(t('admin.smtp.bulkActionSuccess'))
  } catch (error) {
    console.error('Error performing bulk action:', error)
    toast.error(t('admin.smtp.bulkActionError'))
  }
}

const confirmDelete = async () => {
  if (deletingServer.value) {
    try {
      await smtpStore.deleteSmtpServer(deletingServer.value.id)
      deletingServer.value = null
    } catch (error) {
      console.error('Error deleting server:', error)
    }
  }
}

const handleAddServer = () => {
  console.log('Add server button clicked')
  showAddModal.value = true
  editingServer.value = null
  console.log('showAddModal set to:', showAddModal.value)
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Scoped styles go here */
</style>
