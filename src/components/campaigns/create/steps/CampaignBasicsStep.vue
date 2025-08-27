<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <StepHeader
      title="Campaign Basics"
      subtitle="Set up your campaign name and audience"
      icon="PenTool"
      gradient="from-blue-600 to-purple-600"
    />
    
    <!-- Content -->
    <div class="p-8 space-y-8">
      <!-- Campaign Name -->
      <FormField
        label="Campaign Name"
        :error="errors.name"
        required
      >
        <div class="relative">
          <Sparkles class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            :model-value="modelValue.name"
            @update:model-value="updateField('name', $event)"
            placeholder="e.g., Summer Sale Newsletter 2024"
            class="pl-10"
            :class="{ 'border-red-300 dark:border-red-600': errors.name }"
          />
        </div>
        <template #hint>
          Choose a descriptive name that helps you identify this campaign later
        </template>
      </FormField>

      <!-- Subject Line -->
      <FormField
        label="Email Subject"
        :error="errors.subject"
        required
      >
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            :model-value="modelValue.subject"
            @update:model-value="updateField('subject', $event)"
            placeholder="Write a compelling subject line..."
            :maxlength="100"
            class="pl-10"
            :class="{ 'border-red-300 dark:border-red-600': errors.subject }"
          />
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Keep it concise and engaging - this is what recipients see first
          </span>
          <span class="text-xs text-gray-400">
            {{ modelValue.subject.length }}/100
          </span>
        </div>
      </FormField>

      <!-- Contact List Selection -->
      <ContactListSelector
        :model-value="modelValue.contact_list_id"
        @update:model-value="updateField('contact_list_id', $event)"
        :error="errors.contact_list_id"
        required
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Mail } from 'lucide-vue-next'
import StepHeader from '@/components/campaigns/create/StepHeader.vue'
import FormField from '@/components/ui/FormField.vue'
import Input from '@/components/ui/Input.vue'
import ContactListSelector from '@/components/campaigns/create/ContactListSelector.vue'

interface Props {
  modelValue: {
    name: string
    subject: string
    contact_list_id: number | null
  }
  errors: Record<string, string>
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateField = (field: keyof Props['modelValue'], value: any) => {
  const newValue = {
    ...props.modelValue,
    [field]: value
  }
  
  emit('update:modelValue', newValue)
}
</script>