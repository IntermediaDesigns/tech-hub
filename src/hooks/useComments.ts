import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Comment } from '../lib/types';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        
        // Transform snake_case to camelCase
        const transformedComments = (data || []).map(comment => ({
          id: comment.id,
          content: comment.content,
          postId: comment.post_id,
          authorId: comment.author_id,
          createdAt: comment.created_at,
          secretKey: comment.secret_key
        }));
        
        setComments(transformedComments);
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

    fetchComments();
  }, [postId]);

  const addComment = async (content: string, userId: string, secretKey?: string) => {
    try {
      const { data, error: commentError } = await supabase
        .from('comments')
        .insert([
          {
            content,
            post_id: postId,
            author_id: userId,
            secret_key: secretKey,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (commentError) throw commentError;

      // Transform snake_case to camelCase
      const transformedComment = {
        id: data.id,
        content: data.content,
        postId: data.post_id,
        authorId: data.author_id,
        createdAt: data.created_at,
        secretKey: data.secret_key
      };

      setComments(prev => [...prev, transformedComment]);
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

  const deleteComment = async (commentId: string, secretKey?: string) => {
    try {
      if (secretKey) {
        const { data: comment } = await supabase
          .from('comments')
          .select('secret_key')
          .eq('id', commentId)
          .single();

        if (comment?.secret_key !== secretKey) {
          throw new Error('Invalid secret key');
        }
      }

      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;
      setComments(prev => prev.filter(comment => comment.id !== commentId));
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

  const editComment = async (commentId: string, content: string) => {
    try {
      const { error: editError } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

      if (editError) throw editError;

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, content } : comment
        )
      );
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

  return { comments, loading, error, addComment, deleteComment, editComment };
};
