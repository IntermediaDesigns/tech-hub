import React, { useState } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import {
  supabase,
  STORAGE_BUCKETS,
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES
} from '../lib/supabase';
import toast from 'react-hot-toast';

type MediaUploadProps = {
  onUploadComplete: (url: string) => void;
  type: 'image' | 'video';
  currentUrl?: string;
};

export default function MediaUpload({
  onUploadComplete,
  type,
  currentUrl
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl || '');

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      if (type === 'image') {
        return (
          url.match(/\.(jpg|jpeg|png|gif|webp)([?#].*)?$/i) ||
          url.match(/\/(img|image|photo|static|media|uploads|cdn)\/.*$/i) ||
          url.match(/\?(.*&)?(image|img|src)=/i) ||
          url.match(
            /\/(imgur|cloudinary|unsplash|staticflickr|googleusercontent)\.com/i
          )
        );
      } else {
        return getYouTubeVideoId(url) || url.match(/\.(mp4|webm|ogg)$/i);
      }
    } catch {
      if (type === 'video' && getYouTubeVideoId(url)) {
        return true;
      }
      return false;
    }
  };

  const testImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const processVideoUrl = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (!validateUrl(urlInput)) {
      toast.error(`Invalid ${type} URL`);
      return;
    }

    if (type === 'image') {
      const loading = toast.loading('Validating image URL...');
      const isValid = await testImageUrl(urlInput);
      toast.dismiss(loading);

      if (!isValid) {
        toast.error('Invalid or inaccessible image URL');
        return;
      }
    }

    const finalUrl = type === 'video' ? processVideoUrl(urlInput) : urlInput;
    setPreview(finalUrl);
    onUploadComplete(finalUrl);
    setShowUrlInput(false);
    setUrlInput('');
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} URL added!`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = type === 'image' ? ALLOWED_MIME_TYPES.IMAGE : ALLOWED_MIME_TYPES.VIDEO;
      if (!allowedTypes.some(mimeType => mimeType === file.type)) {
        toast.error(`Please select a valid ${type} file`);
        return;
      }

      // Validate file size
      const maxSize = type === 'image' ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.VIDEO;
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const bucketName = type === 'image' ? STORAGE_BUCKETS.IMAGES : STORAGE_BUCKETS.VIDEOS;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message);
      }

      if (!data?.path) {
        throw new Error('Upload failed - no path returned');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      onUploadComplete(publicUrl);
      toast.success('Upload complete!');
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      toast.error((error as Error).message || 'Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearMedia = () => {
    setPreview(null);
    setUrlInput('');
    onUploadComplete('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn-secondary cursor-pointer">
          <input
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload ${type}`}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="btn-secondary"
          title={`Add ${type} URL`}
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Add URL
        </button>
        {preview && (
          <button
            type="button"
            onClick={clearMedia}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title={`Remove ${type}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={`Enter ${type} URL`}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="btn"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput('');
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}

      {preview && type === 'image' && (
        <img
          src={preview}
          alt="Preview"
          className="max-w-full h-auto rounded-lg"
          crossOrigin="anonymous"
        />
      )}
      {preview && type === 'video' && (
        <iframe
          title="Video Preview"
          src={preview}
          className="w-full aspect-video rounded-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
}
