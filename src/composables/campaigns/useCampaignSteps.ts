import { ref, computed } from 'vue'

interface Step {
  key: string
  label: string
  description: string
  icon: string
}

interface FormData {
  name: string
  subject: string
  contact_list_id: number | null
  email_template_id?: number
  html_content: string
  text_content: string
  scheduled_at?: string
}

export function useCampaignSteps(form: { data: FormData }) {
  const currentStep = ref(0)

  const steps: Step[] = [
    {
      key: 'basics',
      label: 'Campaign Basics',
      description: 'Name, subject, and audience',
      icon: 'PenTool'
    },
    {
      key: 'template',
      label: 'Choose Template',
      description: 'Select design or start from scratch',
      icon: 'Layout'
    },
    {
      key: 'content',
      label: 'Design Content',
      description: 'Create your email content',
      icon: 'Edit'
    },
    {
      key: 'review',
      label: 'Review & Send',
      description: 'Final review and scheduling',
      icon: 'Send'
    }
  ]

  // Validation for each step
  const stepValidation = {
    0: () => {
      const hasName = !!(form.data.name && form.data.name.trim())
      const hasSubject = !!(form.data.subject && form.data.subject.trim())
      const hasContactList = !!(form.data.contact_list_id)
      
      return hasName && hasSubject && hasContactList
    },
    1: () => true, // Template selection is optional
    2: () => !!(form.data.html_content && form.data.html_content.trim()),
    3: () => true // Review step doesn't need validation
  }

  // Computed properties
  const canProceed = computed(() => {
    const validator = stepValidation[currentStep.value as keyof typeof stepValidation]
    const result = validator ? validator() : false
    
    return result
  })

  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === steps.length - 1)

  const currentStepData = computed(() => steps[currentStep.value])

  // Methods
  const nextStep = () => {
    if (currentStep.value < steps.length - 1 && canProceed.value) {
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      currentStep.value = stepIndex
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep.value) {
      return 'completed'
    } else if (stepIndex === currentStep.value) {
      return 'current'
    } else {
      return 'upcoming'
    }
  }

  const getCompletedSteps = () => {
    return currentStep.value
  }

  const getProgressPercentage = () => {
    return Math.round((currentStep.value / (steps.length - 1)) * 100)
  }

  return {
    currentStep,
    steps,
    canProceed,
    isFirstStep,
    isLastStep,
    currentStepData,
    nextStep,
    previousStep,
    goToStep,
    getStepStatus,
    getCompletedSteps,
    getProgressPercentage
  }
}