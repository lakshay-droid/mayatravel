import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Sparkles, Compass } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

// Onboarding step questions data
const PERSONALITIES = [
  { id: 'Adventure', label: 'Adventure', desc: 'Thrive on hikes, climbs, rafting, and adrenaline.', image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=400&q=80' },
  { id: 'Culture', label: 'Culture', desc: 'Dive into rituals, arts, local music, and events.', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=400&q=80' },
  { id: 'Foodie', label: 'Foodie', desc: 'Explore the world through spices, stalls, and courses.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: 'Nature', label: 'Nature', desc: 'Find peace in wilderness, valleys, and national parks.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80' },
  { id: 'Luxury', label: 'Luxury', desc: 'Unwind in premium stays, boutique spas, and private transport.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  { id: 'Photography', label: 'Photography', desc: 'Hunt golden-hour viewpoints and stunning layouts.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80' },
  { id: 'History', label: 'History', desc: 'Explore ruins, palaces, museums, and local lore.', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=400&q=80' }
];

const DESTINATIONS = [
  { id: 'Mountains', label: 'Mountains', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { id: 'Beaches', label: 'Beaches', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'Cities', label: 'Cities', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80' },
  { id: 'Heritage', label: 'Heritage', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80' },
  { id: 'Forests', label: 'Forests', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80' },
  { id: 'Deserts', label: 'Deserts', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80' }
];

const TRANSPORTS = [
  { id: 'Flight', label: 'Flight', desc: 'Quick long-distance flights.' },
  { id: 'Train', label: 'Train', desc: 'Scenic rail corridors.' },
  { id: 'Bus', label: 'Bus', desc: 'Affordable highway routes.' },
  { id: 'Car', label: 'Car', desc: 'Flexible self-drive or cab roadtrips.' },
  { id: 'Bike', label: 'Bike', desc: 'Two-wheeled local trail exploration.' },
  { id: 'Walking', label: 'Walking', desc: 'Pedestrian pace, exploring slow alleys.' }
];

const GROUPS = [
  { id: 'Solo', label: 'Solo Traveler', desc: 'On a personal voyage of self-discovery.' },
  { id: 'Couple', label: 'As a Couple', desc: 'Shared travel with a significant other.' },
  { id: 'Friends', label: 'With Friends', desc: 'Social adventure and collective activities.' },
  { id: 'Family', label: 'With Family', desc: 'Comfort-first, multi-generational bonding.' }
];

const FOODS = [
  { id: 'Vegetarian', label: 'Vegetarian Only', desc: 'Herbivore dishes and local dairy specialties.' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', desc: 'Enjoying traditional meats, poultry, and fish.' },
  { id: 'Vegan', label: 'Vegan / Plant-based', desc: 'No animal derivatives or products.' },
  { id: 'Local Cuisine', label: 'Local Cuisine Cult', desc: 'Must eat whatever regional families prepare.' },
  { id: 'Street Food', label: 'Street Food Collector', desc: 'Finding hidden stalls and local spicy snacks.' }
];

const BUDGETS = [
  { id: 'Budget', label: 'Budget Backpacking', desc: 'Homestays, public transit, and smart spending.' },
  { id: 'Mid-range', label: 'Mid-range Comfort', desc: 'Clean hotels, rental cars, and comfortable dining.' },
  { id: 'Luxury', label: 'Luxury Leisure', desc: 'Five-star resorts, private guides, and fine dining.' }
];

export const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [personality, setPersonality] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [transport, setTransport] = useState<string>('');
  const [group, setGroup] = useState<string>('');
  const [food, setFood] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) return !!personality;
    if (step === 2) return !!destination;
    if (step === 3) return !!transport;
    if (step === 4) return !!group;
    if (step === 5) return !!food;
    if (step === 6) return !!budget;
    return false;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      // Save travel preferences to Supabase
      const { error } = await supabase
        .from('travel_preferences')
        .upsert({
          user_id: user.id,
          personality: personality as any,
          favorite_destination: destination as any,
          transport_pref: transport as any,
          travel_group: group as any,
          food_pref: food as any,
          budget: budget as any
        });

      if (error) {
        throw error;
      }

      // Redirect to homepage
      navigate('/');
    } catch (err) {
      console.error('Failed to submit onboarding answers', err);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as any } },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any } })
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-900 text-white p-6 md:p-12 overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="w-full flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white">
            <Compass size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight flex items-center gap-0.5">
            LocalLens <Sparkles size={10} className="text-primary fill-primary" />
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Step {step} of {totalSteps}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800 rounded-full mt-4 z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Body Content */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto my-8 z-10 overflow-y-auto pr-1">
        <AnimatePresence mode="wait" custom={step}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                What is your travel personality?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Choose the lens through which you prefer to experience new places.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {PERSONALITIES.map((p) => {
                  const isSelected = personality === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <img src={p.image} alt={p.label} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                          {p.label}
                          {isSelected && <Check size={14} className="text-primary" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                Where is your soul at home?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Select your favorite type of destination scenery.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {DESTINATIONS.map((d) => {
                  const isSelected = destination === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDestination(d.id)}
                      className={`group relative h-36 rounded-3xl overflow-hidden border transition-all duration-300 ${
                        isSelected
                          ? 'border-primary shadow-lg shadow-primary/20 scale-[0.98]'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {/* Card Image */}
                      <img
                        src={d.image}
                        alt={d.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                      
                      {/* Card Content */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="font-bold text-sm tracking-tight text-white">{d.label}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                How do you prefer to travel?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Your preferred choice of transit during local trips.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {TRANSPORTS.map((t) => {
                  const isSelected = transport === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTransport(t.id)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary/20 border-primary shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-100">{t.label}</span>
                        {isSelected && <Check size={16} className="text-primary" />}
                      </div>
                      <p className="text-xs text-slate-400">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                Who are you traveling with?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Your typical travel group dynamics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {GROUPS.map((g) => {
                  const isSelected = group === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGroup(g.id)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary/20 border-primary shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-100">{g.label}</span>
                        {isSelected && <Check size={16} className="text-primary" />}
                      </div>
                      <p className="text-xs text-slate-400">{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                What are your culinary rules?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Food represents local culture. Choose what suits your palate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {FOODS.map((f) => {
                  const isSelected = food === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFood(f.id)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary/20 border-primary shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-100">{f.label}</span>
                        {isSelected && <Check size={16} className="text-primary" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
                Lastly, what is your budget style?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                This helps customize homestays and trip itinerary suggestions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {BUDGETS.map((b) => {
                  const isSelected = budget === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBudget(b.id)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary/20 border-primary shadow-lg'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-100">{b.label}</span>
                        {isSelected && <Check size={16} className="text-primary" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Buttons */}
      <footer className="w-full flex items-center justify-between z-10 pt-4 border-t border-slate-800 select-none">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {step < totalSteps ? (
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            variant="primary"
            className="flex items-center gap-2"
          >
            Continue
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!isStepValid() || submitting}
            isLoading={submitting}
            variant="primary"
            className="flex items-center gap-2 px-8"
          >
            Let's Explore
            <ChevronRight size={16} />
          </Button>
        )}
      </footer>
    </div>
  );
};
export default Onboarding;
