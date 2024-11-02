import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import { Post } from '../../lib/types'
import { supabase } from '../../lib/supabase'

interface PostContentProps {
  post: Post
}

interface Profile {
  username: string;
  display_name: string;
}

export default function PostContent({ post }: PostContentProps) {
  const [author, setAuthor] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthor() {
      if (!post.authorId) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, display_name')
          .eq('id', post.authorId)
          .single()

        if (error) {
          console.error('Error fetching author:', error)
          return
        }

        setAuthor(data)
      } catch (err) {
        console.error('Error fetching author:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [post.authorId])

  if (!post) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <article className='bg-white shadow rounded-lg overflow-hidden'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-gray-900'>{post.title}</h1>

        <div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
          <time dateTime={post.createdAt}>
            {post.createdAt ? formatDate(post.createdAt) : 'No date'}
          </time>
          <span>
            Posted by{' '}
            {loading ? (
              <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              author?.username || 'Unknown user'
            )}
          </span>
        </div>

        {post.flag && (
          <div className='mt-2 text-sm text-gray-600'>
            Flag: <span className='font-semibold'>{post.flag}</span>
          </div>
        )}

        {post.content && (
          <div className='mt-4 prose prose-sm max-w-none text-gray-700'>
            {post.content}
          </div>
        )}

        {post.imageUrl && (
          <div className='mt-4'>
            <img
              src={post.imageUrl}
              alt='Post attachment'
              className='rounded-lg max-h-96 w-full object-scale-down'
              onError={e => {
                e.currentTarget.src = '/api/placeholder/800/400'
                e.currentTarget.alt = 'Image failed to load'
              }}
            />
          </div>
        )}
      </div>
    </article>
  )
}
