import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '../lib/supabase';

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
        .eq('reference_id', postId)
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
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-gray-500 dark:text-gray-400 transition-colors duration-200">
        Referenced Post ID: {postId}
      </div>
    );
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {post.reference_id && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Reference ID: {post.reference_id}
        </div>
      )}
    </Link>
  );
}