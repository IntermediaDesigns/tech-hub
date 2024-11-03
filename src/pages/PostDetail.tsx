/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowUpCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  Reply,
  GitBranch
} from 'lucide-react'
import { supabase, type Post } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import LoadingSpinner from '../components/LoadingSpinner'

export default function PostDetail () {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [secretKey, setSecretKey] = useState('')
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false)
  const [threadPosts, setThreadPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  useEffect(() => {
    if (post?.reference_id) {
      fetchThreadPosts()
    }
  }, [post])

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

  async function fetchThreadPosts () {
    if (!post?.reference_id) return

    // Get the base reference ID without any numbers
    const baseReferenceId = post.reference_id.replace(/\d+$/, '')

    // Fetch all posts that have a reference_id starting with the base ID
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .like('reference_id', `${baseReferenceId}%`)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching thread posts:', error)
    } else {
      setThreadPosts(data || [])
    }
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
    <div className='max-w-7xl mx-auto px-4'>
      <Link
        to='/'
        className='inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4'
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back to Home
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Post Column - Takes up 2/3 of the space */}
        <div className='lg:col-span-2'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200'>
            <div className='flex flex-col'>
              <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={handleUpvote}
                    className='flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
                  >
                    <ArrowUpCircle className='w-6 h-6' />
                    <span className='font-medium'>{post.upvotes}</span>
                  </button>
                </div>
                <Link
                  to={`/create?reference=${post.reference_id || post.id}`}
                  className='btn-secondary'
                  title='Repost with reference'
                >
                  <Reply className='w-4 h-4' />
                </Link>
              </div>

              <div className='flex flex-col justify-between items-start mb-4'>
                {post.flag && (
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-4 ${
                      post.flag === 'TECH QUESTION'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : post.flag === 'FRAMEWORK'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : post.flag === 'FRONTEND'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : post.flag === 'BACKEND'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {post.flag}
                  </span>
                )}
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {post.title}
                </h1>
              </div>

              <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Posted by User {post.user_id}
                <span className='mx-2'>•</span>
                {formatDistanceToNow(new Date(post.created_at))} ago
                {post.reference_id && (
                  <>
                    <span className='mx-2'>•</span>
                    <span>Reference ID: {post.reference_id}</span>
                  </>
                )}
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
                <iframe
                  title='Video preview'
                  src={post.video_url}
                  className='w-full aspect-video rounded-lg mb-6'
                  allowFullScreen
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                />
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
        </div>

        {/* Thread Column - Takes up 1/3 of the space */}
        <div className='w-[400px] lg:col-span-1'>
          {threadPosts.length > 0 && (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200 sticky top-4'>
              <div className='flex items-center gap-2 mb-4'>
                <GitBranch className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Thread
                </h2>
              </div>
              <div className='space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto'>
                {threadPosts.map(threadPost => (
                  <div
                    key={threadPost.id}
                    className={`relative pl-6 ${
                      threadPost.id === post.id
                        ? 'border-l-4 border-indigo-500'
                        : 'border-l-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Link
                      to={`/post/${threadPost.id}`}
                      className='block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                    >
                      {threadPost.flag && (
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                            threadPost.flag === 'TECH QUESTION'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : threadPost.flag === 'FRAMEWORK'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : threadPost.flag === 'FRONTEND'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : threadPost.flag === 'BACKEND'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {threadPost.flag}
                        </span>
                      )}
                      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                        {threadPost.title}
                      </h3>
                      <p className='text-gray-500 dark:text-gray-400 mb-2'>
                        Reference ID: {threadPost.reference_id}
                      </p>
                      <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center gap-2'>
                          <span>Posted by User {threadPost.user_id}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(
                              new Date(threadPost.created_at)
                            )}{' '}
                            ago
                          </span>
                        </div>
                        <div className='flex items-center gap-1 text-indigo-600 dark:text-indigo-400'>
                          <ArrowUpCircle className='w-4 h-4' />
                          <span>{threadPost.upvotes}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
