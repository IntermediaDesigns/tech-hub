import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostPage from './pages/PostPage'
import EditPost from './pages/EditPost'
import CategoryPage from './pages/CategoryPage'
import Register from './pages/Register'
import SettingsPage from './pages/SettingsPage' // Import the SettingsPage

import { LoadingProvider } from './context/LoadingContext'
import { UserProvider } from './context/UserContext'

export default function App () {
  return (
    <LoadingProvider>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/create' element={<CreatePost />} />
            <Route path='/post/:id' element={<PostPage />} />
            <Route path='/post/:id/edit' element={<EditPost />} />
            <Route path='/category/:category' element={<CategoryPage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/settings' element={<SettingsPage />} /> {/* Add the Settings route */}
          </Route>
        </Routes>
      </UserProvider>
    </LoadingProvider>
  )
}
