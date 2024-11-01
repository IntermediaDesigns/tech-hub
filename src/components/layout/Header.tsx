import { Link, useLocation } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../theme/ThemeToggle';
import AuthForm from '../common/AuthForm';

export default function Header() {
  const location = useLocation();

  return (
    <header className='bg-white shadow'>
      <div className='max-w-4xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='text-2xl font-bold text-gray-900'>
            TechHub
          </Link>

          <nav className='flex items-center gap-6'>
            <ThemeToggle />
            <Link
              to='/'
              className={`text-gray-600 hover:text-gray-900 ${
                location.pathname === '/' ? 'text-gray-900' : ''
              }`}
            >
              Home
            </Link>

            <Link
              to='/create'
              className='inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              <PlusIcon className='h-5 w-5' aria-hidden='true' />
              Create Post
            </Link>

            <AuthForm />
          </nav>
        </div>
      </div>
    </header>
  );
}
