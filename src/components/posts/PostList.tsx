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
  const [selectedFlag, setSelectedFlag] = useState(''); // New state for selected flag
  const { posts } = usePosts(sortBy.value)
  const { isLoading } = useLoading()

  const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'mostUpvoted', label: 'Most Upvoted' }
  ]

  const filterPosts = useCallback((posts: Post[], query: string, flag: string) => {
    return posts.filter(post => {
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(query.toLowerCase());
      const matchesFlag = flag ? post.flag === flag : true; // Filter by flag if selected
      return matchesQuery && matchesFlag;
    });
  }, []);

  const groupPostsByCategory = useCallback((posts: Post[]) => {
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
      Object.entries(grouped).filter(([, posts]) => posts.length > 0)
    )
  }, [])

  const filteredPosts = filterPosts(posts, searchQuery, selectedFlag); // Pass selectedFlag to filter
  const groupedPosts = groupPostsByCategory(filteredPosts);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  }

  const handleSort = (option: SortOption) => {
    setSortBy(option);
  }

  const handleFlagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFlag(e.target.value); // Update selected flag
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
        <select
          value={selectedFlag}
          onChange={handleFlagChange}
          className='mt-1 block w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          aria-label="Filter by flag" // Added accessible name
        >
          <option value=''>All Flags</option>
          <option value='question'>Question</option>
          <option value='opinion'>Opinion</option>
        </select>
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
