import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { 
        guest: true,
        layout: 'auth'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { 
        guest: true,
        layout: 'auth'
      }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { 
        guest: true,
        layout: 'auth'
      }
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { 
        guest: true,
        layout: 'auth'
      }
    },

    // Protected routes
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Dashboard'
      }
    },

    // Campaigns
    {
      path: '/campaigns',
      name: 'Campaigns',
      component: () => import('@/views/campaigns/CampaignsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Campaigns'
      }
    },
    {
      path: '/campaigns/create',
      name: 'CreateCampaign',
      component: () => import('@/views/campaigns/CreateCampaignView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Create Campaign'
      }
    },
    {
      path: '/campaigns/:id/edit',
      name: 'EditCampaign',
      component: () => import('@/views/campaigns/EditCampaignView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Edit Campaign'
      }
    },
    {
      path: '/campaigns/:id',
      name: 'CampaignDetails',
      component: () => import('@/views/campaigns/CampaignDetailsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Campaign Details'
      }
    },
    {
      path: '/campaigns/:id/analytics',
      name: 'CampaignAnalytics',
      component: () => import('@/views/campaigns/AdvancedCampaignAnalytics.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Campaign Analytics'
      }
    },
    {
      path: '/campaigns/:id/recipients',
      name: 'CampaignRecipients',
      component: () => import('@/views/campaigns/CampaignRecipientsView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Campaign Recipients'
      }
    },
    {
      path: '/campaigns/:slug/web',
      name: 'CampaignWebVersion',
      component: () => import('@/views/campaigns/CampaignWebVersion.vue'),
      meta: { 
        guest: true, // Public web version
        title: 'Campaign Web Version'
      }
    },
    {
      path: '/campaigns/templates',
      name: 'CampaignTemplateSelector',
      component: () => import('@/views/campaigns/TemplateSelector.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Choose Template'
      }
    },

    // Contacts
    {
      path: '/contacts',
      name: 'Contacts',
      component: () => import('@/views/contacts/ContactsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Contacts'
      }
    },
    {
      path: '/contacts/lists/:id',
      name: 'ContactList',
      component: () => import('@/views/contacts/ContactListView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Contact List'
      }
    },
    {
      path: '/contacts/import',
      name: 'ImportContacts',
      component: () => import('@/views/contacts/ImportContactsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Import Contacts'
      }
    },
    {
      path: '/contacts/create',
      name: 'CreateContact',
      component: () => import('@/views/contacts/ContactFormView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Create Contact'
      }
    },
    {
      path: '/contacts/:id/edit',
      name: 'EditContact',
      component: () => import('@/views/contacts/ContactFormView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Edit Contact'
      }
    },

    // Templates
    {
      path: '/templates',
      name: 'Templates',
      component: () => import('@/views/templates/TemplatesIndexView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Templates'
      }
    },
    {
      path: '/templates/gallery',
      name: 'TemplateGallery',
      component: () => import('@/views/templates/SimpleTemplateGallery.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Template Gallery - MVP'
      }
    },
    {
      path: '/templates/create',
      name: 'CreateTemplate',
      component: () => import('@/views/templates/TemplatesView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Create Template'
      }
    },
    {
      path: '/templates/:id/edit',
      name: 'EditTemplate',
      component: () => import('@/views/templates/TemplatesView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Edit Template'
      }
    },
    {
      path: '/templates/visual-editor',
      name: 'VisualTemplateEditor',
      component: () => import('@/views/templates/TemplateEditorView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Visual Template Editor'
      }
    },
    {
      path: '/templates/visual-editor/:id',
      name: 'EditVisualTemplate',
      component: () => import('@/views/templates/TemplateEditorView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Edit Template - Visual Editor'
      }
    },
    {
      path: '/templates/:id/preview',
      name: 'PreviewTemplate',
      component: () => import('@/views/templates/TemplatePreviewView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Preview Template'
      }
    },

    // Settings
    {
      path: '/settings',
      redirect: '/settings/profile'
    },
    {
      path: '/settings/profile',
      name: 'ProfileSettings',
      component: () => import('@/views/settings/ProfileView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Profile Settings'
      }
    },
    {
      path: '/settings/smtp',
      name: 'SmtpSettings',
      component: () => import('@/views/settings/SmtpView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'SMTP Settings'
      }
    },
    {
      path: '/settings/postal-api',
      name: 'PostalApiSettings',
      component: () => import('@/views/settings/PostalApiSettingsView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Postal API Settings'
      }
    },
        {
      path: '/settings/billing',
      redirect: '/billing'
    },
    {
      path: '/billing',
      name: 'BillingDashboard',
      component: () => import('@/views/billing/BillingDashboard.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Billing & Credits'
      }
    },
    {
      path: '/settings/preferences',
      name: 'PreferencesSettings',
      component: () => import('@/views/settings/PreferencesView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Preferences'
      }
    },

    // Admin routes
    {
      path: '/admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Admin Dashboard'
      }
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/UsersView.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Admin Users'
      }
    },
    {
      path: '/admin/settings',
      name: 'AdminSettings',
      component: () => import('@/components/settings/AdminSettings.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Admin Settings'
      }
    },
    {
      path: '/admin/stripe',
      name: 'AdminStripe',
      component: () => import('@/views/admin/stripe/StripeSettingsView.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Stripe Settings'
      }
    },
    {
      path: '/admin/smtp',
      name: 'AdminSmtp',
      component: () => import('@/views/admin/SmtpManagementView.vue'),
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'SMTP Management'
      }
    },
    {
      path: '/admin/templates',
      name: 'AdminTemplates',
      component: () => import('@/views/admin/TemplateManager.vue'),
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Template Management'
      }
    },
    {
      path: '/admin/reports',
      name: 'AdminReports',
      component: () => import('@/views/admin/ReportsView.vue'),
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Reports'
      }
    },

    // Error pages
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: {
        title: 'Page Not Found'
      }
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/errors/ForbiddenView.vue'),
      meta: {
        title: 'Access Denied'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('🔍 Router navigation:', { from: from.path, to: to.path, isAuthenticated: authStore.isAuthenticated })

  // Router guard authentication check

  // Handle guest routes (only accessible when not logged in)
  if (to.meta.guest && authStore.isAuthenticated) {
    console.log('🔒 Redirecting authenticated user from guest route to dashboard')
    return next('/dashboard')
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Redirecting unauthenticated user to login')
    return next('/login')
  }

  // Handle admin routes
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.log('🔒 Redirecting non-admin user to 403')
    return next('/403')
  }

  // Handle marketer routes
  if (to.meta.requiresMarketer && !authStore.isMarketer) {
    console.log('🔒 Redirecting non-marketer user to 403')
    return next('/403')
  }

  next()
})

// After navigation
router.afterEach((to) => {
  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_NAME || 'EmailSaaS'}`
  } else {
    document.title = import.meta.env.VITE_APP_NAME || 'EmailSaaS'
  }

  // Scroll to top on route change
  window.scrollTo(0, 0)
})

export default router