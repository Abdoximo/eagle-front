import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useNotifications } from '@/composables/useNotifications'

export const useUIStore = defineStore('ui', () => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme()
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll } = useNotifications()

  // State
  const sidebarCollapsed = ref(false)
  const mobileMenuOpen = ref(false)
  const language = ref(localStorage.getItem('language') || 'en')
  const loading = ref(false)
  const globalLoading = ref(false)
  const breadcrumbs = ref<Array<{ label: string; to?: string }>>([])

  // Getters
  const isMobile = computed(() => window.innerWidth < 768)
  const isTablet = computed(() => window.innerWidth >= 768 && window.innerWidth < 1024)
  const isDesktop = computed(() => window.innerWidth >= 1024)

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed.value.toString())
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false
  }

  const setLanguage = (lang: string) => {
    language.value = lang
    localStorage.setItem('language', lang)
    // Reload page to apply language change
    window.location.reload()
  }

  const setBreadcrumbs = (items: Array<{ label: string; to?: string }>) => {
    breadcrumbs.value = items
  }

  const setGlobalLoading = (value: boolean) => {
    globalLoading.value = value
  }

  const initUI = () => {
    // Initialize sidebar state
    const savedSidebarState = localStorage.getItem('sidebar_collapsed')
    if (savedSidebarState !== null) {
      sidebarCollapsed.value = savedSidebarState === 'true'
    }

    // Initialize theme
    theme.value = (localStorage.getItem('theme') as any) || 'system'

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        mobileMenuOpen.value = false
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {
    // State
    sidebarCollapsed,
    mobileMenuOpen,
    language,
    loading,
    globalLoading,
    breadcrumbs,
    
    // Theme
    theme,
    isDark,
    
    // Notifications
    notifications,
    unreadCount,
    
    // Getters
    isMobile,
    isTablet,
    isDesktop,
    
    // Actions
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setLanguage,
    setBreadcrumbs,
    setGlobalLoading,
    initUI,
    
    // Theme actions
    setTheme,
    toggleTheme,
    
    // Notification actions
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  }
})