import React, { useState } from 'react'
import { useCreatePost } from '../../hooks/useCreatePost'
import { useAuth } from '../../hooks/useAuth'

const PostForm: React.FC = () => {
  const { user } = useAuth()
  const { createPost, loading, error } = useCreatePost()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('general')
  const [secretKey, setSecretKey] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      console.error('No user found')
      return
    }

    await createPost({
      title,
      content,
      imageUrl: imageUrl || undefined,
      category,
      secretKey: secretKey || undefined
    })
  }

  if (!user) {
    return <div>Please log in to create a post</div>
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-2xl mx-auto p-4'>
      <div>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700'
        >
          Title *
        </label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder='Enter post title'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
      </div>

      <div>
        <label
          htmlFor='content'
          className='block text-sm font-medium text-gray-700'
        >
          Content *
        </label>
        <textarea
          id='content'
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={5}
          placeholder='Write your post content here'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
      </div>

      <div>
        <label
          htmlFor='imageUrl'
          className='block text-sm font-medium text-gray-700'
        >
          Image URL
        </label>
        <input
          type='url'
          id='imageUrl'
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder='https://example.com/image.jpg'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
      </div>

      <div>
        <label
          htmlFor='category'
          className='block text-sm font-medium text-gray-700'
        >
          Category *
        </label>
        <select
          id='category'
          required
          defaultValue={''}
          onChange={e => setCategory(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        >
          <option value=''>Select a category</option>
          <option value='general'>General</option>
          <option value='ai'>AI</option>
          <option value='databases'>Databases</option>
          <option value='technology'>Technology</option>
          <option value='frontend'>Frontend</option>
          <option value='gamedev'>Game Dev</option>
          <option value='mobile'>Mobile</option>
          <option value='backend'>Backend</option>
          <option value='webdev'>Web Dev</option>
          <option value='tutorials'>Tech Tutorials</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='secretKey'
          className='block text-sm font-medium text-gray-700'
        >
          Secret Key
        </label>
        <input
          required
          type='text'
          id='secretKey'
          value={secretKey}
          onChange={e => setSecretKey(e.target.value)}
          placeholder='Add a secret key for post editing'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        />
      </div>

      {error && <div className='text-red-600 text-sm'>{error}</div>}

      <button
        type='submit'
        disabled={loading}
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>

      <p className='text-sm text-gray-500 mt-2'>* Required fields</p>
    </form>
  )
}

export default PostForm
