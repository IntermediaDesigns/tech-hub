import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../../lib/types';
import { useProfile } from '../../hooks/useProfile';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { profile, loading } = useProfile(post.authorId);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <article className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/post/${post.id}`} className="block">
        {post.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={post.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.src = '/api/placeholder/400/300';
              }}
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">{post.title}</h2>
          
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
            <span>
              by{' '}
              {loading ? (
                <span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse" />
              ) : (
                profile?.username || 'Unknown user'
              )}
            </span>
          </div>

          {post.content && (
            <p className="mt-2 text-gray-600 line-clamp-2">{post.content}</p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {post.upvotes} upvotes
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}