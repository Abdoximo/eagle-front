<template>
  <div class="space-y-6">
    <!-- Profile Information Card -->
    <SettingsCard 
      :title="$t('settings.profile.title')"
      :subtitle="$t('settings.profile.subtitle')"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Avatar Section -->
        <div class="flex items-center space-x-6">
          <div class="shrink-0">
            <img
              :src="avatarUrl || defaultAvatar"
              :alt="$t('settings.profile.avatar')"
              class="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
              @error="handleAvatarError"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <SubmitButton
                type="button"
                variant="secondary"
                size="sm"
                :loading="avatarUploading"
                @click="triggerFileInput"
              >
                <Camera class="w-4 h-4 mr-2" />
                {{ $t('settings.profile.changeAvatar') }}
              </SubmitButton>
              <button
                v-if="avatarUrl"
                type="button"
                @click="removeAvatar"
                class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                {{ $t('settings.profile.removeAvatar') }}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ $t('settings.profile.avatarHelp') }}
            </p>
            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            />
          </div>
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            v-model="form.firstName"
            :label="$t('settings.profile.firstName')"
            :placeholder="$t('settings.profile.firstNamePlaceholder')"
            type="text"
            required
            :error="errors.firstName"
            :disabled="loading"
          />
          
          <FormField
            v-model="form.lastName"
            :label="$t('settings.profile.lastName')"
            :placeholder="$t('settings.profile.lastNamePlaceholder')"
            type="text"
            :error="errors.lastName"
            :disabled="loading"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            v-model="form.email"
            :label="$t('settings.profile.email')"
            :placeholder="$t('settings.profile.emailPlaceholder')"
            type="email"
            required
            :error="errors.email"
            :disabled="loading"
            :help-text="emailVerified ? $t('settings.profile.emailVerified') : $t('settings.profile.emailNotVerified')"
          />
          
          <FormField
            v-model="form.phone"
            :label="$t('settings.profile.phone')"
            :placeholder="$t('settings.profile.phonePlaceholder')"
            type="tel"
            :error="errors.phone"
            :disabled="loading"
          />
        </div>

        <!-- Company Information -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('settings.profile.companyInfo') }}
          </h4>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              v-model="form.company"
              :label="$t('settings.profile.company')"
              :placeholder="$t('settings.profile.companyPlaceholder')"
              type="text"
              :error="errors.company"
              :disabled="loading"
            />
            
            <FormField
              v-model="form.jobTitle"
              :label="$t('settings.profile.jobTitle')"
              :placeholder="$t('settings.profile.jobTitlePlaceholder')"
              type="text"
              :error="errors.jobTitle"
              :disabled="loading"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            <SelectField
              v-model="form.industry"
              :label="$t('settings.profile.industry')"
              :placeholder="$t('settings.profile.industryPlaceholder')"
              :options="industryOptions"
              :error="errors.industry"
              :disabled="loading"
            />
            
            <FormField
              v-model="form.website"
              :label="$t('settings.profile.website')"
              :placeholder="$t('settings.profile.websitePlaceholder')"
              type="url"
              :error="errors.website"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Location & Preferences -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {{ $t('settings.profile.locationPreferences') }}
          </h4>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField
              v-model="form.country"
              :label="$t('settings.profile.country')"
              :placeholder="$t('settings.profile.countryPlaceholder')"
              :options="countryOptions"
              :error="errors.country"
              :disabled="loading"
              @update:model-value="handleCountryChange"
            />
            
            <SelectField
              v-model="form.timezone"
              :label="$t('settings.profile.timezone')"
              :placeholder="$t('settings.profile.timezonePlaceholder')"
              :options="timezoneOptions"
              :error="errors.timezone"
              :disabled="loading"
            />
            
            <SelectField
              v-model="form.language"
              :label="$t('settings.profile.language')"
              :placeholder="$t('settings.profile.languagePlaceholder')"
              :options="languageOptions"
              :error="errors.language"
              :disabled="loading"
              @update:model-value="handleLanguageChange"
            />
          </div>
        </div>

        <!-- Bio/Description -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('settings.profile.bio') }}
            </label>
            <textarea
              v-model="form.bio"
              :placeholder="$t('settings.profile.bioPlaceholder')"
              rows="4"
              :disabled="loading"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              :class="{ 'border-red-300 dark:border-red-600': errors.bio }"
              :maxlength="500"
              @input="updateCharCount"
            />
            <div class="mt-1 flex justify-between items-center">
              <p v-if="errors.bio" class="text-xs text-red-600 dark:text-red-400">
                {{ errors.bio }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                {{ form.bio?.length || 0 }}/500
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-4">
            <SubmitButton
              type="submit"
              :loading="loading"
              :disabled="!isFormValid || !hasChanges"
            >
              <Save class="w-4 h-4 mr-2" />
              {{ $t('common.saveChanges') }}
            </SubmitButton>
            
            <SubmitButton
              type="button"
              variant="secondary"
              :disabled="loading || !hasChanges"
              @click="resetForm"
            >
              <RotateCcw class="w-4 h-4 mr-2" />
              {{ $t('common.reset') }}
            </SubmitButton>
          </div>

          <!-- Last Updated Info -->
          <div v-if="lastUpdated" class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.profile.lastUpdated') }}: {{ formatDate(lastUpdated) }}
          </div>
        </div>
      </form>
    </SettingsCard>

    <!-- Account Statistics Card -->
    <SettingsCard 
      :title="$t('settings.profile.accountStats')"
      :subtitle="$t('settings.profile.accountStatsSubtitle')"
    >
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ accountStats.memberSince }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('settings.profile.memberSince') }}
          </div>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ accountStats.campaignsSent }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('settings.profile.campaignsSent') }}
          </div>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ accountStats.totalContacts }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('settings.profile.totalContacts') }}
          </div>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ accountStats.creditsUsed }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('settings.profile.creditsUsed') }}
          </div>
        </div>
      </div>
    </SettingsCard>

    <!-- Security Info Card -->
    <SettingsCard 
      :title="$t('settings.profile.securityInfo')"
      :subtitle="$t('settings.profile.securityInfoSubtitle')"
    >
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <Shield class="h-5 w-5 text-green-500 mr-3" />
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ $t('settings.profile.twoFactorAuth') }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ twoFactorEnabled ? $t('settings.profile.twoFactorEnabled') : $t('settings.profile.twoFactorDisabled') }}
              </div>
            </div>
          </div>
          <SubmitButton
            variant="outline"
            size="sm"
            @click="toggleTwoFactor"
          >
            {{ twoFactorEnabled ? $t('common.disable') : $t('common.enable') }}
          </SubmitButton>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <Key class="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ $t('settings.profile.password') }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ $t('settings.profile.passwordLastChanged') }}: {{ formatDate(passwordLastChanged) }}
              </div>
            </div>
          </div>
          <SubmitButton
            variant="outline"
            size="sm"
            @click="$emit('changePassword')"
          >
            {{ $t('settings.profile.changePassword') }}
          </SubmitButton>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <Calendar class="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ $t('settings.profile.lastLogin') }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(lastLogin) }} {{ $t('settings.profile.from') }} {{ lastLoginLocation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { 
  Camera, 
  Save, 
  RotateCcw, 
  Shield, 
  Key, 
  Calendar 
} from 'lucide-vue-next'

// Composables
import { useProfileForm } from '@/composables/settings/useProfileForm'
import { useFileUpload } from '@/composables/useFileUpload'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useAuthStore } from '@/stores/auth'

// Components
import SettingsCard from '@/components/ui/SettingsCard.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import SubmitButton from '@/components/ui/SubmitButton.vue'

// Types
import type { ProfileFormData } from '@/types/settings'

interface Emits {
  (e: 'changePassword'): void
}

const emit = defineEmits<Emits>()

const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const { formatDate } = useDateFormatter()

// Composables
const { 
  loading, 
  errors, 
  updateProfile, 
  initializeForm,
  validateForm 
} = useProfileForm()

const { 
  uploadFile, 
  loading: avatarUploading 
} = useFileUpload()

// Refs
const fileInput = ref<HTMLInputElement>()

// Form data
const form = reactive<ProfileFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  industry: '',
  website: '',
  country: '',
  timezone: '',
  language: 'en',
  bio: ''
})

// Original form data for change detection
const originalForm = ref<ProfileFormData>({} as ProfileFormData)

// Additional data
const avatarUrl = ref<string>('')
const emailVerified = ref(true)
const twoFactorEnabled = ref(false)
const lastUpdated = ref<string>('')
const lastLogin = ref<string>('')
const lastLoginLocation = ref<string>('')
const passwordLastChanged = ref<string>('')

// Account statistics
const accountStats = reactive({
  memberSince: '2024',
  campaignsSent: 0,
  totalContacts: 0,
  creditsUsed: 0
})

// Default avatar
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=3B82F6&color=ffffff&size=128'

// Options
const industryOptions = [
  { value: 'technology', label: t('industries.technology') },
  { value: 'healthcare', label: t('industries.healthcare') },
  { value: 'finance', label: t('industries.finance') },
  { value: 'education', label: t('industries.education') },
  { value: 'retail', label: t('industries.retail') },
  { value: 'other', label: t('industries.other') }
]

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }
]

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'UTC', label: 'UTC' }
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' }
]

// Computed
const isFormValid = computed(() => {
  return form.firstName && form.email && validateForm(form)
})

const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalForm.value)
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    await updateProfile(form)
    
    // Update original form data
    originalForm.value = { ...form }
    lastUpdated.value = new Date().toISOString()
    
    toast.success(t('settings.profile.updateSuccess'))
  } catch (error: any) {
    toast.error(error.message || t('settings.profile.updateError'))
  }
}

const resetForm = () => {
  Object.assign(form, originalForm.value)
}

const handleLanguageChange = (newLanguage: string) => {
  locale.value = newLanguage
}

const handleCountryChange = (country: string) => {
  // Auto-update timezone based on country
  const timezoneMap = {
    'US': 'America/New_York',
    'FR': 'Europe/Paris',
    'DE': 'Europe/Berlin',
    'UK': 'Europe/London',
    'CA': 'America/Toronto',
    'AU': 'Australia/Sydney'
  }
  
  if (timezoneMap[country as keyof typeof timezoneMap]) {
    form.timezone = timezoneMap[country as keyof typeof timezoneMap]
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    toast.error(t('settings.profile.invalidFileType'))
    return
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB
    toast.error(t('settings.profile.fileTooLarge'))
    return
  }

  try {
    const uploadedUrl = await uploadFile(file, 'avatars')
    avatarUrl.value = uploadedUrl
    toast.success(t('settings.profile.avatarUpdated'))
  } catch (error: any) {
    toast.error(error.message || t('settings.profile.avatarError'))
  }
}

const removeAvatar = () => {
  avatarUrl.value = ''
  toast.success(t('settings.profile.avatarRemoved'))
}

const handleAvatarError = () => {
  avatarUrl.value = defaultAvatar
}

const toggleTwoFactor = () => {
  // This would typically open a 2FA setup modal
  twoFactorEnabled.value = !twoFactorEnabled.value
  toast.success(
    twoFactorEnabled.value 
      ? t('settings.profile.twoFactorEnabled')
      : t('settings.profile.twoFactorDisabled')
  )
}

const updateCharCount = () => {
  // Character count is automatically updated by v-model
}

// Initialize component
onMounted(async () => {
  // Initialize form with user data
  const initialData = await initializeForm()
  Object.assign(form, initialData)
  originalForm.value = { ...form }

  // Load user avatar and additional data
  if (authStore.user) {
    avatarUrl.value = authStore.user.avatar || ''
    emailVerified.value = !!authStore.user.email_verified_at
    lastLogin.value = authStore.user.last_login_at || ''
    lastLoginLocation.value = authStore.user.last_login_location || 'Unknown'
    
    // Load account stats (this would come from an API)
    accountStats.memberSince = new Date(authStore.user.created_at).getFullYear().toString()
    accountStats.campaignsSent = authStore.user.campaigns_count || 0
    accountStats.totalContacts = authStore.user.contacts_count || 0
    accountStats.creditsUsed = (authStore.user.credits_purchased || 0) - (authStore.user.credits || 0)
  }
})

// Watch for form changes to show unsaved changes warning
const hasUnsavedChanges = computed(() => hasChanges.value)

// Warn user about unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})
</script>

<style scoped>
/* Custom styles for better UX */
.resize-none {
  resize: none;
}

/* Smooth transitions for form elements */
input, select, textarea {
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Avatar hover effect */
img {
  transition: opacity 0.2s ease-in-out;
}

img:hover {
  opacity: 0.8;
}

/* Form validation styles */
.border-red-300:focus {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Stats card hover effect */
.bg-gray-50:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}

.dark .bg-gray-700:hover {
  background-color: #4b5563;
}
</style>