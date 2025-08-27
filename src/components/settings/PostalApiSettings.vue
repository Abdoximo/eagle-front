<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Postal API Servers</h2>
        <p class="text-gray-600">Manage your Postal API email delivery servers</p>
      </div>
      
      <button
        @click="showAddModal = true"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Server
      </button>
    </div>

    <!-- Servers List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="server in servers" :key="server.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">{{ server.name }}</h3>
              <p class="text-sm text-gray-500">{{ server.domain }}</p>
              <p class="text-sm text-gray-400">From: {{ server.from_email }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="editServer(server)"
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                @click="deleteServer(server)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-if="servers.length === 0" class="text-center py-12">
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Postal API servers</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating your first Postal API server.
        </p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Server
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingServer ? 'Edit Server' : 'Add New Server' }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Server Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Postal Server"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Postal Domain *</label>
              <input
                v-model="form.domain"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="mail.yourdomain.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">API Key *</label>
              <input
                v-model="form.api_key"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Postal API key"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">From Email *</label>
              <input
                v-model="form.from_email"
                type="email"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="noreply@yourdomain.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">From Name</label>
              <input
                v-model="form.from_name"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Company Name"
              />
            </div>

            <div class="flex items-center space-x-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {{ editingServer ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showAddModal = ref(false)
const editingServer = ref<any>(null)
const servers = ref<any[]>([])

const form = ref({
  name: '',
  domain: '',
  api_key: '',
  from_email: '',
  from_name: ''
})

onMounted(() => {
  loadServers()
})

const loadServers = async () => {
  try {
    // Mock data for now
    servers.value = []
  } catch (error) {
    // Error handling for server loading
  }
}

const handleSubmit = async () => {
  try {
    if (editingServer.value) {
      // Update existing server
    } else {
      // Create new server
    }
    
    closeModal()
    loadServers()
  } catch (error) {
    // Error handling for server save
  }
}

const editServer = (server: any) => {
  editingServer.value = server
  form.value = { ...server }
  showAddModal.value = true
}

const deleteServer = async (server: any) => {
  if (!confirm(`Are you sure you want to delete "${server.name}"?`)) {
    return
  }
  
  try {
    loadServers()
  } catch (error) {
    // Error handling for server deletion
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingServer.value = null
  form.value = {
    name: '',
    domain: '',
    api_key: '',
    from_email: '',
    from_name: ''
  }
}
</script>
