import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../lib/types';
import { useLoading } from '../context/LoadingContext';

export const usePosts = (sortBy: 'newest' | 'mostUpvoted') => {
  const { setLoading } = useLoading();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order(sortBy === 'newest' ? 'createdAt' : 'upvotes', { ascending: false });

        if (postsError) throw postsError;
        setPosts(data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortBy, setLoading]);

  return { posts, error };
};
