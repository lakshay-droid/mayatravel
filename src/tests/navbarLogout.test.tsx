import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import { renderHook, act } from '@testing-library/react';

// Setup mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Logout integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should call logout and navigate to /login when clicking logout button', async () => {
    // Seed storage with mock user first
    const mockUser = { id: 'usr-123', username: 'testuser' };
    sessionStorage.setItem('locallens_user', JSON.stringify(mockUser));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Locate the logout button (it uses title="Sign Out" and aria-label="Logout")
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeDefined();

    // Trigger logout click
    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    // Check that redirect is triggered
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // Confirm that sessionStorage is cleared by the logout process
    expect(sessionStorage.getItem('locallens_user')).toBeNull();
  });

  it('should clear user state in useAuth hook itself', async () => {
    // Verify that the actual useAuth hook's logout functionality clears the user state
    const mockUser = { id: 'usr-123', username: 'testuser' };
    sessionStorage.setItem('locallens_user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    // Initially, user should be populated from sessionStorage
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);

    // Call logout
    await act(async () => {
      await result.current.logout();
    });

    // Verify user state is cleared
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem('locallens_user')).toBeNull();
  });
});
