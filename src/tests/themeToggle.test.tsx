import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

// Mock the useTheme hook
const mockToggle = vi.fn();
let mockTheme = 'dark';

vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggle: mockToggle,
  }),
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = 'dark';
  });

  it('should render correct text and switch state for dark mode', () => {
    render(<ThemeToggle />);
    
    // In dark mode, button label should include "Dark" and state tracker should reflect theme
    expect(screen.getByText('Dark')).toBeDefined();
    
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('should render correct text and switch state for light mode', () => {
    mockTheme = 'light';
    render(<ThemeToggle />);
    
    expect(screen.getByText('Light')).toBeDefined();
    
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('should trigger theme toggle hook on click', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
