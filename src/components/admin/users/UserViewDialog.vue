<template>
  <Modal 
    v-model="isOpen"
    :title="$t('admin.users.user_details')"
    size="lg"
    @close="handleClose"
  >
    <div class="space-y-6" v-if="user">
      <!-- User Header -->
      <div class="flex items-center space-x-4">
        <Avatar
          :name="user.name"
          :src="user.avatar"
          size="xl"
        />
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ user.name }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">{{ user.email }}</p>
          <div class="flex items-center space-x-3 mt-2">
            <Badge :variant="getRoleVariant(user.role)">
              {{ $t(`admin.users.roles.${user.role}`) }}
            </Badge>
            <Badge :variant="getStatusVariant(user.status)">
              {{ $t(`admin.users.status.${user.status}`) }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- User Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Account Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('admin.users.view.accountInfo') }}
          </h3>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.userId') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                #{{ user.id }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.credits') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.credits?.toLocaleString() || 0 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.joinedDate') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatDate(user.created_at) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.lastLogin') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.last_login ? formatDate(user.last_login) : $t('common.never') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Activity Statistics -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('admin.users.view.activityStats') }}
          </h3>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.totalCampaigns') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.campaigns_count || 0 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.emailsSent') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.emails_sent?.toLocaleString() || 0 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.contactLists') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.contact_lists_count || 0 }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admin.users.view.templates') }}
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.templates_count || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="space-y-4" v-if="user.recent_activity?.length">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ $t('admin.users.view.recentActivity') }}
        </h3>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div class="space-y-3">
            <div
              v-for="activity in user.recent_activity"
              :key="activity.id"
              class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(activity.created_at) }}
                </p>
              </div>
              <Badge variant="outline" size="sm">
                {{ activity.type }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Actions -->
    <template #footer>
      <div class="flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="handleClose"
        >
          {{ $t('common.close') }}
        </Button>
        <Button
          variant="outline"
          @click="$emit('edit', user)"
        >
          <Edit class="h-4 w-4 mr-2" />
          {{ $t('common.edit') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Edit } from 'lucide-vue-next'

// Components
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'

// Types
import type { UserWithStats } from '@/types/admin'

interface Props {
  modelValue: boolean
  user?: UserWithStats | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit', user: UserWithStats): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const getRoleVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive'
    case 'marketer': return 'warning'
    default: return 'default'
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'disabled': return 'destructive'
    default: return 'default'
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script> 