// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  CAMPAIGNS: '/campaigns',
  CONTACTS: '/contacts',
  TEMPLATES: '/templates',
  SMTP: '/smtp-servers',
  CREDITS: '/credits',
  ADMIN: '/admin',
} as const

// Application Constants
export const APP_CONFIG = {
  NAME: 'EmailSaaS',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'fr', 'es'],
  DEFAULT_THEME: 'system',
  PAGINATION_SIZE: 15,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['text/csv', 'application/vnd.ms-excel'],
} as const

// Status Constants
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  SENT: 'sent',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const

export const EMAIL_STATUS = {
  QUEUED: 'queued',
  SENT: 'sent',
  DELIVERED: 'delivered',
  BOUNCED: 'bounced',
  OPENED: 'opened',
  CLICKED: 'clicked',
  COMPLAINED: 'complained',
  UNSUBSCRIBED: 'unsubscribed',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MARKETER: 'marketer',
} as const

// SMTP Configuration
export const SMTP_ENCRYPTION = {
  NONE: 'none',
  TLS: 'tls',
  SSL: 'ssl',
} as const

export const SMTP_PORTS = {
  SMTP: 25,
  SMTP_SUBMISSION: 587,
  SMTPS: 465,
} as const

// Template Types
export const TEMPLATE_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const

// File Upload
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  ERROR: 'error',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRAY: '#6B7280',
} as const

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  SUBJECT_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

// Credit Packages
export const DEFAULT_CREDIT_PACKAGES = [
  {
    credits: 1000,
    price: 9.99,
    popular: false,
  },
  {
    credits: 5000,
    price: 39.99,
    popular: true,
  },
  {
    credits: 10000,
    price: 69.99,
    popular: false,
  },
  {
    credits: 25000,
    price: 149.99,
    popular: false,
  },
] as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const

// Event Names
export const EVENTS = {
  AUTH_STATE_CHANGED: 'auth:state-changed',
  CREDITS_UPDATED: 'credits:updated',
  CAMPAIGN_SENT: 'campaign:sent',
  NOTIFICATION_RECEIVED: 'notification:received',
} as const