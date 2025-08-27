import api from './api'
import type {
  Contact,
  ContactList,
  CreateContactData,
  UpdateContactData,
  CreateContactListData,
  UpdateContactListData,
  ImportContactsResult,
  ExportContactsData,
  BulkActionData,
  PaginatedResponse,
} from '@/types/contacts'

export const contactsApi = {
  // Contact CRUD operations
  async getContacts(params?: {
    page?: number
    list_id?: number
    search?: string
  }): Promise<PaginatedResponse<Contact>> {
    return api.get('/contacts', { params })
  },

  async getContact(id: number): Promise<{ contact: Contact }> {
    return api.get(`/contacts/${id}`)
  },

  async createContact(data: CreateContactData): Promise<{ message: string; contact: Contact }> {
    return api.post('/contacts', data)
  },

  async updateContact(
    id: number,
    data: UpdateContactData
  ): Promise<{ message: string; contact: Contact }> {
    return api.put(`/contacts/${id}`, data)
  },

  async deleteContact(id: number): Promise<{ message: string }> {
    return api.delete(`/contacts/${id}`)
  },

  // Bulk operations
  async bulkAction(data: BulkActionData): Promise<{ message: string }> {
    return api.post('/contacts/bulk-action', data)
  },

  // Import/Export
  async importContacts(
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ): Promise<ImportContactsResult> {
    return api.upload('/contacts/import', formData, (progressEvent) => {
      if (onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onUploadProgress(progress)
      }
    })
  },

  async exportContacts(data: ExportContactsData): Promise<{ message: string; download_url: string }> {
    return api.post('/contacts/export', data)
  },

  // Contact Lists operations
  async getContactLists(): Promise<{ lists: ContactList[] }> {
    return api.get('/contacts/lists')
  },

  async createContactList(
    data: CreateContactListData
  ): Promise<{ message: string; list: ContactList }> {
    return api.post('/contacts/lists', data)
  },

  async updateContactList(
    id: number,
    data: UpdateContactListData
  ): Promise<{ message: string; list: ContactList }> {
    return api.put(`/contacts/lists/${id}`, data)
  },

  async deleteContactList(id: number): Promise<{ message: string }> {
    return api.delete(`/contacts/lists/${id}`)
  },

  async getContactListContacts(
    listId: number,
    params?: { page?: number }
  ): Promise<PaginatedResponse<Contact>> {
    return api.get(`/contacts/lists/${listId}/contacts`, { params })
  },
}