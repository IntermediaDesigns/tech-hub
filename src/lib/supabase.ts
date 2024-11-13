import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  VIDEOS: 'videos'
} as const;

// File size limits
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024 // 50MB
} as const;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg']
} as const;

export type PostFlag = 'TECH QUESTION' | 'FRAMEWORK' | 'FRONTEND' | 'BACKEND' | 'TECHNOLOGY';

export type Post = {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  secret_key?: string;
  reference_id?: string;
  flag?: PostFlag;
};

export type Comment = {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  created_at: string;
};

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  showContentOnFeed: boolean;
  showImagesOnFeed: boolean;
  showVideosOnFeed: boolean;
};
