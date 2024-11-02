import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)

        // If user just signed in, ensure profile exists
        if (session?.user && event === 'SIGNED_IN') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (!profile) {
            // Create profile if it doesn't exist
            await supabase.from('profiles').insert([
              {
                id: session.user.id,
                username:
                  session.user.user_metadata?.username ||
                  'user_' + session.user.id.slice(0, 8),
                display_name: session.user.user_metadata?.username || 'User',
                email: session.user.email
              }
            ])
          }
        }
      }
    )

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [session])

  const signUp = async (
    username: string,
    email: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true)
    setError(null)
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              username,
              display_name: username
            }
          }
        }
      )

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error('Failed to create user')

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          username,
          display_name: username,
          email
        }
      ])

      if (profileError) throw profileError

      return authData.user
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during sign up'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true)
    setError(null)
    try {
      // Try to sign in directly with email if username looks like an email
      if (username.includes('@')) {
        const { data: authData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: username,
            password
          })

        if (signInError) throw signInError
        if (!authData.user) throw new Error('Failed to sign in')

        return authData.user
      }

      // Otherwise, get the email associated with the username
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single()

      if (!profile?.email) {
        throw new Error('Username not found')
      }

      // Sign in using the email
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: profile.email,
          password
        })

      if (signInError) throw signInError
      if (!authData.user) throw new Error('Failed to sign in')

      return authData.user
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during sign in'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during logout'
      setError(errorMessage)
    }
  }

  return { user, session, signUp, signIn, loading, error, logout }
}
