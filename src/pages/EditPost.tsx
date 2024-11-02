import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Image, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function EditPost () {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost () {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
        navigate('/')
      } else {
        setTitle(data.title)
        setContent(data.content || '')
        setImageUrl(data.image_url || '')
      }
      setLoading(false)
    }

    fetchPost()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !secretKey) return

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('secret_key')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data.secret_key !== secretKey) {
        toast.error('Invalid secret key')
        return
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title,
          content: content || null,
          image_url: imageUrl || null
        })
        .eq('id', id)

      if (updateError) throw updateError

      toast.success('Post updated successfully!')
      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Edit Post</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Title *
          </label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            required
          />
        </div>

        <div>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Content
          </label>
          <textarea
            id='content'
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          />
        </div>

        <div>
          <label
            htmlFor='imageUrl'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Image URL
          </label>
          <div className='flex gap-2'>
            <input
              id='imageUrl'
              type='url'
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              placeholder='https://example.com/image.jpg'
            />
            <button
              type='button'
              onClick={() => window.open(imageUrl, '_blank')}
              disabled={!imageUrl}
              className='btn-secondary'
              title='Open image in new tab'
            >
              <Image className='w-4 h-4' />
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor='secretKey'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Secret Key *
          </label>
          <input
            id='secretKey'
            type='password'
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            required
            placeholder='Enter the secret key you used when creating the post'
          />
        </div>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={() => navigate(`/post/${id}`)}
            className='btn-secondary'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting || !title.trim() || !secretKey}
            className='btn'
          >
            <Save className='w-4 h-4 mr-2' />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
