<template>
  <div class="space-y-6">
    <!-- Add SMTP Server Card -->
    <SettingsCard
      :title="$t('settings.smtp.title')"
      :action-label="$t('settings.smtp.add')"
      @action="toggleForm"
    >
      <!-- SMTP Form -->
      <div v-if="showForm" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
        <SmtpServerForm
          :loading="smtpLoading"
          @submit="handleAddServer"
          @cancel="toggleForm"
          @test="handleTestConnection"
        />
      </div>

      <!-- SMTP Servers List -->
      <div v-if="smtpServers.length === 0 && !showForm" class="text-center py-12">
        <Server class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ $t('settings.smtp.noServers') }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {{ $t('settings.smtp.noServersDescription') }}
        </p>
        <button
          @click="toggleForm"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('settings.smtp.addFirst') }}
        </button>
      </div>

      <!-- Servers Grid -->
      <div v-else-if="smtpServers.length > 0" class="space-y-4">
        <SmtpServerCard
          v-for="server in smtpServers"
          :key="server.id"
          :server="server"
          @test="handleTestServer"
          @edit="handleEditServer"
          @delete="handleDeleteServer"
          @toggle="handleToggleServer"
        />
      </div>
    </SettingsCard>

    <!-- Shared Servers (if available) -->
    <SettingsCard
      v-if="sharedServers.length > 0"
      :title="$t('settings.smtp.sharedServers')"
      :subtitle="$t('settings.smtp.sharedServersDescription')"
    >
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="server in sharedServers"
          :key="server.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Server class="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ server.name }}
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ server.host }}:{{ server.port }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ Math.round(server.stats?.usage_percentage || 0) }}% used
              </div>
              <div
                :class="[
                  server.stats?.is_available
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
                ]"
              >
                {{ server.stats?.is_available ? $t('common.available') : $t('common.unavailable') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>

    <!-- Usage Statistics -->
    <SettingsCard :title="$t('settings.smtp.usageStats')">
      <SmtpUsageChart :servers="smtpServers" />
    </SettingsCard>

    <!-- Edit Modal -->
    <SmtpEditModal
      v-if="editingServer"
      :server="editingServer"
      @save="handleUpdateServer"
      @close="editingServer = null"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="deletingServer"
      :title="$t('settings.smtp.deleteConfirmTitle')"
      :message="$t('settings.smtp.deleteConfirmMessage', { name: deletingServer.name })"
      @confirm="confirmDelete"
      @cancel="deletingServer = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { Server, Plus } from 'lucide-vue-next'

// Composables
import { useSmtpManagement } from '@/composables/settings/useSmtpManagement'

// Components
import SettingsCard from '@/components/ui/SettingsCard.vue'
import SmtpServerForm from '@/components/settings/smtp/SmtpServerForm.vue'
import SmtpServerCard from '@/components/settings/smtp/SmtpServerCard.vue'
import SmtpUsageChart from '@/components/settings/smtp/SmtpUsageChart.vue'
import SmtpEditModal from '@/components/settings/smtp/SmtpEditModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

// Types
import type { SmtpServerData, SmtpFormData } from '@/types/settings'

const { t } = useI18n()
const toast = useToast()

// Composables
const {
  smtpServers,
  sharedServers,
  smtpLoading,
  fetchServers,
  addServer,
  updateServer,
  deleteServer,
  testServer,
  testConnection
} = useSmtpManagement()

// Local state
const showForm = ref(false)
const editingServer = ref<SmtpServerData | null>(null)
const deletingServer = ref<SmtpServerData | null>(null)

// Methods
const toggleForm = () => {
  showForm.value = !showForm.value
}

const handleAddServer = async (formData: SmtpFormData) => {
  try {
    await addServer(formData)
    showForm.value = false
    toast.success(t('settings.smtp.addSuccess'))
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.addError'))
  }
}

const handleTestConnection = async (formData: SmtpFormData) => {
  try {
    const result = await testConnection(formData)
    if (result.success) {
      toast.success(t('settings.smtp.testSuccess'))
    } else {
      toast.error(result.message || t('settings.smtp.testFailed'))
    }
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.testError'))
  }
}

const handleTestServer = async (serverId: number) => {
  try {
    const result = await testServer(serverId)
    if (result.success) {
      toast.success(t('settings.smtp.testSuccess'))
    } else {
      toast.error(result.message || t('settings.smtp.testFailed'))
    }
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.testError'))
  }
}

const handleEditServer = (server: SmtpServerData) => {
  editingServer.value = { ...server }
}

const handleUpdateServer = async (serverData: SmtpServerData) => {
  try {
    await updateServer(serverData.id!, serverData)
    editingServer.value = null
    toast.success(t('settings.smtp.updateSuccess'))
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.updateError'))
  }
}

const handleDeleteServer = (server: SmtpServerData) => {
  deletingServer.value = server
}

const confirmDelete = async () => {
  if (!deletingServer.value) return
  
  try {
    await deleteServer(deletingServer.value.id!)
    deletingServer.value = null
    toast.success(t('settings.smtp.deleteSuccess'))
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.deleteError'))
  }
}

const handleToggleServer = async (server: SmtpServerData) => {
  try {
    await updateServer(server.id!, { is_active: !server.is_active })
    toast.success(t('settings.smtp.toggleSuccess'))
  } catch (error: any) {
    toast.error(error.message || t('settings.smtp.toggleError'))
  }
}

// Initialize
onMounted(async () => {
  await fetchServers()
})
</script>