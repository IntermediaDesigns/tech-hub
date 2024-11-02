import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowUpCircle, Edit2, Trash2 } from 'lucide-react'
import { supabase, type Post, type Comment } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import ReferencedPost from '../components/ReferencedPost'
import LoadingSpinner from '../components/LoadingSpinner'

export default function PostDetail () {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [secretKey, setSecretKey] = useState('')
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

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
      setPost(data)
    }
    setLoading(false)
  }

  async function fetchComments () {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
    } else {
      setComments(data || [])
    }
  }

  async function handleUpvote () {
    if (!post) return

    const { error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', post.id)

    if (error) {
      toast.error('Failed to upvote post')
    } else {
      setPost({ ...post, upvotes: post.upvotes + 1 })
      toast.success('Post upvoted!')
    }
  }

  async function handleAddComment (content: string) {
    const userId =
      localStorage.getItem('userId') || Math.random().toString(36).substring(7)
    localStorage.setItem('userId', userId)

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content, user_id: userId }])
      .select()

    if (error) {
      toast.error('Failed to add comment')
    } else {
      setComments([...comments, data[0]])
      toast.success('Comment added!')
    }
  }

  async function handleDelete () {
    if (!post || !secretKey) return

    if (secretKey !== post.secret_key) {
      toast.error('Invalid secret key')
      return
    }

    const { error } = await supabase.from('posts').delete().eq('id', post.id)

    if (error) {
      toast.error('Failed to delete post')
    } else {
      toast.success('Post deleted!')
      navigate('/')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!post) return null

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200'>
        {post.referenced_post_id && (
          <div className='mb-6'>
            <ReferencedPost postId={post.referenced_post_id} />
          </div>
        )}

        {post.flag && (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-4 ${
              post.flag === 'QUESTION'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : post.flag === 'OPINION'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : post.flag === 'DISCUSSION'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {post.flag}
          </span>
        )}

        <div className='flex justify-between items-start mb-4'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {post.title}
          </h1>
          <button
            onClick={handleUpvote}
            className='flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
          >
            <ArrowUpCircle className='w-6 h-6' />
            <span className='font-medium'>{post.upvotes}</span>
          </button>
        </div>

        <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
          Posted by User {post.user_id}
          <span className='mx-2'>•</span>
          {formatDistanceToNow(new Date(post.created_at))} ago
        </div>

        {post.content && (
          <div className='prose dark:prose-invert max-w-none mb-6'>
            {post.content}
          </div>
        )}

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className='w-full rounded-lg mb-6'
          />
        )}

        {post.video_url && (
          <video
            src={post.video_url}
            controls
            className='w-full rounded-lg mb-6'
          >
            Your browser does not support the video tag.
          </video>
        )}

        <div className='flex gap-2 mt-6'>
          <button
            onClick={() => navigate(`/post/${post.id}/edit`)}
            className='btn-secondary'
          >
            <Edit2 className='w-4 h-4 mr-2' />
            Edit
          </button>
          <button
            onClick={() => setShowSecretKeyInput(true)}
            className='btn-secondary text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Delete
          </button>
        </div>

        {showSecretKeyInput && (
          <div className='mt-4'>
            <input
              type='password'
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              placeholder='Enter secret key to delete'
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200'
            />
            <div className='flex gap-2 mt-2'>
              <button onClick={handleDelete} className='btn'>
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setShowSecretKeyInput(false)
                  setSecretKey('')
                }}
                className='btn-secondary'
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Comments
          </h2>
          <CommentForm onSubmit={handleAddComment} />
          <CommentList comments={comments} />
        </div>
      </div>
    </div>
  )
}
