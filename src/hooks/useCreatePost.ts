import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { PostFormData } from '../lib/types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const createPost = async (postData: PostFormData) => {
    setLoading(true)
    setError(null)

    if (!user?.id) {
      setError('You must be logged in to create a post')
      setLoading(false)
      return
    }

    const timestamp = new Date().toISOString()

    try {
      // First check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError || !existingProfile) {
        // Profile doesn't exist, create it
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            username: user.user_metadata?.username || 'user_' + user.id.slice(0, 8),
            display_name: user.user_metadata?.username || 'User',
            email: user.email
          }])

        if (createProfileError) {
          console.error('Profile creation error:', createProfileError)
          throw new Error('Failed to create user profile')
        }
      }

      // Now create the post
      const postPayload = {
        title: postData.title,
        content: postData.content,
        imageUrl: postData.imageUrl || null,
        secretKey: postData.secretKey || null,
        authorId: user.id,
        upvotes: 0,
        category: postData.category,
        updatedAt: timestamp
      }

      console.log('Creating post with payload:', postPayload)

      const { data, error: postError } = await supabase
        .from('posts')
        .insert([postPayload])
        .select('*')
        .single()

      if (postError) {
        console.error('Post creation error:', postError)
        throw postError
      }

      if (!data) {
        throw new Error('No data returned after post creation')
      }

      navigate(`/post/${data.id}`)
    } catch (err) {
      console.error('Error details:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return { createPost, loading, error }
}
