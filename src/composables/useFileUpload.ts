import { ref, computed } from 'vue'
import { showError } from '@/services/toast'
import type { FileUpload } from '@/types/common'

export function useFileUpload() {
  const fileUploads = ref<FileUpload[]>([])

  const isUploading = computed(() => fileUploads.value.some(f => f.status === 'uploading'))
  const hasErrors = computed(() => fileUploads.value.some(f => f.status === 'error'))
  const allCompleted = computed(() => fileUploads.value.every(f => f.status === 'completed'))

  // Add file to upload queue
  const addFile = (file: File): string => {
    const id = Date.now().toString() + Math.random().toString(36)
    const fileUpload: FileUpload = {
      file,
      progress: 0,
      status: 'pending',
    }

    fileUploads.value.push(fileUpload)
    return id
  }

  // Remove file from queue
  const removeFile = (index: number) => {
    fileUploads.value.splice(index, 1)
  }

  // Clear all files
  const clearFiles = () => {
    fileUploads.value = []
  }

  // Upload single file
  const uploadFile = async (
    index: number,
    uploadFn: (file: File, onProgress: (progress: number) => void) => Promise<any>
  ) => {
    const fileUpload = fileUploads.value[index]
    if (!fileUpload) return

    try {
      fileUpload.status = 'uploading'
      fileUpload.progress = 0

      const result = await uploadFn(fileUpload.file, (progress) => {
        fileUpload.progress = progress
      })

      fileUpload.status = 'completed'
      fileUpload.progress = 100

      return result
    } catch (error: any) {
      fileUpload.status = 'error'
      fileUpload.error = error.message || 'Upload failed'
      showError(`Upload failed: ${fileUpload.file.name}`)
      throw error
    }
  }

  // Upload all files
  const uploadAll = async (
    uploadFn: (file: File, onProgress: (progress: number) => void) => Promise<any>
  ) => {
    const results = []
    
    for (let i = 0; i < fileUploads.value.length; i++) {
      if (fileUploads.value[i].status === 'pending') {
        try {
          const result = await uploadFile(i, uploadFn)
          results.push(result)
        } catch (error) {
          // Continue with other files
        }
      }
    }

    return results
  }

  // Validate file
  const validateFile = (
    file: File,
    options: {
      maxSize?: number // in bytes
      allowedTypes?: string[]
      maxFiles?: number
    } = {}
  ): string | null => {
    const { maxSize, allowedTypes, maxFiles } = options

    if (maxFiles && fileUploads.value.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }

    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return `File size must be less than ${maxSizeMB}MB`
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }

    return null
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    fileUploads,
    isUploading,
    hasErrors,
    allCompleted,
    addFile,
    removeFile,
    clearFiles,
    uploadFile,
    uploadAll,
    validateFile,
    formatFileSize,
  }
}