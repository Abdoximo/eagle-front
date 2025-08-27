import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { smtpApi } from '@/services/smtp.api'
import { showSuccess, showError } from '@/services/toast'
import type { SmtpServer, CreateSmtpServerData, UpdateSmtpServerData } from '@/types/smtp'

export const useSmtpStore = defineStore('smtp', () => {
    // State
    const smtpServers = ref<SmtpServer[]>([])
    const sharedSmtpServers = ref<SmtpServer[]>([])
    const currentSmtpServer = ref<SmtpServer | null>(null)
    const loading = ref(false)
    const testingConnection = ref(false)

  // Getters
  const activeServers = computed(() => smtpServers.value.filter(s => s.is_active))
  const inactiveServers = computed(() => smtpServers.value.filter(s => !s.is_active))
  const availableServers = computed(() => [...activeServers.value, ...sharedSmtpServers.value.filter(s => s.is_active)])
  const totalServers = computed(() => smtpServers.value.length + sharedSmtpServers.value.length)

  // Actions
  const fetchSmtpServers = async () => {
    try {
      loading.value = true
      const response = await smtpApi.getSmtpServers()
      smtpServers.value = response.smtp_servers || []
    } catch (error: any) {
      showError('Failed to load SMTP servers')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchSharedServers = async () => {
    try {
      loading.value = true
      const response = await smtpApi.getSharedSmtpServers()
      sharedSmtpServers.value = response.shared_servers
    } catch (error: any) {
      showError('Failed to load shared SMTP servers')
      throw error
    }
  }

  const fetchSmtpServer = async (id: number) => {
    try {
      loading.value = true
      const response = await smtpApi.getSmtpServer(id)
      currentSmtpServer.value = response.smtp_server
      return response.smtp_server
    } catch (error: any) {
      showError('Failed to load SMTP server')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createSmtpServer = async (data: CreateSmtpServerData) => {
    try {
      loading.value = true
      const response = await smtpApi.createSmtpServer(data)
      smtpServers.value.unshift(response.smtp_server)
      showSuccess(response.message)
      return response.smtp_server
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create SMTP server'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateSmtpServer = async (id: number, data: UpdateSmtpServerData) => {
    try {
      loading.value = true
      const response = await smtpApi.updateSmtpServer(id, data)
      
      const index = smtpServers.value.findIndex(s => s.id === id)
      if (index > -1) {
        smtpServers.value[index] = response.smtp_server
      }
      
      if (currentSmtpServer.value?.id === id) {
        currentSmtpServer.value = response.smtp_server
      }
      
      showSuccess(response.message)
      return response.smtp_server
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update SMTP server'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteSmtpServer = async (id: number) => {
    try {
      loading.value = true
      const response = await smtpApi.deleteSmtpServer(id)
      
      const index = smtpServers.value.findIndex(s => s.id === id)
      if (index > -1) {
        smtpServers.value.splice(index, 1)
      }
      
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete SMTP server'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const testSmtpConnection = async (id: number) => {
    try {
      testingConnection.value = true
      const response = await smtpApi.testSmtpServer(id)
      
      if (response.success) {
        showSuccess(response.message)
      } else {
        showError(response.message)
      }
      
      return response
    } catch (error: any) {
      const message = error.response?.data?.message || 'Connection test failed'
      showError(message)
      throw error
    } finally {
      testingConnection.value = false
    }
  }

  const clearCurrentServer = () => {
    currentSmtpServer.value = null
  }

  return {
    // State
    smtpServers,
    sharedSmtpServers,
    currentSmtpServer,
    loading,
    testingConnection,
    
    // Getters
    activeServers,
    inactiveServers,
    availableServers,
    totalServers,
    
    // Actions
    fetchSmtpServers,
    fetchSharedServers,
    fetchSmtpServer,
    createSmtpServer,
    updateSmtpServer,
    deleteSmtpServer,
    testSmtpConnection,
    clearCurrentServer,
  }
})