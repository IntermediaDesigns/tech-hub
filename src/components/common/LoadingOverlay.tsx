import { useLoading } from '../../context/LoadingContext';
import { LoadingSpinner } from './LoadingSpinner';

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}