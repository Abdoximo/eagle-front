import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'
import { validateEnvironment } from './utils/environment'

// Styles
import './assets/styles/main.css'
import 'vue-toastification/dist/index.css'

// Translations
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    es
  }
})

// Validate environment configuration
try {
  validateEnvironment()
} catch (error) {
  if (error instanceof Error) {
    console.error('Configuration Error:', error.message)
    // Only show alert in production
    if (import.meta.env.PROD) {
      alert(`Configuration Error: ${error.message}`)
      throw error
    }
  }
}

const app = createApp(App)

app.use(createPinia())

// Initialize auth store to restore authentication state
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.initAuth()

app.use(router)
app.use(i18n)

// Configure toast
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

app.use(Toast, toastOptions)

app.mount('#app')