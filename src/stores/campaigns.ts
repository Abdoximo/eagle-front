import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { campaignsApi } from '@/services/campaigns.api'
import type { Campaign, CreateCampaignData, UpdateCampaignData, CampaignStats, EmailLog } from '@/types/campaigns'
import { showSuccess, showError } from '@/services/toast'
import { usePagination } from '@/composables/usePagination'

export const useCampaignsStore = defineStore('campaigns', () => {
    // State
    const campaigns = ref<Campaign[]>([])
    const currentCampaign = ref<Campaign | null>(null)
    const campaignStats = ref<CampaignStats | null>(null)
    const campaignLogs = ref<EmailLog[]>([])
    const loading = ref(false)
    const pagination = usePagination()

    // Getters
    const draftCampaigns = computed(() => campaigns.value.filter(c => c.status === 'draft'))
    const scheduledCampaigns = computed(() => campaigns.value.filter(c => c.status === 'scheduled'))
    const sentCampaigns = computed(() => campaigns.value.filter(c => c.status === 'sent'))
    const activeCampaigns = computed(() => campaigns.value.filter(c => c.status === 'sending'))

    // Actions
    const fetchCampaigns = async (params?: { page?: number; status?: string; search?: string }) => {
        try {
            loading.value = true
            const response = await campaignsApi.getCampaigns(params)
            
            // Handle the actual API response structure
            // API returns: { campaigns: [...], pagination: {...} }
            if (response && typeof response === 'object') {
                // Check if response has campaigns property (actual API response)
                if ('campaigns' in response) {
                    campaigns.value = response.campaigns || []
                    pagination.updateMeta(response.pagination || {
                        current_page: 1,
                        total: 0,
                        per_page: 15
                    })
                } 
                // Check if response has data property (PaginatedResponse type)
                else if ('data' in response) {
                    campaigns.value = response.data || []
                    pagination.updateMeta(response.pagination || {
                        current_page: 1,
                        total: 0,
                        per_page: 15
                    })
                } 
                // Fallback
                else {
                    campaigns.value = []
                    pagination.updateMeta({
                        current_page: 1,
                        total: 0,
                        per_page: 15
                    })
                }
            } else {
                campaigns.value = []
                pagination.updateMeta({
                    current_page: 1,
                    total: 0,
                    per_page: 15
                })
            }
            
        } catch (error: any) {
            // If API fails or returns empty, add some mock data for development
            if (!campaigns.value.length) {
                campaigns.value = [
                    {
                        id: 1,
                        name: "Welcome Campaign",
                        subject: "Welcome to our service!",
                        html_content: "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
                        text_content: "Welcome! Thank you for joining us.",
                        status: "sent",
                        scheduled_at: undefined,
                        sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        total_recipients: 1250,
                        emails_sent: 1245,
                        emails_delivered: 1240,
                        emails_bounced: 5,
                        emails_opened: 856,
                        emails_clicked: 234,
                        open_rate: 69.0,
                        click_rate: 18.8,
                        bounce_rate: 0.4,
                        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        contact_list: {
                            id: 1,
                            name: "Newsletter Subscribers"
                        }
                    },
                    {
                        id: 2,
                        name: "Product Launch",
                        subject: "🚀 Introducing our new product!",
                        html_content: "<h1>New Product Launch</h1><p>Check out our latest innovation.</p>",
                        text_content: "New Product Launch - Check out our latest innovation.",
                        status: "draft",
                        scheduled_at: undefined,
                        sent_at: undefined,
                        total_recipients: 850,
                        emails_sent: 0,
                        emails_delivered: 0,
                        emails_bounced: 0,
                        emails_opened: 0,
                        emails_clicked: 0,
                        open_rate: 0,
                        click_rate: 0,
                        bounce_rate: 0,
                        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        contact_list: {
                            id: 2,
                            name: "Product Interested Users"
                        }
                    },
                    {
                        id: 3,
                        name: "Monthly Newsletter",
                        subject: "📧 Your Monthly Update",
                        html_content: "<h1>Monthly Newsletter</h1><p>Here's what's new this month.</p>",
                        text_content: "Monthly Newsletter - Here's what's new this month.",
                        status: "scheduled",
                        scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                        sent_at: undefined,
                        total_recipients: 2100,
                        emails_sent: 0,
                        emails_delivered: 0,
                        emails_bounced: 0,
                        emails_opened: 0,
                        emails_clicked: 0,
                        open_rate: 0,
                        click_rate: 0,
                        bounce_rate: 0,
                        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                        contact_list: {
                            id: 3,
                            name: "All Subscribers"
                        }
                    },
                    {
                        id: 4,
                        name: "Flash Sale Alert",
                        subject: "⚡ 50% OFF Everything - Limited Time!",
                        html_content: "<h1>Flash Sale</h1><p>Don't miss out on our biggest sale!</p>",
                        text_content: "Flash Sale - Don't miss out on our biggest sale!",
                        status: "sent",
                        scheduled_at: undefined,
                        sent_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        total_recipients: 3200,
                        emails_sent: 3195,
                        emails_delivered: 3180,
                        emails_bounced: 15,
                        emails_opened: 2226,
                        emails_clicked: 892,
                        open_rate: 70.0,
                        click_rate: 28.0,
                        bounce_rate: 0.5,
                        created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        contact_list: {
                            id: 4,
                            name: "VIP Customers"
                        }
                    },
                    {
                        id: 5,
                        name: "Feedback Survey",
                        subject: "We'd love your feedback!",
                        html_content: "<h1>Feedback Survey</h1><p>Help us improve by sharing your thoughts.</p>",
                        text_content: "Feedback Survey - Help us improve by sharing your thoughts.",
                        status: "cancelled",
                        scheduled_at: undefined,
                        sent_at: undefined,
                        total_recipients: 500,
                        emails_sent: 0,
                        emails_delivered: 0,
                        emails_bounced: 0,
                        emails_opened: 0,
                        emails_clicked: 0,
                        open_rate: 0,
                        click_rate: 0,
                        bounce_rate: 0,
                        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                        contact_list: {
                            id: 5,
                            name: "Recent Customers"
                        }
                    }
                ]
                
                // Mock pagination
                pagination.updateMeta({
                    current_page: 1,
                    total: campaigns.value.length,
                    per_page: 20,
                    last_page: 1
                })
            }
            
            showError('Failed to load campaigns')
            throw error
        } finally {
            loading.value = false
        }
    }

    const fetchCampaign = async (id: number) => {
        try {
            loading.value = true
            const response = await campaignsApi.getCampaign(id)
            currentCampaign.value = response.campaign
            return response.campaign
        } catch (error: any) {
            showError('Failed to load campaign')
            throw error
        } finally {
            loading.value = false
        }
    }

    const createCampaign = async (data: CreateCampaignData) => {
        try {
            loading.value = true
            const response = await campaignsApi.createCampaign(data)
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            campaigns.value.unshift(response.campaign)
            showSuccess(response.message)
            return response.campaign
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const updateCampaign = async (id: number, data: UpdateCampaignData) => {
        try {
            loading.value = true
            const response = await campaignsApi.updateCampaign(id, data)
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            const index = campaigns.value.findIndex(c => c.id === id)
            if (index > -1) {
                campaigns.value[index] = response.campaign
            }

            if (currentCampaign.value?.id === id) {
                currentCampaign.value = response.campaign
            }

            showSuccess(response.message)
            return response.campaign
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const deleteCampaign = async (id: number) => {
        try {
            loading.value = true
            const response = await campaignsApi.deleteCampaign(id)
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            const index = campaigns.value.findIndex(c => c.id === id)
            if (index > -1) {
                campaigns.value.splice(index, 1)
            }

            showSuccess(response.message)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const sendCampaign = async (id: number) => {
        try {
            loading.value = true
            const response = await campaignsApi.sendCampaign(id)
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            const campaign = campaigns.value.find(c => c.id === id)
            if (campaign) {
                campaign.status = 'sending'
            }

            showSuccess(response.message)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const sendTestEmail = async (id: number, testEmails: string[]) => {
        try {
            loading.value = true
            const response = await campaignsApi.sendTestEmail(id, { test_emails: testEmails })
            showSuccess(response.message)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send test email'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const scheduleCampaign = async (id: number, scheduledAt: string) => {
        try {
            loading.value = true
            const response = await campaignsApi.scheduleCampaign(id, { scheduled_at: scheduledAt })
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            const campaign = campaigns.value.find(c => c.id === id)
            if (campaign) {
                campaign.status = 'scheduled'
                campaign.scheduled_at = scheduledAt
            }

            showSuccess(response.message)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to schedule campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const duplicateCampaign = async (id: number) => {
        try {
            loading.value = true
            const response = await campaignsApi.duplicateCampaign(id)
            
            // Ensure campaigns array is initialized
            if (!campaigns.value) {
                campaigns.value = []
            }
            
            campaigns.value.unshift(response.campaign)
            showSuccess(response.message)
            return response.campaign
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to duplicate campaign'
            showError(message)
            throw error
        } finally {
            loading.value = false
        }
    }
    const fetchCampaignStats = async (id: number) => {
        try {
            const response = await campaignsApi.getCampaignStats(id)
            campaignStats.value = response.stats
            return response.stats
        } catch (error: any) {
            showError('Failed to load campaign stats')
            throw error
        }
    }
    const fetchCampaignLogs = async (id: number, params?: { page?: number }) => {
        try {
            loading.value = true
            const response = await campaignsApi.getCampaignLogs(id, params)
            campaignLogs.value = response.data
            pagination.updateMeta(response.pagination)
        } catch (error: any) {
            showError('Failed to load campaign logs')
            throw error
        } finally {
            loading.value = false
        }
    }
    const clearCurrentCampaign = () => {
        currentCampaign.value = null
        campaignStats.value = null
        campaignLogs.value = []
    }
    return {
        // State
        campaigns,
        currentCampaign,
        campaignStats,
        campaignLogs,
        loading,
        pagination,
        // Getters
        draftCampaigns,
        scheduledCampaigns,
        sentCampaigns,
        activeCampaigns,

        // Actions
        fetchCampaigns,
        fetchCampaign,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        sendCampaign,
        sendTestEmail,
        scheduleCampaign,
        duplicateCampaign,
        fetchCampaignStats,
        fetchCampaignLogs,
        clearCurrentCampaign,
    }
})
