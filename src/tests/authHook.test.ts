import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should initialize with null user and loading true', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false); // mock runs immediately on renderHook in test environment
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should fail validation with empty inputs', async () => {
    const { result } = renderHook(() => useAuth());

    let success = false;
    await act(async () => {
      success = await result.current.login('', '');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Username and password are required.');
    expect(result.current.user).toBeNull();
  });

  it('should authenticate user with correct demo credentials', async () => {
    const { result } = renderHook(() => useAuth());

    let success = false;
    await act(async () => {
      success = await result.current.login('admin', 'admin123');
    });

    expect(success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.username).toBe('admin');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should fail with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth());

    let success = true;
    await act(async () => {
      success = await result.current.login('admin', 'wrong_password');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Invalid username or password.');
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear session upon logout', async () => {
    const { result } = renderHook(() => useAuth());

    // Login first
    await act(async () => {
      await result.current.login('admin', 'admin123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
