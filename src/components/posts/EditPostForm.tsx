import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePost } from '../../hooks/usePost'
import { useEditPost } from '../../hooks/useEditPost'
import { PostFormData } from '../../lib/types'

interface EditPostFormProps {
  postId: string
}

export default function EditPostForm ({ postId }: EditPostFormProps) {
  const navigate = useNavigate()
  const { post, loading: loadingPost } = usePost(postId)
  const { editPost, loading: saving, error: saveError } = useEditPost(postId)

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    imageUrl: ''
  })
  const [secretKey, setSecretKey] = useState('')
  const [validationErrors, setValidationErrors] = useState<
    Partial<PostFormData>
  >({})

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content || '',
        imageUrl: post.imageUrl || ''
      })
    }
  }, [post])

  const validateForm = (): boolean => {
    const errors: Partial<PostFormData> = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'Please enter a valid URL'
    }

    if (!secretKey) {
      errors.secretKey = 'Secret key is required to edit the post'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof PostFormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const success = await editPost(formData, secretKey)
    if (success) {
      navigate(`/post/${postId}`)
    }
  }

  if (loadingPost) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='h-10 bg-gray-200 rounded'></div>
        <div className='h-32 bg-gray-200 rounded'></div>
        <div className='h-10 bg-gray-200 rounded w-1/2'></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='text-center py-12'>
        <h1 className='text-xl font-semibold text-gray-900'>Post not found</h1>
        <button
          onClick={() => navigate('/')}
          className='mt-4 text-sm text-indigo-600 hover:text-indigo-500'
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {saveError && (
        <div className='rounded-md bg-red-50 p-4'>
          <div className='flex'>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                Error saving post
              </h3>
              <div className='mt-2 text-sm text-red-700'>{saveError}</div>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-1'>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700'
        >
          Title
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${validationErrors.title ? 'border-red-300' : 'border-gray-300'}`}
        />
        {validationErrors.title && (
          <p className='text-sm text-red-600'>{validationErrors.title}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label
          htmlFor='content'
          className='block text-sm font-medium text-gray-700'
        >
          Content (optional)
        </label>
        <textarea
          id='content'
          name='content'
          rows={4}
          value={formData.content}
          onChange={handleChange}
          className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${validationErrors.content ? 'border-red-300' : 'border-gray-300'}`}
        />
        {validationErrors.content && (
          <p className='text-sm text-red-600'>{validationErrors.content}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label
          htmlFor='imageUrl'
          className='block text-sm font-medium text-gray-700'
        >
          Image URL (optional)
        </label>
        <input
          type='url'
          id='imageUrl'
          name='imageUrl'
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder='https://example.com/image.jpg'
          className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${
              validationErrors.imageUrl ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {validationErrors.imageUrl && (
          <p className='text-sm text-red-600'>{validationErrors.imageUrl}</p>
        )}
      </div>

      <div className='space-y-1'>
        <label
          htmlFor='secretKey'
          className='block text-sm font-medium text-gray-700'
        >
          Secret Key
        </label>
        <input
          type='password'
          id='secretKey'
          value={secretKey}
          onChange={e => setSecretKey(e.target.value)}
          required
          className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${
              validationErrors.secretKey ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {validationErrors.secretKey && (
          <p className='text-sm text-red-600'>{validationErrors.secretKey}</p>
        )}
      </div>

      <div className='flex gap-4 pt-4'>
        <button
          type='submit'
          disabled={saving}
          className='flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50'
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type='button'
          onClick={() => navigate(`/post/${postId}`)}
          className='flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
