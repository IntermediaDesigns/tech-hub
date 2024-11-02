import { useState, useCallback } from 'react'
import { usePosts } from '../../hooks/usePosts'
import PostCard from './PostCard'
import { PostCardSkeleton } from './PostCardSkeleton'
import { useLoading } from '../../context/LoadingContext'
import { SortOption, Post } from '../../lib/types'
import SearchBar from '../common/SearchBar'
import SortSelect from '../common/SortSelect'
import { Link } from 'react-router-dom'

// Add categories constant
const CATEGORIES = [
  'ai',
  'backend',
  'databases',
  'frontend',
  'general',
  'frontend',
  'gamedev',
  'mobile',
  'technology',
  'tutorials',
  'webdev'
] as const

export default function PostList () {
  const [sortBy, setSortBy] = useState<SortOption>({
    value: 'newest',
    label: 'Newest'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const { posts } = usePosts(sortBy.value)
  const { isLoading } = useLoading()

  const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'mostUpvoted', label: 'Most Upvoted' }
  ]

  const filterPosts = useCallback((posts: Post[], query: string) => {
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(query.toLowerCase())
    )
  }, [])

  const groupPosts = useCallback((posts: Post[]) => {
    const grouped = CATEGORIES.reduce((acc, category) => {
      acc[category] = []
      return acc
    }, {} as Record<string, Post[]>)

    posts.forEach(post => {
      const category = post.category || 'general'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(post)
    })

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, posts]) => posts.length > 0)
    )
  }, [])

  const filteredPosts = filterPosts(posts, searchQuery)
  const groupedPosts = groupPosts(filteredPosts)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder='Search posts...'
          className='w-full sm:w-64'
        />
        <SortSelect
          value={sortBy}
          onChange={handleSort}
          options={sortOptions}
        />
      </div>

      <div className='space-y-8'>
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : Object.keys(groupedPosts).length > 0 ? (
          Object.entries(groupedPosts).map(([category, posts]) => (
            <div key={category} className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Link
                  to={`/category/${category}`}
                  className='text-xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors'
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
                <span className='text-sm text-gray-500'>
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-12 bg-white rounded-lg shadow'>
            <p className='text-gray-500'>
              {searchQuery
                ? 'No posts found matching your search.'
                : 'No posts yet. Be the first to create one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
