import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PostFlag = 'TECH QUESTION' | 'FRAMEWORK' | 'FRONTEND' | 'BACKEND' | 'TECHNOLOGY';

export type Post = {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  reference_id?: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  secret_key?: string;
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