import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostFormData } from '../lib/types';

export const useEditPost = (postId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editPost = async (postData: PostFormData, secretKey: string) => {
    setLoading(true);
    setError(null);

    try {
      // First verify the secret key
      const { data: existingPost } = await supabase
        .from('posts')
        .select('secretKey')
        .eq('id', postId)
        .single();

      if (!existingPost || existingPost.secretKey !== secretKey) {
        throw new Error('Invalid secret key');
      }

      // Update the post - using camelCase, Supabase will handle conversion to snake_case
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content || null,
          imageUrl: postData.imageUrl || null,
          secretKey: secretKey,
          updatedAt: new Date().toISOString(),
          flag: postData.flag || null // Include flag in update
        })
        .eq('id', postId);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        return false;
      }
  };

  return { editPost, loading, error };
};
