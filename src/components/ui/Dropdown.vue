<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        ref="triggerRef"
        @click="toggleDropdown"
        :class="triggerClasses"
        :aria-expanded="isOpen"
        aria-haspopup="true"
      >
        <slot name="trigger">
          {{ triggerText }}
          <ChevronDownIcon class="ml-2 h-4 w-4" />
        </slot>
      </button>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="dropdownClasses"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1" role="none">
          <slot :close="closeDropdown" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  triggerText?: string
  position?: 'left' | 'right'
  triggerClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  triggerText: 'Options',
  position: 'right'
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

const triggerClasses = computed(() => {
  const defaultClasses = 'inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
  return props.triggerClasses || defaultClasses
})

const dropdownClasses = computed(() => {
  const baseClasses = 'absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700'
  const positionClasses = props.position === 'left' ? 'origin-top-left left-0' : 'origin-top-right right-0'
  
  return [baseClasses, positionClasses].join(' ')
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('open')
  } else {
    emit('close')
  }
}

const closeDropdown = () => {
  isOpen.value = false
  emit('close')
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    triggerRef.value &&
    dropdownRef.value &&
    !triggerRef.value.contains(event.target as Node) &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>