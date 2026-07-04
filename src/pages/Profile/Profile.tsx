import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle, LogOut, Shield, Settings } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

const PERSONALITIES = ['Adventure', 'Culture', 'Foodie', 'Nature', 'Luxury', 'Photography', 'History'];
const DESTINATIONS = ['Mountains', 'Beaches', 'Cities', 'Heritage', 'Forests', 'Deserts'];
const TRANSPORTS = ['Flight', 'Train', 'Bus', 'Car', 'Bike', 'Walking'];
const GROUPS = ['Solo', 'Couple', 'Friends', 'Family'];
const FOODS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Local Cuisine', 'Street Food'];
const BUDGETS = ['Budget', 'Mid-range', 'Luxury'];

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

  const handleUpdate = async (e: React.FormEvent) => {
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
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

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
    <div className="flex flex-col gap-10 w-full">
      {/* Header Title */}
      <section className="flex flex-col select-none">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
          <Settings size={12} className="text-primary fill-primary" /> Profile settings
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mt-1">
          My Lens Control
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-semibold max-w-xl mt-1.5 leading-relaxed">
          Manage your travel personality and dietary choices. Updating preferences recalibrates the AI Companion and map recommendations.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column: User Identity Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-effect rounded-3xl p-8 border border-slate-100 shadow-premium flex flex-col items-center text-center gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-emerald-400" />
            
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-400 select-none">
              <User size={36} />
            </div>

            <div className="flex flex-col select-none">
              <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">{userNameDisplay}</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Local Explorer</span>
            </div>

            {/* RLS Rationale badges */}
            <div className="flex flex-col gap-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl w-full text-left select-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Shield size={10} className="text-emerald-500" /> RLS Protection Active
              </span>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Supabase Row Level Security ensures only your user ID ({user?.id?.slice(0,8)}...) has permissions to read or write these preferences.
              </p>
            </div>

            <Button
              onClick={handleLogoutClick}
              variant="danger"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 mt-2 shadow-sm font-bold"
            >
              <LogOut size={14} /> Log Out Account
            </Button>
          </div>
        </div>

        {/* Right column: Edit Preferences Form */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium">
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight mb-6 select-none">Travel Preferences</h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-600 text-xs font-bold leading-normal select-none"
                >
                  <CheckCircle size={16} className="shrink-0" />
                  <span>Preferences recalibrated successfully! Head over to the Dashboard to see fresh insights.</span>
                </motion.div>
              )}

              {/* Grid selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-none">
                {/* 1. Personality */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Travel Personality</label>
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {PERSONALITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 2. Scenery */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Soul Destination</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {DESTINATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 3. Transport */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Preferred Transport</label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {TRANSPORTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 4. Group */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Travel Dynamics</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {GROUPS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 5. Food */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Dietary Focus</label>
                  <select
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {FOODS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* 6. Budget */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Budget Plan</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold transition-all outline-none focus:border-primary/50"
                  >
                    {BUDGETS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={saving}
                  className="flex items-center gap-1.5 shadow-md px-8"
                >
                  <Save size={16} /> Save Settings
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
