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
        .select('secret_key')
        .eq('id', postId)
        .single();

      if (!existingPost || existingPost.secret_key !== secretKey) {
        throw new Error('Invalid secret key');
      }

      // Update the post
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content || null,
          image_url: postData.imageUrl || null,
          updated_at: new Date().toISOString()
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