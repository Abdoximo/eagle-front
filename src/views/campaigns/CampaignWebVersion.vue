<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-4">
            <img 
              :src="campaign.company_logo || defaultLogo" 
              :alt="campaign.company_name"
              class="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ campaign.company_name }}</h1>
              <p class="text-sm text-gray-500">{{ formatDate(campaign.sent_at) }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- View Counter -->
            <div class="flex items-center text-sm text-gray-500">
              <Eye class="w-4 h-4 mr-1" />
              <span>{{ formatNumber(campaign.web_version_views) }} views</span>
            </div>
            
            <!-- Share Button -->
            <div class="relative" ref="shareDropdown">
              <button 
                @click="toggleShareMenu"
                class="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 class="w-4 h-4 mr-2" />
                Share
              </button>
              
              <!-- Share Dropdown -->
              <div v-if="showShareMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button @click="copyLink" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Link class="w-4 h-4 mr-3" />
                  Copy Link
                </button>
                <button @click="shareEmail" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Mail class="w-4 h-4 mr-3" />
                  Share via Email
                </button>
                <button @click="shareTwitter" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Twitter class="w-4 h-4 mr-3" />
                  Share on Twitter
                </button>
                <button @click="shareFacebook" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <Facebook class="w-4 h-4 mr-3" />
                  Share on Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Campaign Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start space-x-3">
          <Info class="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 class="text-sm font-medium text-blue-900">{{ campaign.name }}</h3>
            <p class="text-sm text-blue-700 mt-1">
              This email was sent to {{ formatNumber(campaign.total_recipients) }} recipients on {{ formatDate(campaign.sent_at) }}.
              You're viewing the web version of this email campaign.
            </p>
          </div>
        </div>
      </div>

      <!-- Email Content Container -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Content Header -->
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ campaign.subject }}</h2>
              <p class="text-sm text-gray-500 mt-1">Campaign: {{ campaign.name }}</p>
            </div>
            
            <!-- Responsive Preview Toggle -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">View:</span>
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                  @click="viewMode = 'desktop'"
                  :class="[
                    'flex items-center px-3 py-1 rounded text-sm transition-colors',
                    viewMode === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  ]"
                >
                  <Monitor class="w-4 h-4 mr-1" />
                  Desktop
                </button>
                <button
                  @click="viewMode = 'mobile'"
                  :class="[
                    'flex items-center px-3 py-1 rounded text-sm transition-colors',
                    viewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  ]"
                >
                  <Smartphone class="w-4 h-4 mr-1" />
                  Mobile
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Content -->
        <div class="relative">
          <!-- Loading overlay -->
          <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div class="flex items-center space-x-2 text-gray-600">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading email content...</span>
            </div>
          </div>

          <!-- Email iframe container -->
          <div :class="[
            'transition-all duration-300 mx-auto bg-gray-100',
            viewMode === 'mobile' ? 'max-w-sm' : 'max-w-full'
          ]">
            <div class="bg-white" :class="{ 'shadow-lg': viewMode === 'mobile' }">
              <!-- Safe HTML content rendering -->
              <div 
                v-if="!loading && sanitizedContent"
                v-html="sanitizedContent"
                class="email-content"
                style="max-width: 100%; overflow-x: auto;"
              ></div>
              
              <!-- Fallback if no content -->
              <div v-else-if="!loading" class="p-8 text-center">
                <FileX class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Content Not Available</h3>
                <p class="text-gray-500">
                  The email content could not be loaded. This might be due to content restrictions or the campaign being unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Actions Footer -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <Calendar class="w-4 h-4 mr-1" />
                <span>Sent {{ formatDate(campaign.sent_at) }}</span>
              </div>
              <div class="flex items-center">
                <Users class="w-4 h-4 mr-1" />
                <span>{{ formatNumber(campaign.total_recipients) }} recipients</span>
              </div>
              <div class="flex items-center">
                <TrendingUp class="w-4 h-4 mr-1" />
                <span>{{ campaign.open_rate }}% open rate</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="viewAnalytics"
                class="flex items-center px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BarChart3 class="w-4 h-4 mr-2" />
                View Analytics
              </button>
              
              <button 
                v-if="canSubscribe"
                @click="subscribeToNewsletter"
                class="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Bell class="w-4 h-4 mr-2" />
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Campaign Performance Summary -->
      <div v-if="showPerformance" class="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ campaign.delivery_rate }}%</div>
            <div class="text-sm text-gray-500">Delivery Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ campaign.open_rate }}%</div>
            <div class="text-sm text-gray-500">Open Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ campaign.click_rate }}%</div>
            <div class="text-sm text-gray-500">Click Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ campaign.engagement_score }}/100</div>
            <div class="text-sm text-gray-500">Engagement Score</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>
          This email was sent by {{ campaign.company_name }}. 
          <button @click="reportSpam" class="text-blue-600 hover:text-blue-700 underline">Report as spam</button> | 
          <button @click="viewPrivacyPolicy" class="text-blue-600 hover:text-blue-700 underline">Privacy Policy</button>
        </p>
        <p class="mt-2">
          Powered by {{ appName }} - Professional Email Marketing Platform
        </p>
      </div>
    </div>

    <!-- Subscription Modal -->
    <SubscriptionModal 
      v-if="showSubscriptionModal"
      :campaign="campaign"
      @close="showSubscriptionModal = false"
      @subscribe="handleSubscription"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Eye, Share2, Link, Mail, Twitter, Facebook, Info, Monitor, Smartphone,
  FileX, Calendar, Users, TrendingUp, BarChart3, Bell
} from 'lucide-vue-next'
import { useSanitizer } from '@/composables/useSanitizer'
import SubscriptionModal from '@/components/campaigns/SubscriptionModal.vue'
import { showSuccess, showError } from '@/services/toast'

const route = useRoute()
const router = useRouter()
const { sanitizeEmailContent } = useSanitizer()

// State
const loading = ref(true)
const viewMode = ref('desktop')
const showShareMenu = ref(false)
const showSubscriptionModal = ref(false)
const shareDropdown = ref(null)

// Configuration
const appName = 'Eagle Email'
const showPerformance = ref(true) // Could be based on user permissions
const canSubscribe = ref(true) // Could be based on campaign settings

// Mock campaign data - replace with real API call
const campaign = ref({
  id: route.params.slug,
  name: 'Black Friday Mega Sale 2024',
  subject: '🔥 50% OFF Everything - Black Friday Exclusive!',
  company_name: 'Your Store Name',
  company_logo: null,
  sent_at: '2024-01-15T10:00:00Z',
  total_recipients: 15420,
  web_version_views: 1247,
  delivery_rate: 97.8,
  open_rate: 28.5,
  click_rate: 4.2,
  engagement_score: 85,
  html_content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🔥 BLACK FRIDAY SALE</h1>
        <p style="margin: 10px 0 0; font-size: 18px;">Up to 50% OFF Everything!</p>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">Limited Time Offer - Don't Miss Out!</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Our biggest sale of the year is here! Get incredible discounts on thousands of products.
          From electronics to fashion, home goods to sports equipment - everything is on sale.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="display: inline-block; background: #ff4444; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
            SHOP NOW & SAVE BIG!
          </a>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #333; margin-top: 0;">Featured Deals:</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>Electronics - Up to 40% OFF</li>
            <li>Fashion & Accessories - 30% OFF</li>
            <li>Home & Garden - 25% OFF</li>
            <li>Sports & Outdoors - 35% OFF</li>
          </ul>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Hurry! This exclusive offer ends soon. Use code <strong>BLACKFRIDAY50</strong> at checkout.
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>© 2024 Your Store Name. All rights reserved.</p>
        <p><a href="#" style="color: #666;">Unsubscribe</a> | <a href="#" style="color: #666;">View in browser</a></p>
      </div>
    </div>
  `
})

const defaultLogo = computed(() => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.value.company_name)}&background=3B82F6&color=ffffff&size=32`
)

const sanitizedContent = computed(() => {
  if (!campaign.value.html_content) return null
  return sanitizeEmailContent(campaign.value.html_content)
})

const currentUrl = computed(() => 
  `${window.location.origin}/campaigns/${campaign.value.id}/web`
)

// Methods
const loadCampaign = async () => {
  loading.value = true
  try {
    // TODO: Replace with real API call
    // const response = await api.get(`/api/campaigns/${route.params.slug}/web`)
    // campaign.value = response.data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Track web version view
    await trackWebView()
  } catch (error) {
    showError('Failed to load campaign')
  } finally {
    loading.value = false
  }
}

const trackWebView = async () => {
  try {
    // TODO: Replace with real API call
    // await api.post(`/api/campaigns/${campaign.value.id}/track-web-view`)
    
    // Update view count locally
    campaign.value.web_version_views += 1
  } catch (error) {
    console.error('Failed to track web view:', error)
  }
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    showSuccess('Link copied to clipboard!')
    showShareMenu.value = false
  } catch (error) {
    showError('Failed to copy link')
  }
}

const shareEmail = () => {
  const subject = encodeURIComponent(`Check out: ${campaign.value.subject}`)
  const body = encodeURIComponent(`I thought you might find this interesting: ${currentUrl.value}`)
  window.open(`mailto:?subject=${subject}&body=${body}`)
  showShareMenu.value = false
}

const shareTwitter = () => {
  const text = encodeURIComponent(`Check out this email campaign: ${campaign.value.subject}`)
  const url = encodeURIComponent(currentUrl.value)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  showShareMenu.value = false
}

const shareFacebook = () => {
  const url = encodeURIComponent(currentUrl.value)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  showShareMenu.value = false
}

const viewAnalytics = () => {
  router.push(`/campaigns/${campaign.value.id}/analytics`)
}

const subscribeToNewsletter = () => {
  showSubscriptionModal.value = true
}

const handleSubscription = (email) => {
  // TODO: Handle newsletter subscription
  showSuccess(`Successfully subscribed ${email} to newsletter!`)
  showSubscriptionModal.value = false
}

const reportSpam = () => {
  // TODO: Handle spam report
  showSuccess('Thank you for your report. We take spam seriously.')
}

const viewPrivacyPolicy = () => {
  window.open('/privacy-policy', '_blank')
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Click outside handler for share menu
const handleClickOutside = (event) => {
  if (shareDropdown.value && !shareDropdown.value.contains(event.target)) {
    showShareMenu.value = false
  }
}

onMounted(() => {
  loadCampaign()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.email-content {
  /* Ensure email content is properly contained */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Responsive email content adjustments */
@media (max-width: 640px) {
  .email-content table {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .email-content img {
    max-width: 100% !important;
    height: auto !important;
  }
}

/* Dark mode styles for email content */
@media (prefers-color-scheme: dark) {
  .email-content {
    background-color: white;
    color: #333;
  }
}
</style>
