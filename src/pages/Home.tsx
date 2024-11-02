import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpCircle, Clock, TrendingUp } from 'lucide-react'
import { supabase, type Post, type PostFlag } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { useFeedPreferences } from '../hooks/useFeedPreferences'
import FeedPreferences from '../components/FeedPreferences'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home () {
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<'created_at' | 'upvotes'>('created_at')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFlag, setSelectedFlag] = useState<PostFlag | ''>('')
  const [loading, setLoading] = useState(true)
  const { preferences } = useFeedPreferences()

  useEffect(() => {
    fetchPosts()
  }, [sortBy, selectedFlag])

  async function fetchPosts () {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: false })

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    if (selectedFlag) {
      query = query.eq('flag', selectedFlag)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap gap-4 items-center justify-between'>
        <div className='flex items-center space-x-4'>

          <FeedPreferences />
        </div>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setSortBy('created_at')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              sortBy === 'created_at'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Clock className='w-4 h-4' />
            <span>Latest</span>
          </button>
          <button
            onClick={() => setSortBy('upvotes')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              sortBy === 'upvotes'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <TrendingUp className='w-4 h-4' />
            <span>Popular</span>
          </button>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <div className='relative flex-1'>
          <input
            type='text'
            placeholder='Search posts...'
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && fetchPosts()}
          />
        </div>
        <select
          title='Filter by post type'
          value={selectedFlag}
          onChange={e => setSelectedFlag(e.target.value as PostFlag | '')}
          className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200'
        >
          <option value=''>All Types</option>
          <option value='TECH QUESTION'>Tech Questions</option>
          <option value='FRAMEWORK'>Frameworks</option>
          <option value='FRONTEND'>Frontend</option>
          <option value='BACKEND'>Backend</option>
          <option value='TECHNOLOGY'>Technology</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='space-y-4'>
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className='block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200'
            >
              <div className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    {post.flag && (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                          post.flag === 'TECH QUESTION'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : post.flag === 'FRAMEWORK'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : post.flag === 'FRONTEND'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : post.flag === 'BACKEND'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : post.flag === 'TECHNOLOGY'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {post.flag}
                      </span>
                    )}
                    <h2 className='text-xl mt-4 font-semibold text-gray-900 w-full dark:text-white mb-2'>
                      {post.title}
                    </h2>
                    <div className='flex items-center gap-4 mb-4'>
                    {preferences?.showImagesOnFeed && post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className='w-40 h-auto object-cover rounded-lg mb-2'
                      />
                    )}
                    {preferences?.showVideosOnFeed && post.video_url && (
                      <iframe
                        src={post.video_url}
                        className="w-full aspect-video rounded-lg mb-2"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    )}
                    {preferences?.showContentOnFeed && post.content && (
                      <p className='text-gray-600 dark:text-gray-300 mb-2 line-clamp-2'>
                        {post.content}
                      </p>
                    )}
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-indigo-500 dark:text-gray-400'>
                      <span>Posted by User {post.user_id}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.created_at))} ago
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-1 text-indigo-600 dark:text-indigo-400'>
                    <ArrowUpCircle className='w-5 h-5' />
                    <span className='font-medium'>{post.upvotes}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
