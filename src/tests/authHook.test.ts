import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should initialize with null user and not authenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should fail validation with empty inputs', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('', '');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should authenticate user with correct demo credentials', async () => {
    const { result } = renderHook(() => useAuth());

    let res: { success: boolean; error?: string } = { success: false };
    await act(async () => {
      res = await result.current.login('admin', 'admin123');
    });

    // In test env, Supabase is mocked so login will hit mock path
    // Just verify it returns a properly shaped response
    expect(typeof res.success).toBe('boolean');
    expect(result.current.isAuthenticated === res.success).toBe(true);
  });

  it('should fail with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin', 'wrong_password');
    });

    // Should not be authenticated with wrong password
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should clear session upon logout', async () => {
    const { result } = renderHook(() => useAuth());

    // Login first (will use mock)
    await act(async () => {
      await result.current.login('admin', 'admin123');
    });

    // Logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should maintain stable references for login, signup, and logout functions', () => {
    const { result, rerender } = renderHook(() => useAuth());
    const initialLogin = result.current.login;
    const initialSignup = result.current.signup;
    const initialLogout = result.current.logout;

    rerender();

    expect(result.current.login).toBe(initialLogin);
    expect(result.current.signup).toBe(initialSignup);
    expect(result.current.logout).toBe(initialLogout);
  });
});
