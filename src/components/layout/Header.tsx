import { Link } from 'react-router-dom'
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

export default function Header () {
  const { user, logout } = useAuth()

  return (
    <header className='bg-white shadow'>
      <div className='max-w-4xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='text-2xl font-bold text-gray-900'>
            TechHub
          </Link>

          <nav className='flex items-center gap-6'>
            {user ? (
              <>
                <Link
                  to='/create'
                  className='inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  <PlusIcon className='h-5 w-5' aria-hidden='true' />
                  Create Post
                </Link>
                <button
                  onClick={() => logout()}
                  className='inline-flex items-center gap-2 rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200'
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to='/register'
                className='inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                <UserIcon className='h-5 w-5' aria-hidden='true' />
                Register/SignIn
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
