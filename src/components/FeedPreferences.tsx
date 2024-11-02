import { Eye, EyeOff, Image } from 'lucide-react'
import { useFeedPreferences } from '../hooks/useFeedPreferences'

export default function FeedPreferences () {
  const { preferences, toggleContentVisibility, toggleImageVisibility } =
    useFeedPreferences()

  return (
    <div className='flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200'>
      <button
        onClick={toggleContentVisibility}
        className={`p-2 rounded-md transition-colors ${
          preferences.showContentOnFeed
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title={
          preferences.showContentOnFeed
            ? 'Hide content preview'
            : 'Show content preview'
        }
      >
        {preferences.showContentOnFeed ? (
          <Eye className='w-4 h-4' />
        ) : (
          <EyeOff className='w-4 h-4' />
        )}
      </button>
      <button
        onClick={toggleImageVisibility}
        className={`p-2 rounded-md transition-colors ${
          preferences.showImagesOnFeed
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title={preferences.showImagesOnFeed ? 'Hide images' : 'Show images'}
      >
        <Image className='w-4 h-4' />
      </button>
    </div>
  )
}
