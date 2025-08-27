<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold leading-none tracking-tight">
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
      </slot>
    </div>
    
    <div class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'shadow'
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: true
})

const cardClasses = computed(() => {
  const baseClasses = 'card'
  const variantClasses = {
    default: 'bg-card text-card-foreground',
    outline: 'border border-border',
    shadow: 'shadow-lg'
  }
  
  return [baseClasses, variantClasses[props.variant]].join(' ')
})
</script>