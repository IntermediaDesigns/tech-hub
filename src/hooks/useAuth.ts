import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { user, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    return user;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { user, error } = await supabase.auth.signIn({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    return user;
  };

  return { signUp, signIn, loading, error };
};
