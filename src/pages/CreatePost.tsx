import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { supabase, type PostFlag } from '../lib/supabase';
import toast from 'react-hot-toast';
import MediaUpload from '../components/MediaUpload';
import PostFlagSelect from '../components/PostFlagSelect';
import ReferencedPost from '../components/ReferencedPost';

export default function CreatePost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referenceParam = searchParams.get('reference');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [flag, setFlag] = useState<PostFlag>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReferencePost, setIsReferencePost] = useState(false);

  useEffect(() => {
    if (referenceParam) {
      setReferenceId(referenceParam);
      setIsReferencePost(true);
      fetchReferencedPost(referenceParam);
    }
  }, [referenceParam]);

  const fetchReferencedPost = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('reference_id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFlag(data.flag as PostFlag);
      }
    } catch (error) {
      console.error('Error fetching referenced post:', error);
    }
  };

  const generateNextReferenceId = async (baseId: string): Promise<string> => {
    const { data, error } = await supabase
      .from('posts')
      .select('reference_id')
      .like('reference_id', `${baseId}%`)
      .order('reference_id', { ascending: false });

    if (error) {
      console.error('Error checking reference IDs:', error);
      return `${baseId}01`;
    }

    if (!data || data.length === 0) {
      return `${baseId}01`;
    }

    // Find the highest number suffix
    let maxNum = 0;
    data.forEach(post => {
      const match = post.reference_id.match(new RegExp(`${baseId}(\\d+)`));
      if (match) {
        const num = parseInt(match[1], 10);
        maxNum = Math.max(maxNum, num);
      }
    });

    // Generate next number with padding
    const nextNum = maxNum + 1;
    return `${baseId}${nextNum.toString().padStart(2, '0')}`;
  };

  const checkReferenceIdAvailability = async (id: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('reference_id')
      .eq('reference_id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No match found, ID is available
      return true;
    }

    if (data) {
      toast.error('This reference ID is already in use');
      return false;
    }

    if (error) {
      console.error('Error checking reference ID:', error);
      toast.error('Error checking reference ID availability');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !flag) {
      toast.error('Title and category are required');
      return;
    }

    setIsSubmitting(true);
    const userId = localStorage.getItem('userId') || Math.random().toString(36).substring(7);
    localStorage.setItem('userId', userId);

    try {
      let finalReferenceId: string;

      if (isReferencePost) {
        // Generate next version number for reference post
        finalReferenceId = await generateNextReferenceId(referenceId);
      } else {
        // Check if the user-provided reference ID is available
        const isAvailable = await checkReferenceIdAvailability(referenceId);
        if (!isAvailable) {
          setIsSubmitting(false);
          return;
        }
        finalReferenceId = referenceId;
      }

      const { data, error } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim() || null,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        user_id: userId,
        secret_key: secretKey || null,
        reference_id: finalReferenceId,
        flag: flag,
      }).select().single();

      if (error) throw error;
      
      toast.success('Post created successfully!');
      if (isReferencePost) {
        toast.success(`Reference ID: ${finalReferenceId}`);
      }
      navigate(`/post/${data.id}`);
    } catch (error: unknown) {
      console.error('Error creating post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    if (url && videoUrl) {
      setVideoUrl('');
      toast('Video removed as only one media type is allowed', {
        icon: 'ℹ️'
      });
    }
  };

  const handleVideoChange = (url: string) => {
    setVideoUrl(url);
    if (url && imageUrl) {
      setImageUrl('');
      toast('Image removed as only one media type is allowed', {
        icon: 'ℹ️'
      });
    }
  };

  const handleReferenceIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setReferenceId(value);
    
    if (value && !isReferencePost) {
      const isAvailable = await checkReferenceIdAvailability(value);
      if (isAvailable) {
        toast.success('Reference ID is available');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {isReferencePost ? 'Create Referenced Post' : 'Create New Post'}
      </h1>

      {isReferencePost && referenceId && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Referencing Post:
          </h2>
          <ReferencedPost postId={referenceId} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            required
          />
        </div>

        <PostFlagSelect 
          value={flag} 
          onChange={setFlag}
        />

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Write your post content here"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Media (Choose one)
          </label>
          <div className="space-y-4">
            <MediaUpload
              type="image"
              onUploadComplete={handleImageChange}
              currentUrl={imageUrl}
            />
            <MediaUpload
              type="video"
              onUploadComplete={handleVideoChange}
              currentUrl={videoUrl}
            />
          </div>
        </div>

        {!isReferencePost && (
          <div>
            <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reference ID *
            </label>
            <input
              id="referenceId"
              type="text"
              value={referenceId}
              onChange={handleReferenceIdChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
              placeholder="Enter a custom reference ID for your post"
              maxLength={20}
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You can use this ID to reference your post later (max 20 characters)
            </p>
          </div>
        )}

        <div>
          <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Secret Key *
          </label>
          <input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
            placeholder="Enter a key to edit/delete later"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !flag}
            className="btn"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
