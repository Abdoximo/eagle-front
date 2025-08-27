import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { AdminSettings, CreditPackage, SystemStats } from '@/types/admin'

export function useAdminSettings() {
  const adminStore = useAdminStore()

  // Reactive state
  const globalSettings = computed({
    get: () => adminStore.settings,
    set: (value) => {
      // This will be handled by updateSettings method
    }
  })

  const creditPackages = computed(() => adminStore.settings?.credit_packages || [])

  const systemStats = computed((): SystemStats => {
    const dashboard = adminStore.dashboardData
    if (!dashboard) {
      return {
        users: { total: 0, active: 0, new_today: 0, new_this_week: 0 },
        campaigns: { total: 0, sent: 0, pending: 0, draft: 0 },
        emails: { sent_today: 0, sent_this_week: 0, sent_this_month: 0, total_sent: 0 },
        revenue: { today: 0, this_week: 0, this_month: 0, total: 0 },
        smtp: { total_servers: 0, active_servers: 0, usage_today: 0 }
      }
    }

    return {
      users: {
        total: dashboard.stats.total_users,
        active: dashboard.stats.active_users,
        new_today: 0, // Would need additional API endpoint
        new_this_week: 0 // Would need additional API endpoint
      },
      campaigns: {
        total: dashboard.stats.total_campaigns,
        sent: 0, // Would need additional data
        pending: 0, // Would need additional data
        draft: 0 // Would need additional data
      },
      emails: {
        sent_today: 0, // Would need additional data
        sent_this_week: 0, // Would need additional data
        sent_this_month: dashboard.stats.emails_sent_this_month,
        total_sent: dashboard.stats.total_emails_sent
      },
      revenue: {
        today: 0, // Would need additional data
        this_week: 0, // Would need additional data
        this_month: dashboard.stats.revenue_this_month,
        total: dashboard.stats.total_revenue
      },
      smtp: {
        total_servers: adminStore.smtpServers.length,
        active_servers: dashboard.stats.active_smtp_servers,
        usage_today: 0 // Would need additional data
      }
    }
  })

  const loading = computed(() => adminStore.loading)

  // Methods
  const updateSettings = async (settings: AdminSettings) => {
    await adminStore.updateSettings(settings)
    await adminStore.fetchSettings() // Refresh settings
  }

  const addPackage = async (packageData: Omit<CreditPackage, 'id' | 'created_at' | 'updated_at'>) => {
    // This would need a specific API endpoint for adding credit packages
    // For now, we'll update the settings with the new package
    const currentSettings = adminStore.settings
    if (currentSettings) {
      const newPackage: CreditPackage = {
        ...packageData,
        id: Date.now(), // Temporary ID generation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const updatedPackages = [...(currentSettings.credit_packages || []), newPackage]
      await adminStore.updateSettings({
        ...currentSettings,
        credit_packages: updatedPackages
      })
    }
  }

  const removePackage = async (packageId: number) => {
    const currentSettings = adminStore.settings
    if (currentSettings) {
      const updatedPackages = (currentSettings.credit_packages || []).filter(
        pkg => pkg.id !== packageId
      )
      await adminStore.updateSettings({
        ...currentSettings,
        credit_packages: updatedPackages
      })
    }
  }

  const fetchStats = async () => {
    await Promise.all([
      adminStore.fetchDashboard(),
      adminStore.fetchSettings(),
      adminStore.fetchAdminSmtpServers()
    ])
  }

  return {
    globalSettings,
    creditPackages,
    systemStats,
    loading,
    updateSettings,
    addPackage,
    removePackage,
    fetchStats
  }
} 