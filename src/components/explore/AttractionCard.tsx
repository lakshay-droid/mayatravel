import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Sparkles } from 'lucide-react';
import type { Attraction } from '../../types';

export interface AttractionCardProps {
  attraction: Attraction;
  onTap: (attraction: Attraction) => void;
  index?: number;
}

const categoryColors: Record<string, string> = {
  Temples: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Culture: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Museums: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Hidden Gems': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Food: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Adventure: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  default: 'bg-primary/20 text-primary-light border-primary/30',
};

const getStableRating = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);
  const rating = 4.0 + (positiveHash % 10) * 0.1;
  return rating.toFixed(1);
};

/**
 * AttractionCard component renders a button containing card information of a specific travel attraction.
 * 
 * @param attraction The attraction details object
 * @param onTap Callback when the card is tapped/clicked
 * @param index Optional list index for staggered animation delays
 */
export const AttractionCard = React.memo(({ attraction, onTap, index = 0 }: AttractionCardProps) => {
  const colorClass = categoryColors[attraction.category] || categoryColors.default;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onTap(attraction)}
      className="w-full text-left photo-card group"
      aria-label={`View details for ${attraction.name}`}
    >
      {/* Hero Photo */}
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <img
          src={attraction.photo}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          fetchPriority="low"
        />
        <div className="absolute inset-0 photo-overlay" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-sm ${colorClass}`}>
            {attraction.category}
          </span>
        </div>

        {/* Story trigger hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Sparkles size={10} aria-hidden="true" />
            Story
          </div>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-snug mb-1 drop-shadow">
            {attraction.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/70 text-xs">
              <Clock size={11} aria-hidden="true" />
              {attraction.visitDuration}
            </span>
            <span className="flex items-center gap-1 text-white/70 text-xs">
              <MapPin size={11} aria-hidden="true" />
              {attraction.difficulty}
            </span>
            <span className="flex items-center gap-1 text-amber-400 text-xs ml-auto">
              <Star size={11} fill="currentColor" aria-hidden="true" />
              {getStableRating(attraction.name)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
});

export default AttractionCard;
