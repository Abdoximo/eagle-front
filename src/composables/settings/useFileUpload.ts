import { ref } from 'vue'

export interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  folder?: string
}

export function useFileUpload() {
  const loading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  const uploadFile = async (
    file: File, 
    folder: string = 'uploads',
    options: UploadOptions = {}
  ): Promise<string> => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options

    // Reset state
    error.value = null
    progress.value = 0
    loading.value = true

    try {
      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`)
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      // Simulate upload progress (replace with actual upload logic)
      const response = await uploadWithProgress(formData)
      
      return response.url
    } catch (err: any) {
      error.value = err.message || 'Upload failed'
      throw err
    } finally {
      loading.value = false
      progress.value = 0
    }
  }

  // Simulate upload with progress (replace with actual implementation)
  const uploadWithProgress = async (formData: FormData): Promise<{ url: string }> => {
    return new Promise((resolve, reject) => {
      // Simulate progress
      const interval = setInterval(() => {
        progress.value += 10
        if (progress.value >= 100) {
          clearInterval(interval)
          // Return mock URL (replace with actual upload endpoint)
          resolve({
            url: `https://api.example.com/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
          })
        }
      }, 100)

      // Simulate potential error
      setTimeout(() => {
        if (Math.random() < 0.1) { // 10% chance of error for demo
          clearInterval(interval)
          reject(new Error('Upload failed'))
        }
      }, 500)
    })
  }

  const resetUpload = () => {
    loading.value = false
    progress.value = 0
    error.value = null
  }

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  }

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file)
  }

  const revokePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url)
  }

  return {
    loading,
    progress,
    error,
    uploadFile,
    resetUpload,
    formatFileSize,
    getFileExtension,
    isImageFile,
    createPreviewUrl,
    revokePreviewUrl
  }
}

// Multiple file upload version
export function useMultipleFileUpload() {
  const uploads = ref<Array<{
    file: File
    progress: number
    loading: boolean
    error: string | null
    url?: string
  }>>([])

  const uploadMultiple = async (files: File[], folder: string = 'uploads') => {
    uploads.value = files.map(file => ({
      file,
      progress: 0,
      loading: true,
      error: null
    }))

    const uploadPromises = uploads.value.map(async (upload, index) => {
      try {
        const { uploadFile } = useFileUpload()
        upload.url = await uploadFile(upload.file, folder)
        upload.loading = false
        upload.progress = 100
      } catch (error: any) {
        upload.error = error.message
        upload.loading = false
      }
    })

    await Promise.allSettled(uploadPromises)
    return uploads.value
  }

  const removeUpload = (index: number) => {
    uploads.value.splice(index, 1)
  }

  const clearUploads = () => {
    uploads.value = []
  }

  return {
    uploads,
    uploadMultiple,
    removeUpload,
    clearUploads
  }
}