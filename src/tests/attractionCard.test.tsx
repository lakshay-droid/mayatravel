import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttractionCard } from '../components/explore/AttractionCard';
import type { Attraction } from '../types';

const mockAttraction: Attraction = {
  id: 'att-1',
  name: 'Hawa Mahal',
  category: 'Temples',
  photo: 'hawa-mahal.jpg',
  visitDuration: '1.5h',
  difficulty: 'Easy',
  description: 'Wind palace',
  lat: 26.92,
  lng: 75.82,
  openingHours: '9:00 AM - 5:00 PM',
  bestTime: 'Morning',
  nearbyAttractions: []
};

describe('AttractionCard Rating Determinism', () => {
  it('should render a consistent rating for the same attraction across multiple renders', () => {
    const onTap = vi.fn();
    const { rerender } = render(
      <AttractionCard attraction={mockAttraction} onTap={onTap} index={0} />
    );
    
    const getRatingText = () => {
      const container = screen.getByLabelText(`View details for ${mockAttraction.name}`);
      const ratingSpan = container.querySelector('.text-amber-400');
      return ratingSpan ? ratingSpan.textContent : null;
    };

    const initialRating = getRatingText();
    expect(initialRating).not.toBeNull();

    // Re-render 50 times and check that rating remains identical
    for (let i = 0; i < 50; i++) {
      rerender(<AttractionCard attraction={mockAttraction} onTap={onTap} index={i} />);
      const currentRating = getRatingText();
      expect(currentRating).toBe(initialRating);
    }
  });

  it('should compute the rating deterministically based on name hash', () => {
    const name = mockAttraction.name;
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);
    const expectedRating = (4.0 + (positiveHash % 10) * 0.1).toFixed(1);

    const onTap = vi.fn();
    render(<AttractionCard attraction={mockAttraction} onTap={onTap} index={0} />);
    const container = screen.getByLabelText(`View details for ${mockAttraction.name}`);
    const ratingSpan = container.querySelector('.text-amber-400');
    const renderedRating = ratingSpan ? ratingSpan.textContent : null;

    expect(renderedRating).toBe(expectedRating);
  });
});
