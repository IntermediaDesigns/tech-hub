import { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { useLoading } from '../../context/LoadingContext';
import { SortOption } from '../../lib/types';
import SearchBar from '../common/SearchBar';
import SortSelect from '../common/SortSelect';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [sortBy, setSortBy] = useState<SortOption>({ value: 'newest', label: 'Newest' });
  const [searchQuery, setSearchQuery] = useState('');
  const { posts } = usePosts(sortBy.value);
  const { isLoading } = useLoading();

  const sortOptions: SortOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'mostUpvoted', label: 'Most Upvoted' }
  ];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
  };

  const groupedPosts = filteredPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search posts..."
          className="w-full sm:w-64"
        />
        <SortSelect
          value={sortBy}
          onChange={handleSort}
          options={sortOptions}
        />
      </div>
      
      <div className="space-y-8">
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : Object.keys(groupedPosts).length > 0 ? (
          Object.entries(groupedPosts).map(([category, posts]) => (
            <div key={category} className="space-y-4">
              <Link to={`/category/${category}`} className="text-xl font-bold text-indigo-600 hover:underline">
                {category}
              </Link>
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              {searchQuery
                ? 'No posts found matching your search.'
                : 'No posts yet. Be the first to create one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
