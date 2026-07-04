import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Save, Trash2, RotateCcw, AlertTriangle, Coffee, Compass, CheckCircle } from 'lucide-react';
import { generateTripPlan } from '../../services/gemini/geminiClient';
import type { ItineraryDay, TripPlan } from '../../types';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

const INTERESTS_OPTIONS = ['History', 'Nature', 'Foodie', 'Adventure', 'Culture', 'Shopping', 'Photography', 'Spirituality'];

export const Planner: React.FC = () => {
  const { user } = useAuth();
  
  // Form states
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('Mid-range');
  const [dates, setDates] = useState('');
  const [groupSize, setGroupSize] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Core Planner states
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // View states
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [savedPlans, setSavedPlans] = useState<TripPlan[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load saved plans on mount
  React.useEffect(() => {
    const fetchSavedPlans = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('trip_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (!error && data) {
          setSavedPlans(data);
        }
      } catch (err) {
        console.error('Error fetching plans', err);
      }
    };
    fetchSavedPlans();
  }, [user]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !dates.trim()) {
      setError('Please fill in destination and dates.');
      return;
    }

    setLoading(true);
    setError(null);
    setItinerary(null);
    setSaveStatus('idle');

    try {
      const data = await generateTripPlan(
        destination.trim(),
        budget,
        dates.trim(),
        groupSize,
        selectedInterests
      );
      setItinerary(data);
      setActiveDayTab(1);
    } catch (err) {
      setError('Failed to generate your trip plan. The AI oracle is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !itinerary) return;
    setSaveStatus('saving');

    const newPlan: TripPlan = {
      user_id: user.id,
      destination: destination.trim(),
      budget,
      dates: dates.trim(),
      group_size: groupSize,
      interests: selectedInterests,
      itinerary
    };

    try {
      const { data, error } = await supabase
        .from('trip_plans')
        .insert(newPlan)
        .select();

      if (!error && data) {
        setSavedPlans(prev => [data[0], ...prev]);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        throw error;
      }
    } catch (err) {
      console.error('Failed to save itinerary', err);
      setSaveStatus('idle');
      alert('Failed to save plan. Try again later.');
    }
  };

  const handleLoadSavedPlan = (plan: TripPlan) => {
    setDestination(plan.destination);
    setBudget(plan.budget);
    setDates(plan.dates);
    setGroupSize(plan.group_size);
    setSelectedInterests(plan.interests);
    setItinerary(plan.itinerary);
    setActiveDayTab(1);
    setSaveStatus('idle');
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('trip_plans')
        .delete()
        .eq('id', id);
      if (!error) {
        setSavedPlans(prev => prev.filter(p => p.id !== id));
        if (itinerary && savedPlans.find(p => p.id === id)?.itinerary === itinerary) {
          setItinerary(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete plan', err);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Header */}
      <section className="flex flex-col select-none">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
          <Sparkles size={12} className="text-primary fill-primary" /> Personalized AI Guide
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mt-1">
          Cultural Trip Planner
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-semibold max-w-xl mt-1.5 leading-relaxed">
          Specify your timeline and style. Gemini AI will design a detailed local adventure emphasizing storytelling, dining, and slow travel.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Parameters Form Drawer */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="glass-effect rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6">
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight select-none">Trip Config</h3>

            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <Input
                label="Destination"
                placeholder="e.g. Dehradun or Jaipur"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loading}
                required
              />

              <Input
                label="Travel Dates"
                placeholder="e.g. October 12 - October 15"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                disabled={loading}
                required
              />

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase select-none">Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold transition-all duration-300 outline-none focus:border-primary/50"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Mid-range">Mid-range</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div className="w-[100px] flex flex-col gap-1.5">
                  <Input
                    label="Group Size"
                    type="number"
                    min={1}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Interests Checklist */}
              <div className="flex flex-col gap-2 select-none">
                <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        disabled={loading}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm font-extrabold'
                            : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full shadow-md flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles size={16} /> Create AI Itinerary
              </Button>
            </form>
          </div>

          {/* Saved Itineraries Section */}
          {savedPlans.length > 0 && (
            <div className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col gap-4">
              <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider select-none">Saved Journeys</h4>
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                {savedPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleLoadSavedPlan(plan)}
                    className="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100/60 hover:border-primary/20 flex items-center justify-between text-left transition-all duration-300 shadow-sm"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden pr-2">
                      <span className="text-xs font-extrabold text-slate-800 tracking-tight truncate">{plan.destination}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{plan.dates}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeletePlan(plan.id!, e)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete plan"
                    >
                      <Trash2 size={12} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Itinerary Display Dashboard */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {loading && (
            <div className="h-[450px] border border-slate-100 bg-white rounded-[32px] flex flex-col items-center justify-center text-center p-8 shadow-premium select-none">
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Compass size={24} className="text-primary animate-pulse" />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-1">Mapping out coordinates...</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Gemini is composing cultural stories, local routes, dinner picks, and slow paths.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="h-[400px] border border-slate-100 bg-white rounded-[32px] flex flex-col items-center justify-center text-center p-8 shadow-premium select-none">
              <AlertTriangle size={40} className="text-rose-500 mb-3" />
              <h4 className="font-bold text-slate-800 mb-1">Transit Planner Blocked</h4>
              <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">{error}</p>
              <Button onClick={handleGenerate} variant="secondary" size="sm">
                Retry Generation
              </Button>
            </div>
          )}

          {!itinerary && !loading && !error && (
            <div className="h-[450px] border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 select-none">
              <Calendar size={36} className="text-slate-300 animate-pulse mb-3" />
              <h4 className="font-bold text-slate-700 text-sm mb-1">No Itinerary Active</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Fill in the trip configuration parameters on the left to invoke the AI planner and generate a bespoke day-by-day travel diary.
              </p>
            </div>
          )}

          {itinerary && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Itinerary Title & Save Action Bar */}
              <div className="flex items-center justify-between bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] rounded-full bg-primary/20 blur-[60px]" />
                <div className="flex flex-col gap-1 z-10 select-none">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle size={10} /> Plan Rendered Successfully
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight">{destination} Journey</h3>
                  <span className="text-[10px] text-slate-300 font-semibold">{dates} | {groupSize} Travelers | {budget} Budget</span>
                </div>

                <div className="flex items-center gap-2.5 z-10">
                  {saveStatus === 'saved' ? (
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-4 py-2.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle size={14} /> Saved
                    </div>
                  ) : (
                    <Button
                      onClick={handleSavePlan}
                      isLoading={saveStatus === 'saving'}
                      variant="glass"
                      size="sm"
                      className="border-white/10 hover:bg-slate-800 text-white flex items-center gap-1.5"
                    >
                      <Save size={14} /> Save Plan
                    </Button>
                  )}
                  <button
                    onClick={handleGenerate}
                    className="p-2.5 rounded-full bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all focus:outline-none"
                    title="Regenerate plan"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Day Tabs Navigation */}
              <div className="flex border-b border-slate-200 pb-px gap-2 select-none">
                {itinerary.map((day) => {
                  const isActive = activeDayTab === day.day;
                  return (
                    <button
                      key={day.day}
                      onClick={() => setActiveDayTab(day.day)}
                      className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 focus:outline-none ${
                        isActive
                          ? 'border-primary text-primary-dark font-black'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Day {day.day}
                    </button>
                  );
                })}
              </div>

              {/* Active Day Plan Content */}
              {itinerary.map((day) => {
                if (day.day !== activeDayTab) return null;
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col select-none">
                      <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
                        {day.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{day.date}</span>
                    </div>

                    {/* Timeline Activity Cards (Morning, Afternoon, Evening) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { time: 'Morning', act: day.morning, color: 'border-amber-100 bg-amber-50/10' },
                        { time: 'Afternoon', act: day.afternoon, color: 'border-blue-100 bg-blue-50/10' },
                        { time: 'Evening', act: day.evening, color: 'border-purple-100 bg-purple-50/10' }
                      ].map((slot, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-5 rounded-3xl border ${slot.color} flex flex-col gap-3 justify-between shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                {slot.time}
                              </span>
                              <Badge variant="neutral">{slot.act.duration}</Badge>
                            </div>
                            <h5 className="font-extrabold text-sm text-slate-800 leading-snug tracking-tight">
                              {slot.act.activityName}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-extrabold">⏱ {slot.act.time}</span>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                              {slot.act.description}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100/60 flex items-center justify-between text-[10px] font-extrabold text-slate-600 select-none">
                            <span>Cost</span>
                            <span>{slot.act.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Food and Transit Meta Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                      {/* Food Picks */}
                      <div className="glass-effect p-6 border border-slate-100 rounded-3xl flex flex-col gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Coffee size={12} className="text-primary" /> Daily Food Picks
                        </span>
                        <div className="flex flex-col gap-2">
                          {day.foodRecommendations.map((food, idx) => (
                            <div key={idx} className="text-xs font-semibold text-slate-700 flex gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span>{food}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transit & Costs */}
                      <div className="glass-effect p-6 border border-slate-100 rounded-3xl flex flex-col justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transit Logic</span>
                          <p className="text-xs font-semibold text-slate-700 leading-normal">
                            🚌 {day.transport}
                          </p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Day Costs</span>
                          <span className="text-sm font-extrabold text-slate-800">{day.estimatedCosts}</span>
                        </div>
                      </div>
                    </div>

                    {/* Weather & Packing Collapsibles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                      <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 text-amber-600">
                          <AlertTriangle size={10} /> Weather Warning
                        </span>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          {day.weatherConsiderations}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Packing Checklist</span>
                        <div className="flex flex-wrap gap-1.5">
                          {day.packingSuggestions.map((pack, idx) => (
                            <Badge key={idx} variant="info">
                              ✔ {pack}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Planner;
