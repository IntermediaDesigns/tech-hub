import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Comment } from '../../lib/types';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string, secretKey?: string) => Promise<boolean>;
  onEdit: (commentId: string, content: string) => Promise<boolean>;
}

export default function CommentItem({ comment, onDelete, onEdit }: CommentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsDeleting(true);
    setError(null);

    const success = await onDelete(comment.id, secretKey);

    if (!success) {
      setError('Failed to delete comment. Please check your secret key.');
    }
    setIsDeleting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onEdit(comment.id, editContent);
    if (success) {
      setIsEditing(false);
    } else {
      setError('Failed to edit comment.');
    }
  };

  return (
    <div className='py-4 border-b last:border-b-0'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1'>
          <div className='text-sm text-gray-600 mb-1'>
            {comment.authorId} •{' '}
            <time dateTime={comment.createdAt}>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true
              })}
            </time>
          </div>
          {isEditing ? (
            <form onSubmit={handleEdit} className='space-y-2'>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
                placeholder='Edit your comment'
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='inline-flex justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Save
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='inline-flex justify-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className='text-gray-900'>{comment.content}</div>
          )}
        </div>

        <div className='flex gap-2'>
          <button
            title='Edit comment'
            onClick={() => setIsEditing(true)}
            className='text-gray-400 hover:text-gray-600'
          >
            <PencilIcon className='h-4 w-4' />
          </button>
          <button
            title='Delete comment'
            onClick={() => setShowDeleteForm(true)}
            className='text-gray-400 hover:text-gray-600'
          >
            <TrashIcon className='h-4 w-4' />
          </button>
        </div>
      </div>

      {showDeleteForm && (
        <form onSubmit={handleDelete} className='mt-2 space-y-2'>
          <input
            type='password'
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder='Enter secret key to delete'
            required
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />

          {error && <div className='text-sm text-red-600'>{error}</div>}

          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={isDeleting}
              className='inline-flex justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type='button'
              onClick={() => {
                setShowDeleteForm(false);
                setSecretKey('');
                setError(null);
              }}
              className='inline-flex justify-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
