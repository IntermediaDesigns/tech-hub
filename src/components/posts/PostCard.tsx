import { useThemeContext } from '../../context/theme-context'
import { Post } from '../../lib/types'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { theme } = useThemeContext()

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
    <article className={`post-card ${theme.cardStyle} theme-transition`}>
      <div className='flex items-center justify-between'>
        <h2
          className={`font-semibold text-gray-900 dark:text-white text-size-${theme.fontSize}`}
        >
          {post.title}
        </h2>
        <div className='flex items-center space-x-4 text-gray-500 dark:text-gray-400'>
          <span>{post.upvotes} upvotes</span>
        </div>
      </div>

      {theme.showPreviewContent && post.content && (
        <p
          className={`content-preview ${
            theme.showPreviewContent ? 'expanded' : 'collapsed'
          }`}
        >
          {post.content}
        </p>
      )}

      <div className='mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
        <time dateTime={post.createdAt}>
          {post.createdAt ? formatDate(post.createdAt) : 'No date'}
        </time>

        {post.imageUrl && theme.showPreviewContent && (
          <div className='mt-2'>
            <img
              src={post.imageUrl}
              alt='Post preview'
              className='rounded-md max-h-48 w-full object-cover'
            />
          </div>
        )}
      </div>
    </article>
  )
}
