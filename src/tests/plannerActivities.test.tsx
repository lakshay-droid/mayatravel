import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Planner } from '../pages/Planner/Planner';

// Mock useAuth
const mockUser = { id: 'usr-123', username: 'testuser' };
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    isAuthenticated: true,
  }),
}));

// Mock generateTripPlan
const mockGenerateTripPlan = vi.fn();
vi.mock('../services/gemini/geminiClient', () => ({
  generateTripPlan: (...args: any[]) => mockGenerateTripPlan(...args),
}));

// Mock Supabase
vi.mock('../services/supabase/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
  isMockMode: true,
}));

describe('Planner Activities Compilation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should compile and render activities from primary activities array when present', async () => {
    const itineraryWithActivities = [
      {
        day: 1,
        theme: 'Historical Wonders',
        estimatedBudget: '₹3,000',
        tip: 'Stay hydrated.',
        activities: [
          { time: '09:00', name: 'Amer Fort Visit', description: 'Explore the grand fort.', duration: '3h', cost: '₹500' },
          { time: '14:00', name: 'City Palace Tour', description: 'Walk through royal history.', duration: '2h', cost: '₹300' }
        ]
      }
    ];

    mockGenerateTripPlan.mockResolvedValue(itineraryWithActivities);

    render(<Planner />);

    // Click generate button
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateBtn);

    // Wait for ItineraryDay card to render
    await waitFor(() => {
      expect(screen.getByText('Historical Wonders')).toBeDefined();
    });

    // Check that primary activities are rendered
    expect(screen.getByText('Amer Fort Visit')).toBeDefined();
    expect(screen.getByText('Explore the grand fort.')).toBeDefined();
    expect(screen.getByText('City Palace Tour')).toBeDefined();
    expect(screen.getByText('Walk through royal history.')).toBeDefined();
  });

  it('should compile and render activities from morning, afternoon, evening when primary activities array is absent', async () => {
    const itineraryWithoutActivities = [
      {
        day: 1,
        theme: 'Spiritual Heritage',
        estimatedBudget: '₹2,000',
        tip: 'Respect local customs.',
        morning: { time: '07:00', activityName: 'Ghat Sunrise', description: 'Watch the sunrise by the river.', duration: '2h', cost: 'Free' },
        afternoon: { time: '13:00', activityName: 'Local Food Walk', description: 'Taste kachori and sweets.', duration: '2.5h', cost: '₹400' },
        evening: { time: '18:00', activityName: 'Ganga Aarti', description: 'Experience the evening oil lamp ritual.', duration: '1.5h', cost: 'Free' }
      }
    ];

    mockGenerateTripPlan.mockResolvedValue(itineraryWithoutActivities);

    render(<Planner />);

    // Click generate button
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateBtn);

    // Wait for ItineraryDay card to render
    await waitFor(() => {
      expect(screen.getByText('Spiritual Heritage')).toBeDefined();
    });

    // Check that morning/afternoon/evening activities are compiled and rendered correctly
    expect(screen.getByText('Ghat Sunrise')).toBeDefined();
    expect(screen.getByText('Watch the sunrise by the river.')).toBeDefined();
    expect(screen.getByText('Local Food Walk')).toBeDefined();
    expect(screen.getByText('Taste kachori and sweets.')).toBeDefined();
    expect(screen.getByText('Ganga Aarti')).toBeDefined();
    expect(screen.getByText('Experience the evening oil lamp ritual.')).toBeDefined();
  });
});
