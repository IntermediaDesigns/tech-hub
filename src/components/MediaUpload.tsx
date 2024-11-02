import React, { useState } from 'react'
import { Upload, X, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

type MediaUploadProps = {
  onUploadComplete: (url: string) => void
  type: 'image' | 'video'
  currentUrl?: string
}

export default function MediaUpload ({
  onUploadComplete,
  type,
  currentUrl
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState(currentUrl || '')

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      setShowUrlInput(false)

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error } = await supabase.storage
        .from('media')
        .upload(`${type}s/${fileName}`, file)

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from('media').getPublicUrl(`${type}s/${fileName}`)

      onUploadComplete(publicUrl)
      setUrlInput('')
      toast.success('Upload complete!')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedUrl = urlInput.trim()

    if (!trimmedUrl) {
      toast.error('Please enter a URL')
      return
    }

    if (!validateUrl(trimmedUrl)) {
      toast.error('Please enter a valid URL')
      return
    }

    setPreview(trimmedUrl)
    onUploadComplete(trimmedUrl)
    setShowUrlInput(false)
    toast.success('URL added successfully!')
  }

  const clearMedia = () => {
    setPreview(null)
    setUrlInput('')
    setShowUrlInput(false)
    onUploadComplete('')
  }

  if (preview) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-600 dark:text-gray-300'>
            {type === 'image' ? 'Image' : 'Video'} added
          </span>
          <button
            onClick={clearMedia}
            className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors'
            title='Remove media'
            type='button'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
        <div className='rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 transition-colors'>
          {type === 'image' ? (
            <img
              src={preview}
              alt='Preview'
              className='max-w-full h-auto rounded-lg'
              onError={() => {
                toast.error('Failed to load image')
                clearMedia()
              }}
            />
          ) : (
            <video
              src={preview}
              controls
              className='max-w-full rounded-lg'
              onError={() => {
                toast.error('Failed to load video')
                clearMedia()
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {showUrlInput ? (
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <input
              type='url'
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
              placeholder={`Enter ${type} URL...`}
              className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200'
            />
            <button
              type='button'
              onClick={() => handleUrlSubmit()}
              className='btn'
              disabled={!urlInput.trim()}
            >
              Add
            </button>
          </div>
          <button
            type='button'
            onClick={() => {
              setShowUrlInput(false)
              setUrlInput('')
            }}
            className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <label className='flex-1 btn-secondary cursor-pointer text-center'>
              <input
                type='file'
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileUpload}
                className='hidden'
                disabled={uploading}
              />
              <Upload className='w-4 h-4 mr-2 inline-block' />
              {uploading ? 'Uploading...' : `Upload ${type}`}
            </label>
            <button
              type='button'
              onClick={() => setShowUrlInput(true)}
              className='flex-1 btn-secondary'
            >
              <LinkIcon className='w-4 h-4 mr-2' />
              Add URL
            </button>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
            Choose one option to add your {type}
          </p>
        </div>
      )}
    </div>
  )
}
