import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useUpvote = (postId: string) => {
  const [loading, setLoading] = useState(false);

  const upvotePost = async () => {
    setLoading(true);
    try {
      const { data: currentPost } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId)
        .single();

      const { error: updateError } = await supabase
        .from('posts')
        .update({ upvotes: (currentPost?.upvotes || 0) + 1 })
        .eq('id', postId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error upvoting post:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { upvotePost, loading };
};