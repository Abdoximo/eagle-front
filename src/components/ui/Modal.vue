<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <Transition
            name="modal-backdrop"
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="modelValue"
              class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              @click="handleBackdropClick"
            />
          </Transition>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!-- Modal panel -->
          <Transition
            name="modal-panel"
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle',
                sizeClasses
              ]"
            >
              <!-- Modal Header -->
              <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div v-if="title">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                      {{ title }}
                    </h3>
                    <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ subtitle }}
                    </p>
                  </div>
                  <slot name="header" />
                  <button
                    v-if="closable"
                    type="button"
                    @click="handleClose"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="px-6 py-4">
                <slot />
              </div>

              <!-- Modal Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  closable?: boolean
  closeOnBackdrop?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true
})

const emit = defineEmits<Emits>()

const sizeClasses = computed(() => {
  const sizeMap = {
    sm: 'sm:max-w-sm sm:w-full',
    md: 'sm:max-w-md sm:w-full',
    lg: 'sm:max-w-lg sm:w-full',
    xl: 'sm:max-w-xl sm:w-full',
    '2xl': 'sm:max-w-2xl sm:w-full'
  }
  return sizeMap[props.size]
})

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>