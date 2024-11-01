import { LoadingSkeleton } from "../common/LoadingSkeleton";

export function PostCardSkeleton() {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          <LoadingSkeleton type="title" />
          <div className="flex items-center gap-4">
            <LoadingSkeleton type="avatar" />
            <LoadingSkeleton type="text" className="w-32" />
          </div>
        </div>
      </div>
    );
  }