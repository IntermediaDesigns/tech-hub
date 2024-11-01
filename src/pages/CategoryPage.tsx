import { useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/posts/PostCard';
import { PostCardSkeleton } from '../components/posts/PostCardSkeleton';
import { useLoading } from '../context/LoadingContext';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { posts } = usePosts('newest');
  const { isLoading } = useLoading();

  const categoryPosts = posts.filter(post => post.category === category);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{category} Posts</h1>
      
      <div className="space-y-4">
        {isLoading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : categoryPosts.length > 0 ? (
          categoryPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              No posts found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
