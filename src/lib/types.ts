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
}
