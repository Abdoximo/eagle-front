# 🚀 Frontend Production Readiness Checklist

## 🔒 Security (CRITICAL)

### ✅ Completed
- [x] JWT token expiration handling 
- [x] Unified token storage mechanism
- [x] Secure logout implementation
- [x] XSS protection via DOMPurify (2/8 files fixed)
- [x] Input validation on API calls
- [x] Error message sanitization

### ⚠️ URGENT TODO
- [ ] **Fix remaining v-html vulnerabilities** (6 files)
  ```bash
  # Fix these files - CRITICAL XSS risk:
  src/components/admin/templates/TemplateCreateDialog.vue
  src/components/admin/templates/TemplateEditDialog.vue  
  src/components/admin/templates/TemplateImportDialog.vue
  src/components/campaigns/create/steps/ReviewStep.vue
  src/views/templates/TemplatesView.vue
  ```

- [ ] **Replace unsafe confirm() dialogs** (15+ files)
  ```bash
  # Replace with ConfirmDialog component
  grep -r "confirm(" src/ --include="*.vue"
  ```

- [ ] **Environment variable validation**
  ```typescript
  // Add to main.ts
  const requiredEnvVars = ['VITE_API_BASE_URL']
  requiredEnvVars.forEach(env => {
    if (!import.meta.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`)
    }
  })
  ```

- [ ] **Add Content Security Policy headers**
- [ ] **Implement rate limiting on sensitive actions**

## 🧹 Code Quality

### ✅ Completed  
- [x] Removed console.log statements from critical files
- [x] Cleaned up debug code in auth flows
- [x] Standardized error handling

### 📋 Remaining
- [ ] **Remove all remaining console statements**
  ```bash
  find src -name "*.vue" -o -name "*.ts" | xargs grep -l "console\."
  ```

- [ ] **Clean up unused imports**
  ```bash
  # Use ESLint or similar tool
  npm run lint -- --fix
  ```

- [ ] **Remove TODO/FIXME comments**
  ```bash
  grep -r "TODO\|FIXME" src/
  ```

## 🎯 Performance

- [ ] **Bundle analysis and optimization**
  ```bash
  npm run build:analyze
  ```

- [ ] **Image optimization**
- [ ] **Lazy loading implementation**
- [ ] **Code splitting verification**

## 🧪 Testing

- [ ] **Unit tests for critical components**
- [ ] **E2E tests for user flows**
- [ ] **Security penetration testing**

## 📦 Build & Deployment

- [ ] **Production build verification**
  ```bash
  npm run build
  npm run preview
  ```

- [ ] **Environment configuration**
- [ ] **CI/CD pipeline setup**
- [ ] **Error tracking (Sentry/similar)**

## 🔧 Quick Fix Commands

### 1. Fix XSS vulnerabilities
```bash
# Add sanitizer to remaining files
for file in src/components/admin/templates/*.vue src/views/templates/*.vue; do
  if grep -q "v-html" "$file" && ! grep -q "sanitizeEmailContent" "$file"; then
    echo "NEEDS FIXING: $file"
  fi
done
```

### 2. Replace confirm() calls
```bash
# Find all unsafe confirm() usage
grep -r "confirm(" src/ --include="*.vue" -n
```

### 3. Remove console statements
```bash
# Remove console.log statements
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '/console\./d'
```

### 4. Security audit
```bash
npm audit
npm audit fix
```

---

## 🚨 CRITICAL: Complete the XSS fixes before production deployment!

The remaining v-html usages without sanitization are critical security vulnerabilities that must be fixed.
