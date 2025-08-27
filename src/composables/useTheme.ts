import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('system')
const isDark = ref(false)

export function useTheme() {
  // Initialize theme from localStorage
  const initTheme = () => {
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme) {
      theme.value = storedTheme
    }
    updateTheme()
  }

  // Check system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Update theme
  const updateTheme = () => {
    const root = document.documentElement
    
    if (theme.value === 'system') {
      isDark.value = getSystemTheme() === 'dark'
    } else {
      isDark.value = theme.value === 'dark'
    }

    if (isDark.value) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Set theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    updateTheme()
  }

  // Toggle theme
  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('light')
    } else {
      // If system, toggle to opposite of current system preference
      const systemTheme = getSystemTheme()
      setTheme(systemTheme === 'dark' ? 'light' : 'dark')
    }
  }

  // Watch for system theme changes
  watch(theme, () => {
    if (theme.value === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateTheme)
      
      return () => {
        mediaQuery.removeEventListener('change', updateTheme)
      }
    }
  })

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  }
}