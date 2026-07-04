import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';

export interface AuthUser {
  id: string;
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = sessionStorage.getItem('locallens_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error parsing session user', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Sanitize inputs
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username || !password) {
      setError('Username and password are required.');
      setLoading(false);
      return false;
    }

    try {
      // Parameterized select query against Supabase demo_users table
      const { data, error: dbError } = await supabase
        .from('demo_users')
        .select('id, username')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Invalid username or password.');
        setLoading(false);
        return false;
      }

      // Store session securely
      const authenticatedUser: AuthUser = {
        id: data.id,
        username: data.username
      };
      
      sessionStorage.setItem('locallens_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      setLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred during authentication.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      sessionStorage.removeItem('locallens_user');
      setUser(null);
    } catch (err) {
      console.error('Error during logout', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
