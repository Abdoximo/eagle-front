<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <CampaignHeader 
      :current-step="currentStep" 
      :steps="steps"
      @back="handleBack"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Step Content -->
        <component 
          :is="currentStepComponent" 
          :model-value="form.data"
          @update:model-value="handleFormUpdate"
          @send-test="handleSendTest"
          :errors="form.errors"
          :loading="form.loading.value"
          :test-loading="testEmailLoading"
        />

        <!-- Navigation -->
        <CampaignFormNavigation
          :current-step="currentStep"
          :total-steps="steps.length"
          :can-proceed="canProceed"
          :loading="form.loading.value"
          @back="handleBack"
          @previous="previousStep"
          @next="nextStep"
          @save-draft="saveDraft"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignForm } from '@/composables/campaigns/useCampaignForm'
import { useCampaignSteps } from '@/composables/campaigns/useCampaignSteps'

// Components
import CampaignHeader from '@/components/campaigns/create/CampaignHeader.vue'
import CampaignFormNavigation from '@/components/campaigns/create/CampaignFormNavigation.vue'
import CampaignBasicsStep from '@/components/campaigns/create/steps/CampaignBasicsStep.vue'
import TemplateSelectionStep from '@/components/campaigns/create/steps/TemplateSelectionStep.vue'
import ContentEditorStep from '@/components/campaigns/create/steps/ContentEditorStep.vue'
import ReviewStep from '@/components/campaigns/create/steps/ReviewStep.vue'

const router = useRouter()

// Composables
const { form, saveDraft, createCampaign, sendTestEmail } = useCampaignForm()
const { currentStep, steps, nextStep, previousStep, canProceed } = useCampaignSteps(form)

// Local state
const testEmailLoading = ref(false)

// Step components mapping
const stepComponents = {
  0: CampaignBasicsStep,
  1: TemplateSelectionStep,
  2: ContentEditorStep,
  3: ReviewStep
}

const currentStepComponent = computed(() => stepComponents[currentStep.value])

// Methods
const handleBack = () => {
  router.back()
}

const handleFormUpdate = (newData: any) => {
  Object.assign(form.data, newData)
}

const handleSubmit = async () => {
  try {
    const campaign = await createCampaign()
    router.push(`/campaigns/${campaign.id}`)
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
  // Initialize required data
})
</script>