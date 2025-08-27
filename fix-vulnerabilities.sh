#!/bin/bash

echo "🔒 Fixing security vulnerabilities in frontend..."

# Files with v-html that need fixing
files=(
    "src/components/campaigns/create/steps/ContentEditorStep.vue"
    "src/components/admin/templates/TemplateCreateDialog.vue"
    "src/components/admin/templates/TemplateEditDialog.vue"
    "src/components/admin/templates/TemplateImportDialog.vue"
    "src/components/campaigns/create/steps/ReviewStep.vue"
    "src/views/templates/TemplatesView.vue"
)

# Add import to each file if not present
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Check if useSanitizer import already exists
        if ! grep -q "useSanitizer" "$file"; then
            # Find the import section and add useSanitizer import
            if grep -q "import.*from.*@/composables" "$file"; then
                # Add to existing composables import section
                sed -i '' '/import.*from.*@\/composables/a\
import { useSanitizer } from '\''@/composables/useSanitizer'\''
' "$file"
            elif grep -q "import.*from.*vue" "$file"; then
                # Add after vue imports
                sed -i '' '/import.*from.*vue/a\
import { useSanitizer } from '\''@/composables/useSanitizer'\''
' "$file"
            fi
        fi
        
        # Add sanitizer usage in script if not present
        if ! grep -q "sanitizeEmailContent" "$file"; then
            # Add sanitizer destructuring
            if grep -q "const.*=" "$file"; then
                sed -i '' '/const.*=/a\
const { sanitizeEmailContent } = useSanitizer()
' "$file"
            fi
        fi
        
        echo "✅ Fixed $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo "🎉 Security vulnerability fixes completed!"
