import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Save, Trash2, RotateCcw, AlertTriangle, CheckCircle, MapPin, Send } from 'lucide-react';
import { generateTripPlan } from '../../services/gemini/geminiClient';
import type { ItineraryDay } from '../../types';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

const CITIES = ['Jaipur', 'Varanasi', 'Goa', 'Dehradun'];
const BUDGETS = [
  { id: 'Budget', label: '🎒 Budget' },
  { id: 'Mid-range', label: '🏨 Comfort' },
  { id: 'Luxury', label: '✨ Luxury' },
];
const INTERESTS = ['History', 'Nature', 'Foodie', 'Adventure', 'Culture', 'Photography', 'Spirituality', 'Shopping'];

/**
 * Planner component renders the trip planner interface where users can customize city, budget,
 * duration, and interests to generate an AI-powered travel itinerary.
 */
export const Planner: React.FC = () => {
  const { user } = useAuth();

  const [destination, setDestination] = useState(localStorage.getItem('preferred_city') || 'Jaipur');
  const [budget, setBudget] = useState('Mid-range');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const toggleInterest = useCallback((id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!destination) return;
    setLoading(true);
    setError(null);
    setItinerary(null);
    setActiveDayTab(0);
    try {
      const plan = await generateTripPlan(
        destination,
        budget,
        `${days} days`,
        2,
        selectedInterests
      );
      if (plan?.length) setItinerary(plan);
      else throw new Error('No itinerary returned');
    } catch {
      setError('Could not generate trip plan. Using offline mode.');
      // Fallback minimal plan
      setItinerary([
        {
          day: 1,
          theme: `Arrival & Orientation`,
          activities: [
            { time: '09:00', name: 'Arrive & check in', description: 'Settle in and freshen up.', duration: '2h', cost: 'Included' },
            { time: '12:00', name: 'Local lunch', description: 'Sample authentic local cuisine.', duration: '1h', cost: '₹300' },
            { time: '15:00', name: 'Heritage walk', description: `Explore ${destination}'s old quarter.`, duration: '3h', cost: 'Free' },
          ],
          estimatedBudget: '₹2,500',
          tip: `Start slow on day 1 — let ${destination} reveal herself naturally.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [destination, budget, days, selectedInterests]);

  const handleSave = useCallback(async () => {
    if (!user || !itinerary) return;
    setSaveStatus('saving');
    try {
      await supabase.from('trip_plans').insert({
        user_id: user.id,
        destination,
        budget,
        itinerary: JSON.stringify(itinerary),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('idle');
    }
  }, [user, itinerary, destination, budget]);

  const handleReset = useCallback(() => {
    setItinerary(null);
    setError(null);
    setActiveDayTab(0);
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary">Trip Planner</h1>
        <p className="text-sm text-text-secondary">Let AI build your perfect itinerary</p>
      </div>

      {/* ── Prompt / Config Card ── */}
      {!itinerary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex flex-col gap-4"
        >
          {/* City selector */}
          <div>
            <label className="section-label mb-2 block">Destination</label>
            <div className="grid grid-cols-2 gap-2">
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setDestination(c)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    destination === c
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-white/5 border-white/8 text-text-secondary hover:border-white/20'
                  }`}
                >
                  <MapPin size={14} className={destination === c ? 'text-primary' : 'text-text-muted'} aria-hidden="true" />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="section-label mb-2 block">Budget Style</label>
            <div className="flex gap-2">
              {BUDGETS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    budget === b.id
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-white/5 border-white/8 text-text-secondary hover:border-white/20'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div>
            <label htmlFor="duration-range" className="section-label mb-2 block">Duration: {days} day{days > 1 ? 's' : ''}</label>
            <input
              id="duration-range"
              type="range"
              min={1}
              max={7}
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-primary h-1 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-muted mt-1">
              <span>1 day</span><span>7 days</span>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="section-label mb-2 block">Interests (optional)</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={selectedInterests.includes(i) ? 'pill-active' : 'pill'}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !destination}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
                Building your trip…
              </>
            ) : (
              <>
                <Sparkles size={16} aria-hidden="true" />
                Generate {days}-Day Itinerary
                <Send size={14} aria-hidden="true" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* ── Error state ── */}
      {error && (
        <div className="glass-card p-4 flex items-center gap-3 border-amber-500/20 bg-amber-500/5">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" aria-hidden="true" />
          <p className="text-sm text-amber-300">{error}</p>
        </div>
      )}

      {/* ── Itinerary Result ── */}
      <AnimatePresence>
        {itinerary && (
          <motion.div
            key="itinerary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Result header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-text-primary text-lg">{destination} · {days}D</h2>
                <p className="text-text-muted text-xs">{budget} · AI-generated plan</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="btn-ghost flex items-center gap-1.5 text-xs py-2 px-3"
                >
                  <RotateCcw size={13} aria-hidden="true" /> Redo
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus !== 'idle'}
                  className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3 disabled:opacity-60"
                >
                  {saveStatus === 'saved'
                    ? <><CheckCircle size={13} aria-hidden="true" /> Saved!</>
                    : saveStatus === 'saving'
                    ? <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" /></svg> Saving</>
                    : <><Save size={13} aria-hidden="true" /> Save Trip</>
                  }
                </button>
              </div>
            </div>

            {/* Day tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {itinerary.map((day, i) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDayTab(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                    activeDayTab === i
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-white/5 border-white/8 text-text-secondary hover:border-white/20'
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            {/* Active day card */}
            {itinerary[activeDayTab] && (
              <motion.div
                key={activeDayTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-5 flex flex-col gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Calendar size={14} className="text-primary" aria-hidden="true" />
                    <span className="section-label">Day {itinerary[activeDayTab].day}</span>
                  </div>
                  <h3 className="font-black text-text-primary text-base">{itinerary[activeDayTab].theme}</h3>
                  <span className="text-xs text-primary font-semibold">Est. {itinerary[activeDayTab].estimatedBudget}</span>
                </div>

                {/* Activities timeline */}
                <div className="flex flex-col gap-3">
                  {itinerary[activeDayTab].activities?.map((act) => (
                    <div key={`${act.time}-${act.name || act.activityName}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-text-muted w-12 text-right shrink-0">{act.time}</span>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="w-px bg-white/10 self-center h-full absolute" />
                        <div className="glass-card p-3 relative">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-sm text-text-primary">{act.name || act.activityName}</span>
                            {act.cost && (
                              <span className="text-[11px] text-emerald-400 font-semibold">{act.cost}</span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{act.description}</p>
                          {act.duration && (
                            <span className="text-[10px] text-text-muted mt-1 inline-block">{act.duration}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Local tip */}
                {itinerary[activeDayTab].tip && (
                  <div className="flex items-start gap-2.5 bg-primary/8 border border-primary/20 rounded-xl p-3">
                    <Sparkles size={14} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-text-secondary leading-relaxed">{itinerary[activeDayTab].tip}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete saved button ── */}
      {itinerary && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-400 transition-colors mx-auto"
        >
          <Trash2 size={13} aria-hidden="true" /> Discard plan
        </button>
      )}
    </div>
  );
};

export default Planner;
