export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  upvotes: number;
  secretKey?: string;
  category: string;
  flag?: string; // Added flag property
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  secretKey?: string;
}

export interface SortOption {
  value: 'newest' | 'mostUpvoted';
  label: string;
}

export interface PostFormData {
  title: string;
  content: string;
  imageUrl?: string;
  secretKey?: string;
  category: string;
  flag?: string; // Added flag property
}

export interface ThemeSettings {
  colorScheme: 'light' | 'dark' | 'system';
  primaryColor: 'indigo' | 'blue' | 'purple' | 'rose' | 'emerald';
  fontSize: 'small' | 'medium' | 'large';
  showPreviewContent: boolean;
  cardStyle: 'minimal' | 'bordered' | 'elevated';
}
