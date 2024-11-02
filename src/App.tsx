import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'

function App () {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
        <Navbar />
        <main className='container mx-auto px-4 py-8 max-w-5xl'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<CreatePost />} />
            <Route path='/post/:id' element={<PostDetail />} />
            <Route path='/post/:id/edit' element={<EditPost />} />
          </Routes>
        </main>
        <Toaster
          position='bottom-right'
          toastOptions={{
            style: {
              background: 'var(--toast-background)',
              color: 'var(--toast-foreground)'
            }
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
