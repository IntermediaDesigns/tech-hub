import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

type ReferencedPostProps = {
  postId: string;
};

export default function ReferencedPost({ postId }: ReferencedPostProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-gray-500">
        Referenced post not found
      </div>
    );
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
    >
      <div className="text-sm text-gray-500 mb-1">
        Referenced post from {formatDistanceToNow(new Date(post.created_at))} ago
      </div>
      <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
    </Link>
  );
}