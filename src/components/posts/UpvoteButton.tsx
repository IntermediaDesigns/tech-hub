import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { useUpvote } from '../../hooks/useUpvote';

interface UpvoteButtonProps {
  postId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ postId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const { upvotePost, loading } = useUpvote(postId);

  const handleUpvote = async () => {
    const success = await upvotePost();
    if (success) {
      setUpvotes(prev => prev + 1);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
    >
      <ArrowUpIcon className="h-5 w-5" />
      <span>{upvotes}</span>
    </button>
  );
}