import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

const CITY_IMAGES: Record<string, string> = {
  Dehradun: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  Jaipur: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
  Varanasi: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
  Goa: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
};

const CITY_TAGLINES: Record<string, string> = {
  Dehradun: 'Valley of Doon · Hidden Temples · Himalayan Gateway',
  Jaipur: 'Pink City · Royal Palaces · Rajput Heritage',
  Varanasi: 'Spiritual Capital · Sacred Ghats · Ancient Rituals',
  Goa: 'Golden Beaches · Portuguese Heritage · Spice Gardens',
};

interface CityHeroProps {
  city: string;
  availableCities: string[];
  onCityChange: (city: string) => void;
}

/**
 * CityHero component displays a prominent banner for the currently selected city (LCP target).
 * 
 * @param city Active city
 * @param availableCities List of cities available to select
 * @param onCityChange Callback to select a new city
 */
export const CityHero: React.FC<CityHeroProps> = ({ city, availableCities, onCityChange }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative w-full h-52 rounded-2xl overflow-hidden">
      {/* Background image with transition - LCP target: fetchpriority high, no lazy loading */}
      <motion.img
        key={city}
        src={CITY_IMAGES[city] || CITY_IMAGES.Jaipur}
        alt={city}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        fetchPriority="high"
      />
      <div className="absolute inset-0 photo-overlay" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-primary-light" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Now Exploring</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">{city}</h1>
            <p className="text-white/50 text-xs font-medium mt-1">{CITY_TAGLINES[city] || ''}</p>
          </div>

          {/* City selector */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all"
              aria-label="Change city"
              aria-expanded={open}
            >
              Change <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {open && (
              <div className="absolute right-0 bottom-full mb-2 bg-surface-elevated border border-white/10 rounded-2xl overflow-hidden shadow-premium min-w-[140px] z-10">
                {availableCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => { onCityChange(c); setOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      c === city
                        ? 'bg-primary/20 text-primary'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityHero;
