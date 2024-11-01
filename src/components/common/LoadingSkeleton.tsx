interface LoadingSkeletonProps {
  type?: 'text' | 'title' | 'image' | 'avatar'
  lines?: number
  className?: string
}

export function LoadingSkeleton ({
  type = 'text',
  lines = 1,
  className = ''
}: LoadingSkeletonProps) {
  const skeletons = {
    text: 'h-4 bg-gray-200 rounded w-full',
    title: 'h-6 bg-gray-200 rounded w-3/4',
    image: 'h-48 bg-gray-200 rounded',
    avatar: 'h-10 w-10 bg-gray-200 rounded-full'
  }

  if (type === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array(lines)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`${skeletons[type]} ${i === lines - 1 ? 'w-2/3' : ''}`}
            />
          ))}
      </div>
    )
  }

  return <div className={`${skeletons[type]} ${className}`} />
}
