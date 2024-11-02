import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AuthForm: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, signIn, loading, error: authError } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let user
      if (isSignUp) {
        user = await signUp(username, email, password)
      } else {
        user = await signIn(username, password)
      }

      if (user) {
        // If signup/signin was successful, navigate to home page
        navigate('/')
      }
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow max-w-96 mx-auto mt-16'>
      <h2 className='text-xl font-semibold mb-4'>
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700'
          >
            Username
          </label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            placeholder='Enter username'
          />
        </div>

        {isSignUp && (
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              placeholder='Enter email'
            />
          </div>
        )}

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            placeholder='Enter password'
          />
        </div>

        {error && <div className='text-sm text-red-600'>{error}</div>}
        {authError && <div className='text-sm text-red-600'>{authError}</div>}

        <button
          type='submit'
          disabled={loading}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignUp(!isSignUp)
          setError(null)
          setUsername('')
          setPassword('')
          setEmail('')
        }}
        className='mt-4 text-sm text-indigo-600 hover:text-indigo-500'
      >
        {isSignUp
          ? 'Already have an account? Log in'
          : 'Need an account? Sign up'}
      </button>
    </div>
  )
}

export default AuthForm
