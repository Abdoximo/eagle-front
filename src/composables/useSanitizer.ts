import DOMPurify from 'dompurify'

// Default configuration for email content
const DEFAULT_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'div', 'span', 'a', 'b', 'i', 'u', 'strong', 'em',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'img', 'blockquote', 'hr'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
    'width', 'height', 'colspan', 'rowspan'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false
}

// Stricter configuration for user-generated content
const STRICT_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^https?:\/\//i,
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'img'],
  FORBID_ATTR: ['style', 'class'],
  KEEP_CONTENT: true
}

export function useSanitizer() {
  const sanitizeHtml = (html: string, strict = false): string => {
    if (!html || typeof html !== 'string') {
      return ''
    }

    const config = strict ? STRICT_CONFIG : DEFAULT_CONFIG
    
    try {
      return DOMPurify.sanitize(html, config)
    } catch (error) {
      // If sanitization fails, return empty string for security
      return ''
    }
  }

  const sanitizeEmailContent = (html: string): string => {
    return sanitizeHtml(html, false)
  }

  const sanitizeUserContent = (html: string): string => {
    return sanitizeHtml(html, true)
  }

  const stripHtml = (html: string): string => {
    if (!html || typeof html !== 'string') {
      return ''
    }

    try {
      return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
    } catch (error) {
      return ''
    }
  }

  return {
    sanitizeHtml,
    sanitizeEmailContent,
    sanitizeUserContent,
    stripHtml
  }
}
