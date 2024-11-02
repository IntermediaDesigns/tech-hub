/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      if (type === 'image') {
        return url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      } else {
        return getYouTubeVideoId(url) || url.match(/\.(mp4|webm|ogg)$/i)
      }
    } catch {
      if (type === 'video' && getYouTubeVideoId(url)) {
        return true
      }
      return false
    }
  }

  const processVideoUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url)
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (type === 'image' && !file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      if (type === 'video' && !file.type.startsWith('video/')) {
        toast.error('Please select a video file')
        return
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

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
      toast.success('Upload complete!')
    } catch (error: any) {
      console.error('Error uploading file:', error)
      toast.error(error.message || 'Upload failed. Please try again.')
      setPreview(null)
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
      toast.error(
        `Please enter a valid ${type} URL${
          type === 'video' ? ' (YouTube or direct video file)' : ''
        }`
      )
      return
    }

    const finalUrl = type === 'video' ? processVideoUrl(trimmedUrl) : trimmedUrl
    setPreview(finalUrl)
    onUploadComplete(finalUrl)
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
            <iframe
              src={preview}
              className='w-full aspect-video rounded-lg'
              allowFullScreen
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              onError={() => {
                toast.error('Failed to load video')
                clearMedia()
              }}
            />
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
              placeholder={
                type === 'video'
                  ? 'Enter YouTube URL or video ID...'
                  : 'Enter image URL...'
              }
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
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {type === 'video'
              ? 'You can paste a YouTube URL or video ID'
              : 'Enter a direct URL to your image'}
          </p>
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
            <label className='flex-1'>
              <input
                type='file'
                onChange={handleFileUpload}
                accept={type === 'image' ? 'image/*' : 'video/*'}
                className='hidden'
                disabled={uploading}
              />
              <div className='btn-secondary w-full flex justify-center items-center cursor-pointer'>
                <Upload className='w-4 h-4 mr-2' />
                {uploading ? 'Uploading...' : `Upload ${type}`}
              </div>
            </label>
            <button
              type='button'
              onClick={() => setShowUrlInput(true)}
              className='btn-secondary whitespace-nowrap'
            >
              <LinkIcon className='w-4 h-4 mr-2' />
              Add URL
            </button>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
            {type === 'video'
              ? 'Upload a video file or add a YouTube URL'
              : 'Upload an image file or enter an image URL'}
          </p>
        </div>
      )}
    </div>
  )
}
