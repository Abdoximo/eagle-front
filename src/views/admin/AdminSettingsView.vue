<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">SMTP Server Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage shared SMTP servers and load balancing</p>
      </div>

      <!-- Add Server Button -->
      <div class="mb-6">
        <button
          @click="showCreateModal = true"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add SMTP Server</span>
        </button>
      </div>

      <!-- Load Balancing Stats -->
      <div v-if="loadBalancingStats.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Load Balancing Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="server in loadBalancingStats"
            :key="server.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white">{{ server.name }}</h3>
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  server.is_available 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                ]"
              >
                {{ server.is_available ? 'Available' : 'Unavailable' }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Usage:</span>
                <span class="font-medium">{{ server.usage_percentage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all',
                    server.usage_percentage > 80 ? 'bg-red-500' :
                    server.usage_percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  ]"
                  :style="{ width: `${Math.min(server.usage_percentage, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>{{ server.emails_sent_today }} / {{ server.daily_limit }}</span>
                <span>Priority: {{ server.priority }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SMTP Servers Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">All SMTP Servers</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Server
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Configuration
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Limits
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Usage Today
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="server in smtpServers"
                :key="server.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ server.name }}</div>
                    <div class="text-sm text-gray-500">{{ server.host }}:{{ server.port }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div>{{ server.username }}</div>
                    <div class="text-gray-500">{{ server.encryption.toUpperCase() }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div>Daily: {{ server.daily_limit.toLocaleString() }}</div>
                    <div class="text-gray-500">Hourly: {{ server.hourly_limit.toLocaleString() }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium">{{ server.emails_sent_today.toLocaleString() }}</div>
                    <div class="text-gray-500">
                      {{ Math.round((server.emails_sent_today / server.daily_limit) * 100) }}% used
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs rounded-full',
                      server.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    ]"
                  >
                    {{ server.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editServer(server)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteServer(server)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingServer" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <SmtpServerForm
            :server="editingServer"
            :is-admin="true"
            @saved="handleServerSaved"
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { smtpService } from '@/services/smtp'
import SmtpServerForm from '@/components/forms/SmtpServerForm.vue'
import type { SmtpServer } from '@/services/smtp'

const smtpServers = ref<SmtpServer[]>([])
const loadBalancingStats = ref<any[]>([])
const showCreateModal = ref(false)
const editingServer = ref<SmtpServer | null>(null)

const loadServers = async () => {
  try {
    const response = await smtpService.getAdminSmtpServers()
    smtpServers.value = response.smtp_servers
    loadBalancingStats.value = response.load_balancing_stats
  } catch (error) {
    console.error('Error loading SMTP servers:', error)
  }
}

const editServer = (server: SmtpServer) => {
  editingServer.value = server
}

const deleteServer = async (server: SmtpServer) => {
  if (confirm(`Delete SMTP server "${server.name}"?`)) {
    try {
      await smtpService.deleteAdminSmtpServer(server.id)
      loadServers()
    } catch (error) {
      console.error('Error deleting server:', error)
    }
  }
}

const handleServerSaved = () => {
  closeModal()
  loadServers()
}

const closeModal = () => {
  showCreateModal.value = false
  editingServer.value = null
}

onMounted(loadServers)
</script>