import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/supabaseClient';
import { ATTRACTIONS_BY_CITY, LOCAL_STAYS_BY_CITY } from '../../constants/mockData';
import type { Attraction } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { LocalCompanion } from '../../components/planner/LocalCompanion';
import { LocalStayCard } from '../../components/cards/LocalStayCard';
import { TransportHub } from '../../components/transport/TransportHub';
import { ArExplorer } from '../../components/map/ArExplorer';
import { StoryModal } from '../../components/stories/StoryModal';
import { DestinationPopup } from '../../components/layout/DestinationPopup';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const CATEGORIES = ['All', 'Temples', 'Culture', 'Museums', 'Hidden Gems', 'Food', 'Adventure'];

export const Home: React.FC = () => {
  const { user } = useAuth();
  
  // Dashboard state
  const [city, setCity] = useState<string>('Dehradun');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  
  // Modals state
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyTarget, setStoryTarget] = useState<string>('');

  const userName = user?.username === 'admin' ? 'Rahul' : user?.username || 'Traveler';

  // Get filtered attractions for active city
  const cityKey = city.toLowerCase();
  const rawAttractions = ATTRACTIONS_BY_CITY[cityKey] || [];
  const filteredAttractions = activeCategory === 'All' 
    ? rawAttractions 
    : rawAttractions.filter(attr => attr.category === activeCategory);

  // Get local stays for active city
  const localStays = LOCAL_STAYS_BY_CITY[cityKey] || [];

  const handleSelectAttraction = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
  };

  const triggerStory = (attractionName: string) => {
    setStoryTarget(attractionName);
    setIsStoryOpen(true);
  };

  // Change active city and sync with database
  const handleCityChange = async (cityName: string) => {
    setCity(cityName);
    setSelectedAttraction(null);
    setActiveCategory('All');

    if (user) {
      try {
        await supabase
          .from('saved_destinations')
          .insert({
            user_id: user.id,
            city: cityName
          });
      } catch (err) {
        console.error('Failed to save active city', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 1. First Login Destination Prompt */}
      <DestinationPopup onSelectCity={handleCityChange} />

      {/* 2. Brand Greeting Hero Section (Landon Norris Style) */}
      <section className="relative w-full rounded-[40px] bg-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Compass size={12} className="animate-spin-slow" /> Active Companion Online
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight select-none">
              Good Morning, {userName}
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-md">
              Where would you like to explore today? Customize your journey.
            </p>
          </div>

          {/* Active City Selection Dropdown */}
          <div className="flex flex-col gap-1.5 self-start md:self-center">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">Explore Target</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="pl-11 pr-10 py-3.5 bg-slate-800 border border-slate-700/80 rounded-2xl text-sm font-extrabold text-white outline-none focus:border-primary/50 cursor-pointer appearance-none shadow-lg tracking-wide transition-all duration-300"
              >
                <option value="Dehradun">Dehradun, Uttarakhand</option>
                <option value="Jaipur">Jaipur, Rajasthan</option>
                <option value="Varanasi">Varanasi, Uttar Pradesh</option>
                <option value="Goa">Goa, Konkan</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold select-none">▼</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Explore Section: Map & Filter Controls */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Interactive City Lens <Sparkles size={14} className="text-primary fill-primary" />
            </h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filtered cultural coordinates</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center bg-slate-100 p-1.5 rounded-full overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 select-none ${
                    isActive 
                      ? 'bg-white text-slate-800 shadow-sm font-extrabold' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaflet Map (Left side spans 2 columns) */}
          <div className="lg:col-span-2">
            <InteractiveMap
              city={city}
              attractions={filteredAttractions}
              onSelectAttraction={handleSelectAttraction}
              selectedAttraction={selectedAttraction}
            />
          </div>

          {/* Attraction Detail Side Panel */}
          <div className="lg:col-span-1">
            {selectedAttraction ? (
              <motion.div
                key={selectedAttraction.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col h-full justify-between gap-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100 select-none">
                    <img 
                      src={selectedAttraction.photo} 
                      alt={selectedAttraction.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary">{selectedAttraction.category}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-extrabold text-lg text-slate-800 tracking-tight leading-tight">
                      {selectedAttraction.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-4">
                      {selectedAttraction.description}
                    </p>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 select-none">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">⏱ Duration</span>
                      <span className="text-xs font-extrabold text-slate-700">{selectedAttraction.visitDuration}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">⚙ Difficulty</span>
                      <span className="text-xs font-extrabold text-slate-700">{selectedAttraction.difficulty}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">🕖 Open Hours</span>
                      <span className="text-xs font-extrabold text-slate-700">{selectedAttraction.openingHours}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">☀ Best Time</span>
                      <span className="text-xs font-extrabold text-slate-700">{selectedAttraction.bestTime}</span>
                    </div>
                  </div>
                </div>

                {/* Immersive Story Generator Action */}
                <Button
                  onClick={() => triggerStory(selectedAttraction.name)}
                  variant="primary"
                  className="w-full shadow-md flex items-center justify-center gap-1.5 mt-2"
                >
                  <Sparkles size={16} /> Tell me the Story
                </Button>
              </motion.div>
            ) : (
              <div className="h-full border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 select-none">
                <Compass size={32} className="text-slate-300 animate-pulse mb-3" />
                <h4 className="font-bold text-slate-700 text-sm mb-1">Select an Attraction</h4>
                <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed">
                  Click any marker on the map to unlock travel details and immersive histories.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. AI Local Companion Feed */}
      <section>
        <LocalCompanion city={city} />
      </section>

      {/* 5. Stay Like a Local (Homestays section) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col select-none">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            Stay Like a Local <Sparkles size={14} className="text-emerald-500 fill-emerald-500" />
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Village stays, orchards, & tea estate hosts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localStays.map((stay) => (
            <LocalStayCard key={stay.id} stay={stay} />
          ))}

          {localStays.length === 0 && (
            <div className="col-span-3 text-center py-10 bg-slate-50 border border-slate-100 rounded-3xl select-none">
              <Calendar size={24} className="text-slate-300 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No local stays cataloged for this city</span>
            </div>
          )}
        </div>
      </section>

      {/* 6. Lower Row Features: Transport Hub & AR Mock */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TransportHub city={city} />
        </div>
        <div className="lg:col-span-1">
          <ArExplorer />
        </div>
      </section>

      {/* 7. Storyteller Modal Overlay */}
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        attractionName={storyTarget}
      />
    </div>
  );
};
export default Home;
