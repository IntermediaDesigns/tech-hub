import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      (_: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [session]);

  const signUp = async (username: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      // Validate username
      if (!username.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
        throw new Error('Username must be between 3-30 characters and contain only letters, numbers, underscores, and hyphens');
      }

      // Create auth entry first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Then create profile entry
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            username,
            display_name: username,
            email
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here, as the auth part succeeded
        }
      } catch (profileErr) {
        console.error('Profile creation error:', profileErr);
        // Don't throw here either
      }

      return authData.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      // Try to sign in directly with email if username looks like an email
      if (username.includes('@')) {
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: username,
          password,
        });

        if (signInError) throw signInError;
        if (!authData.user) throw new Error('Failed to sign in');

        return authData.user;
      }

      // Otherwise, get the email associated with the username
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (!profile?.email) {
        throw new Error('Username not found');
      }

      // Sign in using the email
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error('Failed to sign in');

      return authData.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, signUp, signIn, loading, error, logout };
};