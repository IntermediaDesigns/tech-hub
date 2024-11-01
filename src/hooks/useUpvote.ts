import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useUpvote = (postId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upvotePost = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: upvoteError } = await supabase
        .from('posts')
        .update({ upvotes: supabase.rpc('increment_upvotes', { post_id: postId }) })
        .eq('id', postId);

      if (upvoteError) throw upvoteError;

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { upvotePost, loading, error };
};
