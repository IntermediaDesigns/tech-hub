import { Tag } from 'lucide-react'
import type { PostFlag } from '../lib/supabase'

type PostFlagSelectProps = {
  value: PostFlag | undefined
  onChange: (flag: PostFlag | undefined) => void
}

const FLAGS: { value: PostFlag; label: string; color: string }[] = [
  {
    value: 'TECH QUESTION',
    label: 'Tech Question',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  {
    value: 'FRAMEWORK',
    label: 'Framework',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  },
  {
    value: 'FRONTEND',
    label: 'Frontend',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  {
    value: 'BACKEND',
    label: 'Backend',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  {
    value: 'TECHNOLOGY',
    label: 'Technology',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
]

export default function PostFlagSelect ({
  value,
  onChange
}: PostFlagSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        Post Category
      </label>
      <div className='flex flex-wrap gap-2'>
        {FLAGS.map(flag => (
          <button
            key={flag.value}
            type='button'
            onClick={() =>
              onChange(value === flag.value ? undefined : flag.value)
            }
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              value === flag.value
                ? flag.color
                : 'bg-gray-100 text-gray-800 hover:bg-indigo-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-indigo-600'
            }`}
          >
            <Tag className='w-4 h-4 mr-1' />
            {flag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
