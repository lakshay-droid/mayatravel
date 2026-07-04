import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Map, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/supabaseClient';
import { ATTRACTIONS_BY_CITY, LOCAL_STAYS_BY_CITY } from '../../constants/mockData';
import type { Attraction } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { LocalCompanion } from '../../components/planner/LocalCompanion';
import { LocalStayCard } from '../../components/cards/LocalStayCard';
import { StoryModal } from '../../components/stories/StoryModal';
import { AttractionCard } from '../../components/explore/AttractionCard';
import { AttractionSheet } from '../../components/explore/AttractionSheet';
import { CityHero } from '../../components/explore/CityHero';

const CATEGORIES = ['All', 'Temples', 'Culture', 'Museums', 'Hidden Gems', 'Food', 'Adventure'];
const AVAILABLE_CITIES = ['Dehradun', 'Jaipur', 'Varanasi', 'Goa'];

/**
 * Home component renders the main explore feed where users can browse attractions, homestays,
 * toggles a map, view companion feed tips, and trigger AI storyteller.
 */
export const Home: React.FC = () => {
  const { user } = useAuth();

  // Read preferred city from onboarding localStorage
  const savedCity = localStorage.getItem('preferred_city') || 'Jaipur';
  const [city, setCity] = useState<string>(savedCity);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyTarget, setStoryTarget] = useState<string>('');
  const [showMap, setShowMap] = useState(false);

  const cityKey = city.toLowerCase();
  
  const rawAttractions = React.useMemo(() => {
    return ATTRACTIONS_BY_CITY[cityKey] || [];
  }, [cityKey]);

  const filteredAttractions = React.useMemo(() => {
    return activeCategory === 'All'
      ? rawAttractions
      : rawAttractions.filter(a => a.category === activeCategory);
  }, [rawAttractions, activeCategory]);

  const localStays = React.useMemo(() => {
    return LOCAL_STAYS_BY_CITY[cityKey] || [];
  }, [cityKey]);

  const handleCityChange = useCallback(async (cityName: string) => {
    setCity(cityName);
    setSelectedAttraction(null);
    setActiveCategory('All');
    localStorage.setItem('preferred_city', cityName);

    if (user) {
      try {
        await supabase.from('saved_destinations').insert({ user_id: user.id, city: cityName });
      } catch { /* best effort */ }
    }
  }, [user]);

  const handleStory = useCallback((name: string) => {
    setSelectedAttraction(null);
    setStoryTarget(name);
    setIsStoryOpen(true);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full pb-24">
      {/* City Hero */}
      <CityHero
        city={city}
        availableCities={AVAILABLE_CITIES}
        onCityChange={handleCityChange}
      />

      {/* ── Category Filter Pills ── */}
      <div className="overflow-x-auto flex gap-2 pb-1 -mx-1 px-1 scrollbar-hide" role="tablist" aria-label="Filter attractions">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'pill-active' : 'pill'}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Attraction Cards Feed ── */}
      <section aria-label="Attractions">
        {filteredAttractions.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-14 text-center">
            <span className="text-3xl mb-3">🗺️</span>
            <p className="text-text-secondary text-sm font-semibold">No spots in this category yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredAttractions.map((attraction, i) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                index={i}
                onTap={setSelectedAttraction}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── AI Companion Strip ── */}
      <section>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-0.5">AI Companion</p>
            <LocalCompanion city={city} compact />
          </div>
        </div>
      </section>

      {/* ── Stay Like a Local ── */}
      {localStays.length > 0 && (
        <section aria-label="Local stays">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-black text-text-primary text-base">Stay Like a Local</h2>
              <p className="text-text-muted text-xs">Villages, orchards & tea estates</p>
            </div>
            <button className="flex items-center gap-1 text-primary text-xs font-semibold">
              See all <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>

          {/* Horizontal scroll row */}
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {localStays.map((stay) => (
                <div key={stay.id} className="w-64 shrink-0">
                  <LocalStayCard stay={stay} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Map Toggle (collapsible) ── */}
      <section>
        <button
          onClick={() => setShowMap(!showMap)}
          className="glass-card w-full flex items-center justify-between px-4 py-3 hover:border-white/15 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Map size={18} className="text-primary" aria-hidden="true" />
            <span className="font-bold text-text-primary text-sm">Explore on Map</span>
          </div>
          <motion.div
            animate={{ rotate: showMap ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={16} className="text-text-muted rotate-90" aria-hidden="true" />
          </motion.div>
        </button>

        {showMap && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 overflow-hidden rounded-2xl"
          >
            <InteractiveMap
              city={city}
              attractions={filteredAttractions}
              onSelectAttraction={setSelectedAttraction}
              selectedAttraction={selectedAttraction}
            />
          </motion.div>
        )}
      </section>

      {/* ── Attraction Detail Bottom Sheet ── */}
      <AttractionSheet
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
        onStory={handleStory}
      />

      {/* ── Story Modal ── */}
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        attractionName={storyTarget}
      />
    </div>
  );
};

export default Home;
