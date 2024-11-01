import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostFormData } from '../lib/types';
import { useNavigate } from 'react-router-dom';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createPost = async (postData: PostFormData, userId: string) => {
    setLoading(true);
    setError(null);

    const postPayload = {
      title: postData.title,
      content: postData.content || null,
      image_url: postData.imageUrl || null,
      secret_key: postData.secretKey || null,
      author_id: userId,
      upvotes: 0
    };

    console.log('Creating post with data:', postPayload); // Log the payload

    try {
      const { data, error: postError } = await supabase
        .from('posts')
        .insert([postPayload])
        .select()
        .single();

      console.log('Post created with response:', data); // Log the response data
      console.log('Created at:', data.created_at); // Log the created_at field

      if (postError) throw postError;

      navigate(`/post/${data.id}`);
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

  return { createPost, loading, error };
};
