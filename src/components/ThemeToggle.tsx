import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle () {
  const { theme, setTheme } = useTheme()

  return (
    <div className='flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title='Light mode'
      >
        <Sun className='w-4 h-4' />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title='Dark mode'
      >
        <Moon className='w-4 h-4' />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        title='System preference'
      >
        <Monitor className='w-4 h-4' />
      </button>
    </div>
  )
}
