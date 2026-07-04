import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Compass, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import type { TravelPreferences } from '../../types';

// ─── Step 1 Data: Travel Personality ────────────────────────────────────────
const PERSONALITIES = [
  {
    id: 'Adventure',
    emoji: '🧗',
    label: 'Adventure Seeker',
    desc: 'Hikes, climbs, rafting & adrenaline',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-600/80 to-orange-950/90',
  },
  {
    id: 'Culture',
    emoji: '🎭',
    label: 'Culture Diver',
    desc: 'Rituals, arts, local music & events',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-600/80 to-purple-950/90',
  },
  {
    id: 'Foodie',
    emoji: '🍜',
    label: 'Food Explorer',
    desc: 'Spices, street stalls & local flavors',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-600/80 to-rose-950/90',
  },
  {
    id: 'Nature',
    emoji: '🌿',
    label: 'Nature Wanderer',
    desc: 'Valleys, wildlife & national parks',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-600/80 to-emerald-950/90',
  },
];

// ─── Step 2 Data: City Selection ─────────────────────────────────────────────
const CITIES = [
  {
    id: 'Jaipur',
    label: 'Jaipur',
    state: 'Rajasthan',
    desc: 'Royal Pink City & Palaces',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Varanasi',
    label: 'Varanasi',
    state: 'Uttar Pradesh',
    desc: 'Sacred Ghats & Ancient Lore',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Varanasi_Munshi_Ghat3.jpg',
  },
  {
    id: 'Goa',
    label: 'Goa',
    state: 'Konkan',
    desc: 'Beaches & Portuguese Heritage',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Dehradun',
    label: 'Dehradun',
    state: 'Uttarakhand',
    desc: 'Valley Mists & Himalayan Gateway',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
  },
];

// ─── Step 3 Data: Trip Style (Budget + Group combined) ───────────────────────
const BUDGETS = [
  { id: 'Budget', label: 'Backpacker', icon: '🎒', desc: 'Hostels & local buses' },
  { id: 'Mid-range', label: 'Comfort', icon: '🏨', desc: 'Hotels & rental cabs' },
  { id: 'Luxury', label: 'Luxury', icon: '✨', desc: 'Resorts & private guides' },
];

const GROUPS = [
  { id: 'Solo', label: 'Solo', icon: '🧍' },
  { id: 'Couple', label: 'Couple', icon: '👫' },
  { id: 'Friends', label: 'Friends', icon: '👯' },
  { id: 'Family', label: 'Family', icon: '👨‍👩‍👧' },
];

const TOTAL_STEPS = 3;

/**
 * Onboarding component renders step-by-step setup wizard for new users,
 * collecting travel personality, city focus, budget, and group dynamics.
 */
export const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [personality, setPersonality] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [group, setGroup] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = useCallback(() => {
    if (step === 1) return !!personality;
    if (step === 2) return !!city;
    if (step === 3) return !!budget && !!group;
    return false;
  }, [step, personality, city, budget, group]);

  const goPrev = useCallback(() => {
    if (step > 1) { setDir(-1); setStep(step - 1); }
  }, [step]);

  // Automatically advance to Step 2 upon selecting personality
  const handleSelectPersonality = useCallback((pId: string) => {
    setPersonality(pId);
    setTimeout(() => {
      setDir(1);
      setStep(2);
    }, 300);
  }, []);

  // Automatically advance to Step 3 upon selecting city
  const handleSelectCity = useCallback((cId: string) => {
    setCity(cId);
    setTimeout(() => {
      setDir(1);
      setStep(3);
    }, 300);
  }, []);

  const handleFinish = useCallback(async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await supabase.from('travel_preferences').upsert({
        user_id: user.id,
        personality: personality as TravelPreferences['personality'],
        favorite_destination: 'Mountains', // default fallback scenic option for type safety
        transport_pref: 'Car',
        travel_group: group as TravelPreferences['travel_group'],
        food_pref: 'Local Cuisine',
        budget: budget as TravelPreferences['budget'],
      });

      // Store city choice and onboarding status in localStorage
      localStorage.setItem('preferred_city', city);
      localStorage.setItem(`onboarded_${user.username}`, '1');

      navigate('/', { replace: true });
    } catch {
      // Offline fallback
      localStorage.setItem('preferred_city', city);
      localStorage.setItem(`onboarded_${user.username}`, '1');
      navigate('/', { replace: true });
    } finally {
      setSubmitting(false);
    }
  }, [user, personality, city, group, budget, navigate]);

  const slideVariants = {
    initial: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.3 } }),
  };

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col overflow-hidden pb-safe">
      {/* Background blob */}
      <div className="blob-accent w-[500px] h-[500px] bg-primary top-[-200px] right-[-200px]" />
      <div className="blob-accent w-[400px] h-[400px] bg-primary-light bottom-[-150px] left-[-150px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-glow">
            <Compass size={16} className="text-white" aria-hidden="true" />
          </div>
          <span className="font-black text-text-primary tracking-tight flex items-center gap-1">
            LocalLens <Sparkles size={10} className="text-primary" aria-hidden="true" />
          </span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i + 1}
              className={`rounded-full transition-all duration-500 ${
                i + 1 === step
                  ? 'w-6 h-2 bg-primary'
                  : i + 1 < step
                  ? 'w-2 h-2 bg-primary/60'
                  : 'w-2 h-2 bg-white/15'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Step content */}
      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto px-5">
        <AnimatePresence mode="wait" custom={dir}>

          {/* ── STEP 1: Personality (Vertical Portrait Cards) ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col h-full justify-between"
            >
              <div className="pt-4 pb-4">
                <p className="section-label mb-1">Step 1 of 3</p>
                <h2 className="text-2xl font-black text-text-primary leading-snug">
                  What kind of traveler<br />are you?
                </h2>
              </div>

              {/* High Portrait Cards Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 h-[calc(100vh-210px)] min-h-[360px] pb-4">
                {PERSONALITIES.map((p) => {
                  const sel = personality === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPersonality(p.id)}
                      className={`relative rounded-3xl overflow-hidden text-left transition-all duration-300 h-full flex flex-col justify-end p-4 group ${
                        sel ? 'ring-2 ring-primary scale-[0.98]' : 'hover:scale-[0.99]'
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.label}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${p.color}`} />
                      {sel && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check size={13} className="text-white" aria-hidden="true" />
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="text-2xl mb-1">{p.emoji}</div>
                        <div className="font-extrabold text-base text-white leading-snug">{p.label}</div>
                        <div className="text-white/60 text-[10px] leading-snug mt-1 line-clamp-2">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: City (Vertical Portrait Cards) ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col h-full justify-between"
            >
              <div className="pt-4 pb-4">
                <p className="section-label mb-1">Step 2 of 3</p>
                <h2 className="text-2xl font-black text-text-primary leading-snug">
                  Where do you want<br />to explore first?
                </h2>
              </div>

              {/* High Portrait Cards Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 h-[calc(100vh-210px)] min-h-[360px] pb-4">
                {CITIES.map((c) => {
                  const sel = city === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCity(c.id)}
                      className={`relative rounded-3xl overflow-hidden text-left transition-all duration-300 h-full flex flex-col justify-end p-4 group ${
                        sel ? 'ring-2 ring-primary scale-[0.98]' : 'hover:scale-[0.99]'
                      }`}
                    >
                      <img
                        src={c.image}
                        alt={c.label}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                      />
                      <div className="absolute inset-0 photo-overlay" />
                      {sel && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check size={13} className="text-white" aria-hidden="true" />
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="font-extrabold text-lg text-white leading-none">{c.label}</div>
                        <div className="text-white/50 text-[10px] mt-1">{c.state}</div>
                        <div className="text-white/70 text-[10px] mt-1 line-clamp-2">{c.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Budget + Group ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex-1 flex flex-col gap-6 pt-4 pb-4"
            >
              <div>
                <p className="section-label mb-1">Step 3 of 3</p>
                <h2 className="text-2xl font-black text-text-primary leading-snug">
                  How do you like<br />to travel?
                </h2>
              </div>

              {/* Budget */}
              <div>
                <p className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Budget Style</p>
                <div className="grid grid-cols-3 gap-3">
                  {BUDGETS.map((b) => {
                    const sel = budget === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        className={`glass-card p-4 text-center transition-all duration-300 ${
                          sel ? 'border-primary/50 bg-primary/10 shadow-glow' : 'hover:border-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-2">{b.icon}</div>
                        <div className={`text-sm font-bold ${sel ? 'text-primary' : 'text-text-primary'}`}>{b.label}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">{b.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group */}
              <div>
                <p className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Traveling With</p>
                <div className="grid grid-cols-4 gap-2">
                  {GROUPS.map((g) => {
                    const sel = group === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGroup(g.id)}
                        className={`glass-card p-3 text-center transition-all duration-300 ${
                          sel ? 'border-primary/50 bg-primary/10 shadow-glow' : 'hover:border-white/20'
                        }`}
                      >
                        <div className="text-xl mb-1">{g.icon}</div>
                        <div className={`text-xs font-semibold ${sel ? 'text-primary' : 'text-text-secondary'}`}>{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation footer */}
      <footer className="relative z-10 px-6 py-4 flex items-center justify-between border-t border-white/5">
        <button
          onClick={goPrev}
          disabled={step === 1}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
        >
          Back
        </button>

        {/* Footer Next button is ONLY shown on Step 3 (renamed as Let's Go) since Step 1 & 2 transition automatically upon card selection */}
        {step === 3 && (
          <button
            onClick={handleFinish}
            disabled={!isValid() || submitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            {submitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
            ) : null}
            {submitting ? 'Saving...' : "Let's Go"} {!submitting && <Sparkles size={14} aria-hidden="true" />}
          </button>
        )}
      </footer>
    </div>
  );
};

export default Onboarding;
