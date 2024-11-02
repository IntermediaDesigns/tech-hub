import React, { useState } from 'react'
import { Send } from 'lucide-react'

type CommentFormProps = {
  onSubmit: (content: string) => Promise<void>
}

export default function CommentForm ({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    await onSubmit(content)
    setContent('')
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className='mt-6'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder='Add a comment...'
          className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200'
          disabled={isSubmitting}
        />
        <button
          type='submit'
          disabled={isSubmitting || !content.trim()}
          className='btn'
        >
          <Send className='w-4 h-4 mr-2' />
          Send
        </button>
      </div>
    </form>
  )
}
