import { formatDistanceToNow } from 'date-fns'
import { Post } from '../../lib/types'

interface PostContentProps {
  post: Post
}

export default function PostContent({ post }: PostContentProps) {
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
          <span>Posted by {post.authorId}</span>
        </div>

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
              className='rounded-lg max-h-96 w-full object-cover'
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
