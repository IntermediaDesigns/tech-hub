import { useParams, useNavigate } from 'react-router-dom'
import { usePost } from '../hooks/usePost'
import PostContent from '../components/posts/PostContent'
import UpvoteButton from '../components/posts/UpvoteButton'
import PostActions from '../components/posts/PostActions'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import CommentSection from '../components/comments/CommentSection'

export default function PostPage () {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { post, loading, error } = usePost(id!)

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-3/4'></div>
        <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        <div className='h-32 bg-gray-200 rounded'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-md bg-red-50 p-4'>
        <h1 className='text-lg font-medium text-red-800'>Error loading post</h1>
        <p className='mt-2 text-sm text-red-700'>{error}</p>
        <button
          onClick={() => navigate('/')}
          className='mt-4 inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-600'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          Return to Home
        </button>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='text-center py-12'>
        <h1 className='text-xl font-semibold text-gray-900'>Post not found</h1>
        <button
          onClick={() => navigate('/')}
          className='mt-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <button
        onClick={() => navigate('/')}
        className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900'
      >
        <ArrowLeftIcon className='h-4 w-4' />
        Back to Posts
      </button>

      <div className='space-y-6'>
        <PostContent post={post} />

        <div className='flex items-center justify-between'>
          <UpvoteButton postId={post.id} initialUpvotes={post.upvotes} />
          <PostActions postId={post.id} />
        </div>

        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}
