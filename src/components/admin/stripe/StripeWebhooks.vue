<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Webhook Configuration</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage webhook endpoints for receiving Stripe events
        </p>
      </div>
      
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add Webhook
      </button>
    </div>

    <!-- Webhooks List -->
    <div class="space-y-4">
      <div v-if="loading && webhooks.length === 0" class="space-y-4">
        <!-- Loading skeleton -->
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
        </div>
      </div>

      <div v-else-if="webhooks.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Webhook class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Webhooks Configured</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Create your first webhook to receive real-time event notifications
        </p>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Webhook
        </button>
      </div>

      <div
        v-for="webhook in webhooks"
        :key="webhook.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ webhook.url }}</h3>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                webhook.status === 'enabled' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              ]">
                {{ webhook.status }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Events</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="event in webhook.events.slice(0, 3)"
                    :key="event"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {{ event }}
                  </span>
                  <span
                    v-if="webhook.events.length > 3"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    +{{ webhook.events.length - 3 }} more
                  </span>
                </div>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Last Delivery</p>
                <p class="text-sm text-gray-900 dark:text-white mt-1">
                  {{ webhook.last_delivery ? formatDate(webhook.last_delivery) : 'Never' }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="testWebhook(webhook)"
              :disabled="loading"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Test webhook"
            >
              <Zap class="w-4 h-4" />
            </button>
            
            <button
              @click="editWebhook(webhook)"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Edit webhook"
            >
              <Edit class="w-4 h-4" />
            </button>
            
            <button
              @click="deleteWebhook(webhook)"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete webhook"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingWebhook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingWebhook ? 'Edit Webhook' : 'Create Webhook' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endpoint URL <span class="text-red-500">*</span>
            </label>
            <input
              v-model="webhookForm.url"
              type="url"
              placeholder="https://your-domain.com/webhooks/stripe"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <!-- Events -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Events to Listen For
            </label>
            <div class="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
              <label class="flex items-center">
                <input
                  v-model="selectAllEvents"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  @change="toggleAllEvents"
                />
                <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Select All Events</span>
              </label>
              
              <div class="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div v-for="category in eventCategories" :key="category.name" class="mb-3">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ category.name }}</h4>
                  <div class="space-y-1">
                    <label v-for="event in category.events" :key="event" class="flex items-center">
                      <input
                        v-model="webhookForm.events"
                        :value="event"
                        type="checkbox"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ event }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="webhookForm.description"
              placeholder="Optional description for this webhook"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Saving...' : (editingWebhook ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Plus, Webhook, Zap, Edit, Trash2 } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

interface Props {
  webhooks: any[]
  loading?: boolean
}

interface Emits {
  (e: 'create', data: any): void
  (e: 'update', id: string, data: any): void
  (e: 'delete', id: string): void
  (e: 'test', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()
const toast = useToast()

// State
const showCreateModal = ref(false)
const editingWebhook = ref<any>(null)
const selectAllEvents = ref(false)

const webhookForm = reactive({
  url: '',
  events: [] as string[],
  description: ''
})

// Event categories for better organization
const eventCategories = [
  {
    name: 'Payment Events',
    events: [
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'payment_method.attached',
      'charge.succeeded',
      'charge.failed'
    ]
  },
  {
    name: 'Subscription Events',
    events: [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
      'invoice.payment_succeeded',
      'invoice.payment_failed'
    ]
  },
  {
    name: 'Customer Events',
    events: [
      'customer.created',
      'customer.updated',
      'customer.deleted',
      'customer.source.created',
      'customer.source.updated'
    ]
  },
  {
    name: 'Dispute Events',
    events: [
      'charge.dispute.created',
      'charge.dispute.updated',
      'charge.dispute.closed'
    ]
  }
]

const allEvents = computed(() => {
  return eventCategories.flatMap(category => category.events)
})

// Methods
const toggleAllEvents = () => {
  if (selectAllEvents.value) {
    webhookForm.events = [...allEvents.value]
  } else {
    webhookForm.events = []
  }
}

const handleSubmit = () => {
  if (editingWebhook.value) {
    emit('update', editingWebhook.value.id, { ...webhookForm })
  } else {
    emit('create', { ...webhookForm })
  }
  closeModal()
}

const editWebhook = (webhook: any) => {
  editingWebhook.value = webhook
  Object.assign(webhookForm, {
    url: webhook.url,
    events: [...webhook.events],
    description: webhook.description || ''
  })
  updateSelectAllState()
}

const deleteWebhook = (webhook: any) => {
  if (confirm(`Are you sure you want to delete the webhook for ${webhook.url}?`)) {
    emit('delete', webhook.id)
  }
}

const testWebhook = (webhook: any) => {
  emit('test', webhook.id)
}

const closeModal = () => {
  showCreateModal.value = false
  editingWebhook.value = null
  Object.assign(webhookForm, {
    url: '',
    events: [],
    description: ''
  })
  selectAllEvents.value = false
}

const updateSelectAllState = () => {
  selectAllEvents.value = webhookForm.events.length === allEvents.value.length
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Watch for events changes to update select all state
watch(() => webhookForm.events, () => {
  updateSelectAllState()
})
</script> 