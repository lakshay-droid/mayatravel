import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Home, CalendarCheck } from 'lucide-react';
import type { LocalStay } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface LocalStayCardProps {
  stay: LocalStay;
}

/**
 * LocalStayCard component renders information about a homestay or local stay.
 * It provides cultural experience badges and allows simulated booking.
 * 
 * @param stay The stay details object
 */
export const LocalStayCard = React.memo(({ stay }: LocalStayCardProps) => {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBook = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBooked(true);
    }, 1200);
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glass-effect rounded-3xl overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover flex flex-col h-full"
    >
      {/* Stay Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 select-none">
        <img
          src={stay.photos[0]}
          alt={stay.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          loading="lazy"
          fetchPriority="low"
        />
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-bold text-white bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-wider">
            {stay.type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-amber-500 fill-amber-500" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-800">{stay.rating}</span>
        </div>
      </div>

      {/* Stay Content */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Home size={10} aria-hidden="true" /> Hosted by {stay.hostName}
          </span>
          <h4 className="font-extrabold text-base text-slate-800 tracking-tight leading-tight">
            {stay.name}
          </h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
            {stay.description}
          </p>
        </div>

        {/* Culture Experiences Bullet Points */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Culture Immersions</span>
          <div className="flex flex-wrap gap-1.5">
            {stay.cultureExperience.map((exp) => (
              <Badge key={`${stay.id}-${exp}`} variant="secondary">
                ✦ {exp}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price & Book Trigger */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</span>
            <span className="text-base font-extrabold text-slate-800">{stay.price}</span>
          </div>

          {booked ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <CheckCircle size={14} aria-hidden="true" /> Booked!
            </div>
          ) : (
            <Button
              onClick={handleBook}
              isLoading={loading}
              variant="glass"
              size="sm"
              className="flex items-center gap-1.5 shadow-sm text-slate-800 font-bold"
            >
              <CalendarCheck size={14} aria-hidden="true" /> Book Homestay
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default LocalStayCard;
