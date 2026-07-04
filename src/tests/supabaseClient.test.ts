import { describe, it, expect, beforeEach } from 'vitest';
import { supabase, isMockMode } from '../services/supabase/supabaseClient';

describe('Supabase Client Hybrid Fallback', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should detect if it is running in Mock or Live mode', () => {
    expect(typeof isMockMode).toBe('boolean');
  });

  it('should authenticate user and save session in mock mode', async () => {
    if (isMockMode) {
      const response = await supabase.auth.signInWithPassword({
        email: 'admin@locallens.ai',
        password: 'admin123'
      });

      expect(response.error).toBeNull();
      expect(response.data.user).toBeDefined();
      expect(response.data.user.user_metadata.username).toBe('admin');
      
      const session = sessionStorage.getItem('locallens_session');
      expect(session).not.toBeNull();
    }
  });

  it('should fail with invalid credentials', async () => {
    if (isMockMode) {
      const response = await supabase.auth.signInWithPassword({
        email: 'attacker@locallens.ai',
        password: 'wrongpassword'
      });

      expect(response.error).not.toBeNull();
      expect(response.data.user).toBeNull();
    }
  });

  it('should perform select and insert queries', async () => {
    if (isMockMode) {
      // Seed active session
      sessionStorage.setItem('locallens_session', JSON.stringify({
        access_token: 'test-token',
        user: { id: 'usr-admin-123', email: 'admin@locallens.ai' }
      }));

      const newPref = {
        personality: 'Adventure',
        favorite_destination: 'Mountains',
        transport_pref: 'Bike',
        travel_group: 'Solo',
        food_pref: 'Vegan',
        budget: 'Budget'
      };

      const insertRes = await supabase
        .from('travel_preferences')
        .insert(newPref);

      expect(insertRes.data).toBeDefined();
      expect(insertRes.data[0].personality).toBe('Adventure');

      // Select it back
      const selectRes = await supabase
        .from('travel_preferences')
        .select('*');

      expect(selectRes.data).toBeDefined();
      expect(selectRes.data.length).toBeGreaterThan(0);
      expect(selectRes.data[0].food_pref).toBe('Vegan');
    }
  });
});
