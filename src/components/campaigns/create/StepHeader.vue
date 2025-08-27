<template>
  <div :class="['px-8 py-6', `bg-gradient-to-r ${gradient}`]">
    <div class="flex items-center space-x-3">
      <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-xl font-semibold text-white">
          {{ title }}
        </h2>
        <p class="text-white/80 text-sm">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  PenTool, 
  Layout, 
  Edit, 
  Send, 
  Users,
  Mail,
  Settings,
  Eye
} from 'lucide-vue-next'

interface Props {
  title: string
  subtitle: string
  icon: string
  gradient?: string
}

const props = withDefaults(defineProps<Props>(), {
  gradient: 'from-blue-600 to-purple-600'
})

// Icon mapping
const iconMap = {
  PenTool,
  Layout,
  Edit,
  Send,
  Users,
  Mail,
  Settings,
  Eye
}

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || PenTool
})
</script>

<style scoped>
/* Backdrop blur for better text readability */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Gradient animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Subtle glow effect */
.p-2 {
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}
</style>