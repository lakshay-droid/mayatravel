import { useState, useEffect, useCallback } from 'react';
import { supabase, isMockMode } from '../services/supabase/supabaseClient';


export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

/**
 * Hook to manage authentication state and actions (login, signup, logout).
 * Handles both Supabase Auth and a local database fallback for testing/offline support.
 *
 * @returns An object containing the current user, loading state, authentication functions, and authenticated status.
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('locallens_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore parse error
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Login (Supabase Auth / Demo Users Fallback) ──────────────────────────
  /**
   * Log in a user using their username and password.
   * Supports local/mock mode using the demo_users table or live Supabase Auth.
   *
   * @param usernameInput - The entered username or email address.
   * @param passwordInput - The entered password.
   * @returns A promise resolving to an object indicating success or failure with an error message.
   */
  const login = useCallback(async (
    usernameInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username || !password)
      return { success: false, error: 'Username and password are required.' };

    // 1. If in local mock mode or running tests, query the mock demo_users table
    if (isMockMode || import.meta.env.MODE === 'test') {
      try {
        const { data, error: dbError } = await supabase
          .from('demo_users')
          .select('id, username')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (dbError || !data)
          return { success: false, error: 'Incorrect username or password.' };

        const authUser: AuthUser = { id: data.id, username: data.username };
        sessionStorage.setItem('locallens_user', JSON.stringify(authUser));
        setUser(authUser);
        return { success: true };
      } catch {
        return { success: false, error: 'Authentication failed. Please try again.' };
      }
    }

    // 2. In live Supabase mode, authenticate using native Supabase Auth signInWithPassword
    try {
      // Translate username inputs without @ to standard email addresses
      const email = username.includes('@')
        ? username
        : username === 'admin'
        ? 'admin@locallens.ai'
        : `${username.toLowerCase()}@locallens.local`;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !data?.user) {
        return { success: false, error: authError?.message || 'Incorrect username or password.' };
      }

      // Fetch or derive user details
      const authUser: AuthUser = {
        id: data.user.id,
        username: data.user.user_metadata?.username || username,
        email: data.user.email
      };

      sessionStorage.setItem('locallens_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Authentication failed.';
      return { success: false, error: errMsg };
    }
  }, []);

  // Mock signup — writes to localStorage MockDB when Supabase is unavailable
  /**
   * Internal helper to register a user locally when live Supabase registration is unavailable or in mock mode.
   *
   * @param username - The username to register.
   * @param password - The password to register.
   * @returns A promise resolving to an object indicating success or failure.
   */
  const signupMock = useCallback(async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const uid = `usr-${Date.now()}`;
      await supabase.from('demo_users').insert({ id: uid, username, password });
      const authUser: AuthUser = { id: uid, username };
      sessionStorage.setItem('locallens_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  }, []);

  // ─── Signup (Supabase Auth + demo_users insert) ───────────────────────────
  /**
   * Register a new user with email, password, and username.
   * Automatically handles local fallback or mock environment if live authentication fails.
   *
   * @param email - The email address for the new account.
   * @param password - The password for the new account.
   * @param username - The username for the new account.
   * @returns A promise resolving to an object indicating success or failure.
   */
  const signup = useCallback(async (
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    const emailTrimmed = email.trim().toLowerCase();
    const usernameTrimmed = username.trim();

    if (!emailTrimmed || !password || !usernameTrimmed)
      return { success: false, error: 'All fields are required.' };

    if (password.length < 6)
      return { success: false, error: 'Password must be at least 6 characters.' };

    if (isMockMode || import.meta.env.MODE === 'test') {
      return await signupMock(usernameTrimmed, password);
    }

    try {
      // 1. Create Supabase auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password,
        options: { data: { username: usernameTrimmed } },
      });

      if (authError) {
        // Fallback: try inserting directly into demo_users for mock mode
        if (authError.message?.includes('not enabled') || authError.message?.includes('Network')) {
          return await signupMock(usernameTrimmed, password);
        }
        return { success: false, error: authError.message };
      }

      const uid = authData.user?.id || `usr-${Date.now()}`;

      // 2. Also insert into demo_users for compatibility with login flow
      await supabase.from('demo_users').insert({
        id: uid,
        username: usernameTrimmed,
        password, // stored for demo_users mock auth flow
        email: emailTrimmed,
      });

      const authUser: AuthUser = { id: uid, username: usernameTrimmed, email: emailTrimmed };
      sessionStorage.setItem('locallens_user', JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch {
      // Full offline fallback
      return await signupMock(usernameTrimmed, password);
    }
  }, [signupMock]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  /**
   * Log out the current user, clearing the Supabase session, sessionStorage, and resetting local state.
   *
   * @returns A promise that resolves when the logout procedure is complete.
   */
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ } finally {
      sessionStorage.removeItem('locallens_user');
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
};
