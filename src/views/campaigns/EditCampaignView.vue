<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="handleBack"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ campaign?.name ? `Edit: ${campaign.name}` : 'Edit Campaign' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Step {{ currentStep + 1 }} of {{ steps.length }}: {{ currentStepData?.label }}
              </p>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div v-if="campaign" class="flex items-center space-x-3">
            <StatusBadge :status="campaign.status" size="sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              Progress
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ Math.round((currentStep / (steps.length - 1)) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!form.initialized && form.loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex items-center justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span class="text-lg text-gray-900 dark:text-white">Loading campaign...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div class="text-center">
          <AlertTriangle class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to Load Campaign</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
          <button
            @click="loadCampaignData"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Step Content -->
        <component 
          :is="currentStepComponent" 
          :model-value="form.data"
          @update:model-value="handleFormUpdate"
          @send-test="handleSendTest"
          :errors="form.errors"
          :loading="form.loading"
          :test-loading="testEmailLoading"
        />

        <!-- Navigation -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <!-- Left side - Back and Previous buttons -->
            <div class="flex items-center space-x-3">
              <button
                type="button"
                @click="handleBack"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <X class="w-4 h-4 mr-2" />
                Cancel
              </button>
              
              <button
                v-if="currentStep > 0"
                type="button"
                @click="previousStep"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft class="w-4 h-4 mr-2" />
                Previous
              </button>
            </div>

            <!-- Right side - Save, Next, and Submit buttons -->
            <div class="flex items-center space-x-3">
              <!-- Save Draft Button -->
              <button
                type="button"
                @click="handleSaveDraft"
                :disabled="form.loading || !canSaveDraft"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="form.loading && isDraftAction" class="flex items-center">
                  <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </span>
                <span v-else class="flex items-center">
                  <Save class="w-4 h-4 mr-2" />
                  Save Draft
                </span>
              </button>

              <!-- Next Button -->
              <button
                v-if="currentStep < steps.length - 1"
                type="button"
                @click="nextStep"
                :disabled="!canProceed"
                class="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight class="w-4 h-4 ml-2" />
              </button>

              <!-- Update Button (Final Step) -->
              <button
                v-else
                type="submit"
                :disabled="!canProceed || form.loading"
                class="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span v-if="form.loading && !isDraftAction" class="flex items-center">
                  <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </span>
                <span v-else class="flex items-center">
                  <Save class="w-4 h-4 mr-2" />
                  Update Campaign
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, ArrowRight, X, Save, Loader2, AlertTriangle, RefreshCw
} from 'lucide-vue-next'
import { useCampaignEditForm } from '@/composables/campaigns/useCampaignEditForm'
import { useCampaignSteps } from '@/composables/campaigns/useCampaignSteps'
import { useCampaignsStore } from '@/stores/campaigns'

// Components
import StatusBadge from '@/components/ui/StatusBadge.vue'
import CampaignBasicsStep from '@/components/campaigns/create/steps/CampaignBasicsStep.vue'
import TemplateSelectionStep from '@/components/campaigns/create/steps/TemplateSelectionStep.vue'
import ContentEditorStep from '@/components/campaigns/create/steps/ContentEditorStep.vue'
import ReviewStep from '@/components/campaigns/create/steps/ReviewStep.vue'

const route = useRoute()
const router = useRouter()

// Get campaign ID from route
const campaignId = computed(() => Number(route.params.id))

// Stores
const campaignsStore = useCampaignsStore()

// Composables
const { form, loadCampaign, updateCampaign, saveDraft, sendTestEmail } = useCampaignEditForm(campaignId.value)
const { currentStep, steps, nextStep, previousStep, canProceed } = useCampaignSteps(form)

// Local state
const error = ref('')
const isDraftAction = ref(false)
const testEmailLoading = ref(false)

// Step components mapping
const stepComponents = {
  0: CampaignBasicsStep,
  1: TemplateSelectionStep,
  2: ContentEditorStep,
  3: ReviewStep
}

// Computed
const currentStepComponent = computed(() => stepComponents[currentStep.value])
const campaign = computed(() => campaignsStore.currentCampaign)
const currentStepData = computed(() => steps[currentStep.value])

const canSaveDraft = computed(() => {
  return !!(form.data.name && form.data.name.trim())
})

// Methods
const loadCampaignData = async () => {
  try {
    error.value = ''
    await loadCampaign()
  } catch (err: any) {
    error.value = err.message || 'Failed to load campaign'
  }
}

const handleBack = () => {
  router.push(`/campaigns/${campaignId.value}`)
}

const handleFormUpdate = (newData: any) => {
  Object.assign(form.data, newData)
}

const handleSaveDraft = async () => {
  try {
    isDraftAction.value = true
    await saveDraft()
  } catch (error) {
    // Error handled by composable
  } finally {
    isDraftAction.value = false
  }
}

const handleSubmit = async () => {
  try {
    isDraftAction.value = false
    const updatedCampaign = await updateCampaign()
    router.push(`/campaigns/${updatedCampaign.id}`)
  } catch (error) {
    // Error handled by composable
  }
}

const handleSendTest = async (email: string) => {
  testEmailLoading.value = true
  try {
    await sendTestEmail(email)
  } catch (error) {
    // Error handled by composable
  } finally {
    testEmailLoading.value = false
  }
}

// Initialize
onMounted(async () => {
  await loadCampaignData()
})
</script>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Progress bar animation */
.bg-blue-600 {
  transition: width 0.3s ease-in-out;
}
</style> 