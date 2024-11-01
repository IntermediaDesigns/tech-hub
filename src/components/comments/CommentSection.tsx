import { useComments } from '../../hooks/useComments';
import { useUserContext } from '../../context/UserContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { comments, loading, error, addComment, deleteComment, editComment } = useComments(postId);
  const { userId } = useUserContext();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="py-4">
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Error loading comments: {error}
        </div>
      </div>
    );
  }

  const handleAddComment = async (content: string, secretKey?: string) => {
    if (!userId) {
      return false;
    }
    return await addComment(content, userId, secretKey);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    if (!userId) {
      return false;
    }
    return await editComment(commentId, content);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>
          <CommentForm onSubmit={handleAddComment} />
        </div>

        {comments.length > 0 ? (
          <div className="p-6">
            <div className="space-y-6">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={deleteComment}
                  onEdit={handleEditComment}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
