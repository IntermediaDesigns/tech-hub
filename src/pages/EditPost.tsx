import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { supabase, type PostFlag } from '../lib/supabase';
import toast from 'react-hot-toast';
import MediaUpload from '../components/MediaUpload';
import PostFlagSelect from '../components/PostFlagSelect';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [flag, setFlag] = useState<PostFlag>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } else {
      setTitle(data.title);
      setContent(data.content || '');
      setImageUrl(data.image_url || '');
      setVideoUrl(data.video_url || '');
      setFlag(data.flag || undefined);
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !secretKey) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('secret_key')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data.secret_key !== secretKey) {
        toast.error('Invalid secret key');
        return;
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim() || null,
          image_url: imageUrl || null,
          video_url: videoUrl || null,
          flag: flag || null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    if (url && videoUrl) {
      setVideoUrl('');
      toast.info('Video removed as only one media type is allowed');
    }
  };

  const handleVideoChange = (url: string) => {
    setVideoUrl(url);
    if (url && imageUrl) {
      setImageUrl('');
      toast.info('Image removed as only one media type is allowed');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Post</h1>
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

        <PostFlagSelect value={flag} onChange={setFlag} />

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
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
            required
            placeholder="Enter the secret key you used when creating the post"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !secretKey}
            className="btn"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}