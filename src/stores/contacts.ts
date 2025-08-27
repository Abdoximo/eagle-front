import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contactsApi } from '@/services/contacts.api'
import { showSuccess, showError } from '@/services/toast'
import type { Contact, ContactList, CreateContactData, UpdateContactData, CreateContactListData, UpdateContactListData, ImportContactsData, ExportContactsData } from '@/types/contacts'
import { usePagination } from '@/composables/usePagination'

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref<Contact[]>([])
  const contactLists = ref<ContactList[]>([])
  const currentContact = ref<Contact | null>(null)
  const currentList = ref<ContactList | null>(null)
  const loading = ref(false)
  const importProgress = ref(0)
  const pagination = usePagination()

  // Getters
  const subscribedContacts = computed(() => contacts.value.filter(c => c.is_subscribed))
  const unsubscribedContacts = computed(() => contacts.value.filter(c => !c.is_subscribed))
  const blockedContacts = computed(() => contacts.value.filter(c => c.blocked_until && new Date(c.blocked_until) > new Date()))
  const totalContacts = computed(() => contactLists.value.reduce((sum, list) => sum + list.contacts_count, 0))

  // Actions
  const fetchContacts = async (params?: { page?: number; search?: string; list_id?: number }) => {
    try {
      loading.value = true
      const response = await contactsApi.getContacts(params)
      contacts.value = response.data || []
      pagination.updateMeta(response.pagination || {})
    } catch (error: any) {
      showError('Failed to load contacts')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchContact = async (id: number) => {
    try {
      loading.value = true
      const response = await contactsApi.getContact(id)
      return response.contact
    } catch (error: any) {
      showError('Failed to load contact')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createContact = async (data: CreateContactData) => {
    try {
      loading.value = true
      const response = await contactsApi.createContact(data)
      contacts.value.unshift(response.contact)
      showSuccess(response.message)
      return response.contact
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create contact'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (id: number, data: UpdateContactData) => {
    try {
      loading.value = true
      const response = await contactsApi.updateContact(id, data)
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts.value[index] = response.contact
      }
      showSuccess(response.message)
      return response.contact
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update contact'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id: number) => {
    try {
      loading.value = true
      const response = await contactsApi.deleteContact(id)
      contacts.value = contacts.value.filter(c => c.id !== id)
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete contact'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const bulkAction = async (action: string, contactIds: number[], targetListId?: number) => {
    try {
      loading.value = true
      const response = await contactsApi.bulkAction({
        action: action as any,
        contact_ids: contactIds,
        target_list_id: targetListId,
      })
      
      // Refresh contacts after bulk action
      await fetchContacts()
      await fetchContactLists()
      
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Bulk action failed'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const importContacts = async (data: ImportContactsData) => {
    try {
      loading.value = true
      const response = await contactsApi.importContacts(data)
      showSuccess(response.message)
      await fetchContacts() // Refresh the list
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to import contacts'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const exportContacts = async (data: ExportContactsData) => {
    try {
      loading.value = true
      await contactsApi.exportContacts(data)
      showSuccess('Contacts exported successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to export contacts'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchContactLists = async () => {
    try {
      loading.value = true
      const response = await contactsApi.getContactLists()
      contactLists.value = response.lists || []
    } catch (error: any) {
      showError('Failed to load contact lists')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createContactList = async (data: CreateContactListData) => {
    try {
      loading.value = true
      const response = await contactsApi.createContactList(data)
      contactLists.value.unshift(response.list)
      showSuccess(response.message)
      return response.list
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create contact list'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateContactList = async (id: number, data: UpdateContactListData) => {
    try {
      loading.value = true
      const response = await contactsApi.updateContactList(id, data)
      const index = contactLists.value.findIndex(l => l.id === id)
      if (index !== -1) {
        contactLists.value[index] = response.list
      }
      showSuccess(response.message)
      return response.list
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update contact list'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteContactList = async (id: number) => {
    try {
      loading.value = true
      const response = await contactsApi.deleteContactList(id)
      
      const index = contactLists.value.findIndex(l => l.id === id)
      if (index > -1) {
        contactLists.value.splice(index, 1)
      }
      
      showSuccess(response.message)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete list'
      showError(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const clearCurrentContact = () => {
    currentContact.value = null
  }

  return {
    // State
    contacts,
    contactLists,
    currentContact,
    currentList,
    loading,
    importProgress,
    pagination,
    
    // Getters
    subscribedContacts,
    unsubscribedContacts,
    blockedContacts,
    totalContacts,
    
    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    bulkAction,
    importContacts,
    exportContacts,
    fetchContactLists,
    createContactList,
    updateContactList,
    deleteContactList,
    clearCurrentContact,
  }
})