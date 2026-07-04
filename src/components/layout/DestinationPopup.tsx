import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

interface DestinationPopupProps {
  onSelectCity: (city: string) => void;
}

const CITY_OPTIONS = [
  { id: 'Dehradun', label: 'Dehradun', desc: 'Misty valley of Doon, Pahadi culture, caves', image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=400&q=80' },
  { id: 'Jaipur', label: 'Jaipur', desc: 'Royal Pink City, Rajput palaces, stepwells', image: 'https://images.unsplash.com/photo-1477584308802-e9c378852d92?auto=format&fit=crop&w=400&q=80' },
  { id: 'Varanasi', label: 'Varanasi', desc: 'Oldest spiritual city, Ganga Ghats, narrow alleys', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=400&q=80' },
  { id: 'Goa', label: 'Goa', desc: 'Portuguese heritage churches, beaches, spices', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' }
];

export const DestinationPopup: React.FC<DestinationPopupProps> = ({
  onSelectCity
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkActiveDestination = async () => {
      if (!user) return;

      try {
        // Query saved_destinations table
        const { data, error } = await supabase
          .from('saved_destinations')
          .select('city')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          // A destination is already active, set it and do not open the modal
          onSelectCity(data[data.length - 1].city);
        } else {
          // First login, open popup modal
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Error fetching active destination', err);
        setIsOpen(true); // Fail-safe
      }
    };

    checkActiveDestination();
  }, [user, onSelectCity]);

  const handleSelect = async (cityName: string) => {
    if (!user) return;
    setIsOpen(false);
    onSelectCity(cityName);

    try {
      // Save selected destination to Supabase
      await supabase
        .from('saved_destinations')
        .insert({
          user_id: user.id,
          city: cityName
        });
    } catch (err) {
      console.error('Failed to save active destination to database', err);
    }
  };

  const filteredCities = CITY_OPTIONS.filter(city => 
    city.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md pointer-events-none"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col p-8 gap-6 max-h-[90vh]"
          >
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-1.5 select-none">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <MapPin size={20} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 justify-center">
                Select Active Destination <Sparkles size={14} className="text-primary fill-primary" />
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Which city are you currently exploring today? Select one to customize your companion feed and interactive map.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city (e.g. Dehradun, Jaipur...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 text-sm font-semibold transition-all duration-300 outline-none placeholder:text-slate-400 focus:border-primary/50 focus:bg-white"
              />
            </div>

            {/* List Cities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto p-1">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city.label)}
                  className="group relative h-28 rounded-2xl overflow-hidden border border-slate-100 text-left transition-all duration-300 hover:shadow-lg hover:border-primary/30"
                >
                  <img
                    src={city.image}
                    alt={city.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
                  
                  <div className="absolute inset-0 p-5 flex flex-col justify-center">
                    <span className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                      {city.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300 mt-1 line-clamp-2 max-w-[200px]">
                      {city.desc}
                    </span>
                  </div>
                </button>
              ))}

              {filteredCities.length === 0 && (
                <div className="col-span-2 text-center py-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  No matching cities found
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default DestinationPopup;
