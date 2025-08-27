<template>
  <div class="rounded-lg border bg-card">
    <div class="border-b p-4">
      <div class="flex items-center space-x-2">
        <button
          v-for="format in formats"
          :key="format.name"
          type="button"
          @click="format.action"
          class="rounded p-2 hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
          :class="{ 
            'bg-muted ring-2 ring-blue-500/20': format.isActive,
            'hover:shadow-md': !format.isActive 
          }"
          :title="format.name"
        >
          <component :is="format.icon" class="h-4 w-4" />
        </button>
      </div>
    </div>
    <div class="p-4">
      <div
        ref="editorRef"
        class="prose prose-sm max-w-none dark:prose-invert min-h-[200px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 rounded-md border border-gray-200 dark:border-gray-700 p-3"
        :class="{ 'opacity-50': disabled }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)
let editor: Editor | null = null

const formats = [
  {
    name: 'Bold',
    icon: BoldIcon,
    action: () => editor?.chain().focus().toggleBold().run(),
    isActive: () => editor?.isActive('bold')
  },
  {
    name: 'Italic',
    icon: ItalicIcon,
    action: () => editor?.chain().focus().toggleItalic().run(),
    isActive: () => editor?.isActive('italic')
  },
  {
    name: 'Heading 1',
    icon: Heading1Icon,
    action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor?.isActive('heading', { level: 1 })
  },
  {
    name: 'Heading 2',
    icon: Heading2Icon,
    action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor?.isActive('heading', { level: 2 })
  },
  {
    name: 'Heading 3',
    icon: Heading3Icon,
    action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor?.isActive('heading', { level: 3 })
  },
  {
    name: 'Bullet List',
    icon: ListIcon,
    action: () => editor?.chain().focus().toggleBulletList().run(),
    isActive: () => editor?.isActive('bulletList')
  },
  {
    name: 'Ordered List',
    icon: ListOrderedIcon,
    action: () => editor?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor?.isActive('orderedList')
  },
  {
    name: 'Blockquote',
    icon: QuoteIcon,
    action: () => editor?.chain().focus().toggleBlockquote().run(),
    isActive: () => editor?.isActive('blockquote')
  }
]

onMounted(() => {
  if (!editorRef.value) return

  try {
    editor = new Editor({
      element: editorRef.value,
      extensions: [StarterKit],
      content: props.modelValue || '<p>Start writing your email content...</p>',
      editable: !props.disabled,
      onCreate: ({ editor }) => {
        // Ensure content is visible on creation
        if (!editor.getHTML() || editor.getHTML() === '<p></p>') {
          editor.commands.setContent('<p>Start writing your email content...</p>')
        }
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        emit('update:modelValue', html)
      },
      onFocus: () => {
        // Clear placeholder text when user starts typing
        if (editor?.getHTML() === '<p>Start writing your email content...</p>') {
          editor.commands.clearContent()
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize email editor:', error)
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getHTML()) {
    editor.commands.setContent(newValue)
  }
})

watch(() => props.disabled, (newValue) => {
  if (editor) {
    editor.setEditable(!newValue)
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})
</script>

<style>
.ProseMirror {
  @apply min-h-[200px] outline-none focus:outline-none p-2;
  width: 100%;
  background: transparent;
}

.ProseMirror:focus {
  outline: none !important;
}

.ProseMirror p {
  @apply my-2;
  margin: 0.5rem 0;
}

.ProseMirror p:first-child {
  margin-top: 0;
}

.ProseMirror p:last-child {
  margin-bottom: 0;
}

.ProseMirror h1 {
  @apply text-3xl font-bold my-4;
}

.ProseMirror h2 {
  @apply text-2xl font-bold my-3;
}

.ProseMirror h3 {
  @apply text-xl font-bold my-2;
}

.ProseMirror ul {
  @apply list-disc pl-6 my-2;
}

.ProseMirror ol {
  @apply list-decimal pl-6 my-2;
}

.ProseMirror blockquote {
  @apply border-l-4 border-gray-300 pl-4 my-2 italic;
}

.ProseMirror strong {
  @apply font-bold;
}

.ProseMirror em {
  @apply italic;
}

/* Ensure the editor is visible */
.ProseMirror-focused {
  outline: none !important;
}
</style> 