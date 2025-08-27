<template>
  <div class="space-y-6">
    <!-- Global Settings Card -->
    <SettingsCard
      :title="$t('settings.admin.globalSettings')"
      :loading="loading"
    >
      <GlobalSettingsForm
        v-model="globalSettings"
        @submit="updateGlobalSettings"
      />
    </SettingsCard>

    <!-- Credit Packages Management -->
    <SettingsCard
      :title="$t('settings.admin.creditPackages')"
      :action-label="$t('settings.admin.addPackage')"
      @action="togglePackageForm"
    >
      <template #content>
        <!-- Add Package Form -->
        <CreditPackageForm
          v-if="showPackageForm"
          @submit="addCreditPackage"
          @cancel="togglePackageForm"
        />
        
        <!-- Packages Grid -->
        <CreditPackageGrid
          :packages="creditPackages"
          @remove="removeCreditPackage"
        />
      </template>
    </SettingsCard>

    <!-- System Statistics -->
    <SettingsCard :title="$t('settings.admin.systemStats')">
      <SystemStatsGrid :stats="systemStats" />
    </SettingsCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

// Composables
import { useAdminSettings } from '@/composables/settings/useAdminSettings'

// Components
import SettingsCard from '@/components/ui/SettingsCard.vue'
import GlobalSettingsForm from '@/components/settings/admin/GlobalSettingsForm.vue'
import CreditPackageForm from '@/components/settings/admin/CreditPackageForm.vue'
import CreditPackageGrid from '@/components/settings/admin/CreditPackageGrid.vue'
import SystemStatsGrid from '@/components/settings/admin/SystemStatsGrid.vue'

// Types
import type { AdminSettings, CreditPackage, SystemStats } from '@/types/admin'

const { t } = useI18n()
const toast = useToast()

// Composables
const {
  globalSettings,
  creditPackages,
  systemStats,
  loading,
  updateSettings,
  addPackage,
  removePackage,
  fetchStats
} = useAdminSettings()

// Local state
const showPackageForm = ref(false)

// Methods
const updateGlobalSettings = async (settings: AdminSettings) => {
  try {
    await updateSettings(settings)
    toast.success(t('settings.admin.updateSuccess'))
  } catch (error) {
    toast.error(t('settings.admin.updateError'))
  }
}

const addCreditPackage = async (packageData: Omit<CreditPackage, 'id'>) => {
  try {
    await addPackage(packageData)
    showPackageForm.value = false
    toast.success(t('settings.admin.packageAdded'))
  } catch (error) {
    toast.error(t('settings.admin.packageError'))
  }
}

const removeCreditPackage = async (packageId: number) => {
  try {
    await removePackage(packageId)
    toast.success(t('settings.admin.packageRemoved'))
  } catch (error) {
    toast.error(t('settings.admin.packageError'))
  }
}

const togglePackageForm = () => {
  showPackageForm.value = !showPackageForm.value
}

// Initialize
onMounted(async () => {
  await fetchStats()
})
</script>