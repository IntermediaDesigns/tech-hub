import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '../lib/supabase'

type CommentListProps = {
  comments: Comment[]
}

export default function CommentList ({ comments }: CommentListProps) {
  return (
    <div className='space-y-4 mt-6'>
      {comments.map(comment => (
        <div
          key={comment.id}
          className='bg-indigo-50 dark:bg-gray-700/50 p-4 rounded-lg shadow transition-colors duration-200'
        >
          <p className='text-gray-900 dark:text-gray-100'>{comment.content}</p>
          <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            <span>User {comment.user_id}</span>
            <span className='mx-2'>•</span>
            <span>{formatDistanceToNow(new Date(comment.created_at))} ago</span>
          </div>
        </div>
      ))}
    </div>
  )
}
