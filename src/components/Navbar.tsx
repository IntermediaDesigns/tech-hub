import { Link } from 'react-router-dom'
import { MessageSquare, PlusCircle } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar () {
  return (
    <nav className='bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200'>
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='flex items-center justify-between h-16'>
          <Link to='/' className='flex items-center space-x-2'>
            <MessageSquare className='w-8 h-8 text-indigo-600 dark:text-indigo-400' />
            <span className='text-xl font-bold text-gray-900 dark:text-white'>
              TechHub Forum
            </span>
          </Link>
          <div className='flex items-center space-x-4'>
            <Link to='/create' className='btn'>
              <PlusCircle className='w-4 h-4 mr-2' />
              New Post
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
