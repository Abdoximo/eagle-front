<template>
  <div class="template-editor-view">
    <EmailTemplateEditor 
      :template-id="templateId"
      :edit-mode="editMode"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EmailTemplateEditor from '@/components/email/EmailTemplateEditor.vue'

const route = useRoute()

const templateId = computed(() => route.params.id as string)
const editMode = computed(() => !!route.params.id || route.query.mode === 'edit')
</script>

<style scoped>
.template-editor-view {
  height: 100vh;
  background: #f5f5f5;
}
</style>