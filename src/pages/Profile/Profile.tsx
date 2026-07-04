import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, CheckCircle, LogOut, Shield, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

const PERSONALITIES = ['Adventure', 'Culture', 'Foodie', 'Nature', 'Luxury', 'Photography', 'History'];
const DESTINATIONS = ['Mountains', 'Beaches', 'Cities', 'Heritage', 'Forests', 'Deserts'];
const TRANSPORTS = ['Flight', 'Train', 'Bus', 'Car', 'Bike', 'Walking'];
const GROUPS = ['Solo', 'Couple', 'Friends', 'Family'];
const FOODS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Local Cuisine', 'Street Food'];
const BUDGETS = ['Budget', 'Mid-range', 'Luxury'];

/**
 * Profile component allows users to edit and save their travel preferences.
 * Updates travel_preferences backend table and triggers UI state updates.
 */
export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Preference States
  const [personality, setPersonality] = useState('Culture');
  const [destination, setDestination] = useState('Mountains');
  const [transport, setTransport] = useState('Train');
  const [group, setGroup] = useState('Solo');
  const [food, setFood] = useState('Vegetarian');
  const [budget, setBudget] = useState('Mid-range');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setPersonality(data.personality);
          setDestination(data.favorite_destination);
          setTransport(data.transport_pref);
          setGroup(data.travel_group);
          setFood(data.food_pref);
          setBudget(data.budget);
        }
      } catch (err) {
        console.error('Failed to load user preferences', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('travel_preferences')
        .upsert({
          user_id: user.id,
          personality,
          favorite_destination: destination,
          transport_pref: transport,
          travel_group: group,
          food_pref: food,
          budget
        });

      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw error;
      }
    } catch (err) {
      console.error('Failed to update preferences', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [user, personality, destination, transport, group, food, budget]);

  const handleLogoutClick = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse select-none">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opening Lens Safe...</span>
      </div>
    );
  }

  const userNameDisplay = user?.username === 'admin' ? 'Rahul' : user?.username || 'Traveler';

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      {/* Header Title */}
      <section className="flex flex-col select-none animate-slide-in-up">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
          <Settings size={12} className="text-primary fill-primary" aria-hidden="true" /> Profile settings
        </span>
        <h1 className="text-3xl font-black text-text-primary tracking-tight mt-1">
          My Lens Control
        </h1>
        <p className="text-text-secondary text-xs font-semibold max-w-xl mt-1.5 leading-relaxed">
          Manage your travel personality and dietary choices. Updating preferences recalibrates the AI Companion and map recommendations.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Left column: User Identity Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card flex flex-col items-center text-center gap-5 relative overflow-hidden p-0">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-light" />

            {/* Scenic Travel Banner */}
            <div className="relative w-full h-32 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80"
                alt="Travel banner"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            </div>

            {/* Avatar — overlaps banner */}
            <div className="relative -mt-12 z-10">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userNameDisplay)}&background=6c63ff&color=fff&size=80&bold=true&rounded=true`}
                alt={`${userNameDisplay} avatar`}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col select-none px-6">
              <h3 className="font-extrabold text-lg text-text-primary tracking-tight">{userNameDisplay}</h3>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">Verified Local Explorer</span>
            </div>

            {/* RLS Rationale badges */}
            <div className="flex flex-col gap-2 bg-background border border-border p-4 rounded-2xl w-full text-left select-none mx-6" style={{ width: 'calc(100% - 3rem)' }}>
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <Shield size={10} className="text-primary" aria-hidden="true" /> RLS Protection Active
              </span>
              <p className="text-[10px] text-text-secondary font-semibold leading-relaxed">
                Supabase Row Level Security ensures only your user ID ({user?.id?.slice(0,8)}...) has permissions to read or write these preferences.
              </p>
            </div>

            <div className="px-6 pb-6 w-full">
              <Button
                onClick={handleLogoutClick}
                variant="danger"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 shadow-sm font-bold"
              >
                <LogOut size={14} aria-hidden="true" /> Log Out Account
              </Button>
            </div>
          </div>
        </div>

        {/* Right column: Edit Preferences Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 md:p-8">
            <h3 className="font-extrabold text-lg text-text-primary tracking-tight mb-6 select-none">Travel Preferences</h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-primary/10 border border-primary/20 p-4 rounded-2xl text-primary text-xs font-bold leading-normal select-none"
                >
                  <CheckCircle size={16} className="shrink-0" aria-hidden="true" />
                  <span>Preferences recalibrated successfully! Head over to the Explore Feed to see fresh insights.</span>
                </motion.div>
              )}

              {/* Grid selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 select-none">
                {/* 1. Personality */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="personality-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Travel Personality</label>
                  <select
                    id="personality-select"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {PERSONALITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 2. Scenery */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="destination-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Soul Destination</label>
                  <select
                    id="destination-select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {DESTINATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 3. Transport */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="transport-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Preferred Transport</label>
                  <select
                    id="transport-select"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {TRANSPORTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 4. Group */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="group-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Travel Dynamics</label>
                  <select
                    id="group-select"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {GROUPS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 5. Food */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="food-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Dietary Focus</label>
                  <select
                    id="food-select"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {FOODS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 6. Budget */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="budget-select" className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Budget Plan</label>
                  <select
                    id="budget-select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text-primary text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {BUDGETS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={saving}
                  className="flex items-center gap-1.5 shadow-md px-8"
                >
                  <Save size={16} aria-hidden="true" /> Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
