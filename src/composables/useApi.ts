import { ref, computed, type Ref } from 'vue'
import { showError } from '@/services/toast'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ApiState<T = any> {
  data: T | null
  loading: LoadingState
  error: string | null
}

export function useApi<T = any>() {
  const data: Ref<T | null> = ref(null)
  const error: Ref<string | null> = ref(null)
  const loading: Ref<LoadingState> = ref('idle')

  const execute = async (apiCall: () => Promise<T>) => {
    try {
      loading.value = 'loading'
      error.value = null
      data.value = await apiCall()
      loading.value = 'success'
      return data.value
    } catch (err: any) {
      loading.value = 'error'
      const message = err.response?.data?.message || err.message || 'An error occurred'
      error.value = message
      showError(message)
      throw err
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = 'idle'
  }

  return {
    data,
    error,
    loading,
    isLoading: computed(() => loading.value === 'loading'),
    isSuccess: computed(() => loading.value === 'success'),
    isError: computed(() => loading.value === 'error'),
    execute,
    reset,
  }
}