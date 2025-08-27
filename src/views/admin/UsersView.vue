<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
  <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.users.title') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ $t('admin.users.description') }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <Button
          variant="outline"
          @click="exportUsers"
          :loading="exporting"
          class="flex items-center"
        >
          <Download class="w-4 h-4 mr-2" />
          {{ $t('common.export') }}
        </Button>
        <Button
          @click="showCreateDialog = true"
          class="flex items-center"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ $t('admin.users.create') }}
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <Users class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.users.totalUsers') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ totalUsers }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <UserCheck class="h-8 w-8 text-green-600 dark:text-green-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.users.activeUsers') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ activeUsers }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <UserPlus class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.users.newToday') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ newUsersToday }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <UserX class="h-8 w-8 text-red-600 dark:text-red-400" />
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.users.disabledUsers') }}
            </p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ disabledUsers }}
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
            :placeholder="$t('admin.users.searchPlaceholder')"
            @search="handleSearch"
          />
        </div>
        
        <div class="flex items-center space-x-3">
          <SelectField
            v-model="filters.role"
            :options="roleOptions"
            :placeholder="$t('admin.users.filterByRole')"
            class="w-40"
          />
          
          <SelectField
            v-model="filters.status"
            :options="statusOptions"
            :placeholder="$t('admin.users.filterByStatus')"
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

    <!-- Users Table -->
    <Card>
      <div v-if="loading" class="p-6">
        <SkeletonLoader :rows="5" />
      </div>
      
      <div v-else-if="paginatedUsers.length === 0" class="text-center py-12">
        <Users class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('admin.users.noUsers') }}
        </p>
      </div>
      
      <div v-else>
        <div class="min-w-full overflow-x-auto">
          <table class="w-full relative" style="z-index: 1;">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Checkbox
                    v-model="selectAll"
                    @change="handleSelectAll"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.name') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.email') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.role') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.credits') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.joined') }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.users.list.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    v-model="selectedUsers"
                    :value="user.id"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <Avatar
                        :name="user.name"
                        :src="user.avatar"
                        size="md"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ user.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ user.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    :variant="getRoleVariant(user.role)"
                  >
                    {{ $t(`admin.users.roles.${user.role}`) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    :variant="getStatusVariant(user.status)"
                  >
                    {{ $t(`admin.users.status.${user.status}`) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ user.credits?.toLocaleString() || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <div class="relative inline-block text-left">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      @click="toggleActionMenu(user.id)"
                      :ref="`actionButton-${user.id}`"
                    >
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                    
                    <!-- Custom Dropdown Menu -->
                    <div
                      v-if="activeActionMenu === user.id"
                      class="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[99999] py-1"
                      style="z-index: 99999;"
                    >
                      <button
                        @click="viewUser(user); closeActionMenu()"
                        class="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye class="h-4 w-4 mr-2" />
                        {{ $t('common.view') }}
                      </button>
                      <button
                        @click="editUser(user); closeActionMenu()"
                        class="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit class="h-4 w-4 mr-2" />
                        {{ $t('common.edit') }}
                      </button>
                      <button
                        @click="addCredits(user); closeActionMenu()"
                        class="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <CreditCard class="h-4 w-4 mr-2" />
                        {{ $t('admin.users.add_credits') }}
                      </button>
                      <hr class="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        v-if="user.status === 'active'"
                        @click="disableUser(user); closeActionMenu()"
                        class="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <UserX class="h-4 w-4 mr-2" />
                        {{ $t('admin.users.disable') }}
                      </button>
                      <button
                        v-else
                        @click="enableUser(user); closeActionMenu()"
                        class="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <UserCheck class="h-4 w-4 mr-2" />
                        {{ $t('admin.users.enable') }}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          v-model:page="currentPage"
          :total="filteredUsers.length"
          :per-page="perPage"
          :show-size-changer="true"
          @update:per-page="perPage = $event"
        />
      </div>
    </Card>

    <!-- Bulk Actions -->
    <div
      v-if="selectedUsers.length > 0"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
    >
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('admin.users.selectedCount', { count: selectedUsers.length }) }}
        </span>
        
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction('enable')"
          >
            {{ $t('admin.users.bulkEnable') }}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            @click="bulkAction('disable')"
          >
            {{ $t('admin.users.bulkDisable') }}
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
          @click="selectedUsers = []"
        >
          {{ $t('common.cancel') }}
        </Button>
      </div>
    </div>

    <!-- Dialogs -->
    <UserCreateDialog
      v-model="showCreateDialog"
      @created="handleUserCreated"
    />
    
    <UserEditDialog
      v-model="showEditDialog"
      :user="selectedUser"
      @updated="handleUserUpdated"
    />
    
    <UserViewDialog
      v-model="showViewDialog"
      :user="selectedUser"
      @edit="handleEditFromView"
    />
    
    <AddCreditsDialog
      v-model="showCreditsDialog"
      :user="selectedUser"
      @added="handleCreditsAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Plus,
  Download,
  Eye,
  Edit,
  CreditCard,
  MoreHorizontal
} from 'lucide-vue-next'

// Components
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import SearchField from '@/components/ui/SearchField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'
import DropdownSeparator from '@/components/ui/DropdownSeparator.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

// Dialogs
import UserCreateDialog from '@/components/admin/users/UserCreateDialog.vue'
import UserEditDialog from '@/components/admin/users/UserEditDialog.vue'
import UserViewDialog from '@/components/admin/users/UserViewDialog.vue'
import AddCreditsDialog from '@/components/admin/users/AddCreditsDialog.vue'

// Stores
import { useAdminStore } from '@/stores/admin'
import { useNotificationStore } from '@/stores/notifications'

// Types
import type { UserWithStats } from '@/types/admin'

const { t } = useI18n()
const adminStore = useAdminStore()
const notificationStore = useNotificationStore()

// Reactive data
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(25)
const selectedUsers = ref<number[]>([])
const selectAll = ref(false)
const exporting = ref(false)

const filters = ref({
  role: '',
  status: ''
})

// Dialogs
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showCreditsDialog = ref(false)
const selectedUser = ref<UserWithStats | null>(null)

// Custom action menu
const activeActionMenu = ref<number | null>(null)

// Computed
const loading = computed(() => adminStore.loading)
const users = computed(() => adminStore.users || [])

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
const newUsersToday = computed(() => {
  const today = new Date().toDateString()
  return users.value.filter(u => new Date(u.created_at).toDateString() === today).length
})
const disabledUsers = computed(() => users.value.filter(u => u.status === 'disabled').length)

const roleOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'user', label: t('admin.users.roles.user') },
  { value: 'admin', label: t('admin.users.roles.admin') },
  { value: 'marketer', label: t('admin.users.roles.marketer') }
])

const statusOptions = computed(() => [
  { value: '', label: t('common.all') },
  { value: 'active', label: t('admin.users.status.active') },
  { value: 'disabled', label: t('admin.users.status.disabled') }
])

const hasActiveFilters = computed(() => {
  return filters.value.role || filters.value.status || searchQuery.value
})

const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (filters.value.role) {
    result = result.filter(user => user.role === filters.value.role)
  }

  if (filters.value.status) {
    result = result.filter(user => user.status === filters.value.status)
  }

  return result
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredUsers.value.slice(start, end)
})

// Methods
const handleSearch = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  filters.value = { role: '', status: '' }
  currentPage.value = 1
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = paginatedUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

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

const viewUser = (user: UserWithStats) => {
  console.log('Viewing user:', user)
  selectedUser.value = user
  showViewDialog.value = true
}

const editUser = (user: UserWithStats) => {
  console.log('Editing user:', user)
  selectedUser.value = user
  showEditDialog.value = true
}

const addCredits = (user: UserWithStats) => {
  console.log('Adding credits to user:', user)
  selectedUser.value = user
  showCreditsDialog.value = true
}

const disableUser = async (user: UserWithStats) => {
  if (confirm(t('admin.users.confirmDisable', { name: user.name }))) {
    try {
      console.log('Disabling user:', user.id)
      await adminStore.disableUser(user.id)
      console.log('User disabled successfully')
      // Refresh the users list to get updated data
      await adminStore.fetchUsers()
      notificationStore.success(t('admin.users.userDisabled'))
    } catch (error) {
      console.error('Error disabling user:', error)
      notificationStore.error(t('admin.users.disableError'))
    }
  }
}

const enableUser = async (user: UserWithStats) => {
  try {
    console.log('Enabling user:', user.id)
    await adminStore.enableUser(user.id)
    console.log('User enabled successfully')
    // Refresh the users list to get updated data
    await adminStore.fetchUsers()
    notificationStore.success(t('admin.users.userEnabled'))
  } catch (error) {
    console.error('Error enabling user:', error)
    notificationStore.error(t('admin.users.enableError'))
  }
}

const bulkAction = async (action: string) => {
  const count = selectedUsers.value.length
  const confirmMessage = t(`admin.users.confirm${action.charAt(0).toUpperCase() + action.slice(1)}`, { count })
  
  if (confirm(confirmMessage)) {
    try {
      await adminStore.bulkUserAction(action, selectedUsers.value)
      notificationStore.success(t('admin.users.bulkActionSuccess'))
      selectedUsers.value = []
    } catch (error) {
      notificationStore.error(t('admin.users.bulkActionError'))
    }
  }
}

const exportUsers = async () => {
  exporting.value = true
  try {
    await adminStore.exportUsers()
    notificationStore.success(t('admin.users.exportSuccess'))
  } catch (error) {
    notificationStore.error(t('admin.users.exportError'))
  } finally {
    exporting.value = false
  }
}

const handleUserCreated = () => {
  adminStore.fetchUsers()
  notificationStore.success(t('admin.users.userCreated'))
}

const handleUserUpdated = () => {
  adminStore.fetchUsers()
  notificationStore.success(t('admin.users.userUpdated'))
}

const handleCreditsAdded = () => {
  adminStore.fetchUsers()
  notificationStore.success(t('admin.users.creditsAdded'))
}

const handleEditFromView = (user: UserWithStats) => {
  console.log('Editing user from view dialog:', user)
  showViewDialog.value = false
  selectedUser.value = user
  showEditDialog.value = true
}

const toggleActionMenu = (userId: number) => {
  activeActionMenu.value = activeActionMenu.value === userId ? null : userId
}

const closeActionMenu = () => {
  activeActionMenu.value = null
}

// Click outside to close menu
const handleClickOutside = (event: MouseEvent) => {
  if (activeActionMenu.value && !(event.target as Element).closest('.relative.inline-block')) {
    closeActionMenu()
  }
}

// Lifecycle
onMounted(() => {
  adminStore.fetchUsers()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watchers
watch(selectedUsers, () => {
  selectAll.value = selectedUsers.value.length === paginatedUsers.value.length && paginatedUsers.value.length > 0
})
</script>

<style scoped>
/* Table container */
.min-w-full {
  position: relative;
  overflow: visible;
}

.overflow-x-auto {
  overflow-y: visible !important;
  position: relative;
}

/* Ensure table doesn't create stacking context issues */
table {
  position: relative;
  z-index: 1;
}

/* Custom dropdown menu */
.absolute.z-\[99999\] {
  z-index: 99999 !important;
}

/* Remove any overflow constraints */
tbody,
tr,
td {
  overflow: visible !important;
}
</style> 