import type { Campaign, EmailLog } from './campaigns'
export interface Contact {
id: number
email: string
first_name?: string
last_name?: string
phone?: string
custom_fields?: Record<string, any>
is_subscribed: boolean
bounce_count: number
last_bounce_at?: string
blocked_until?: string
created_at: string
updated_at: string
contact_list?: ContactList
email_logs?: EmailLog[]
full_name?: string
}
export interface ContactList {
id: number
name: string
description?: string
contacts_count: number
tags?: string[]
created_at: string
updated_at: string
user?: User
contacts?: Contact[]
}
export interface CreateContactData {
contact_list_id: number
email: string
first_name?: string
last_name?: string
phone?: string
custom_fields?: Record<string, any>
}
export interface UpdateContactData {
first_name?: string
last_name?: string
phone?: string
custom_fields?: Record<string, any>
is_subscribed?: boolean
}
export interface CreateContactListData {
name: string
description?: string
tags?: string[]
}
export interface UpdateContactListData {
name?: string
description?: string
tags?: string[]
}
export interface ImportContactsData {
file: File
contact_list_id: number
mapping: Record<string, string>
}
export interface ImportContactsResult {
imported: number
errors: number
total: number
message: string
}
export interface ExportContactsData {
list_id: number
format: 'csv' | 'xlsx'
}
export interface BulkActionData {
action: 'delete' | 'subscribe' | 'unsubscribe' | 'move'
contact_ids: number[]
target_list_id?: number
}
