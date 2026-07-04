import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Sparkles, Sun, ExternalLink } from 'lucide-react';
import type { Attraction } from '../../types';

interface AttractionSheetProps {
  attraction: Attraction | null;
  onClose: () => void;
  onStory: (name: string) => void;
}

/**
 * AttractionSheet component renders a bottom sheet containing details about the active attraction.
 * 
 * @param attraction Selected attraction details (or null if closed)
 * @param onClose Callback to close the bottom sheet
 * @param onStory Callback to trigger storytelling mode
 */
export const AttractionSheet: React.FC<AttractionSheetProps> = ({ attraction, onClose, onStory }) => {
  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (attraction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [attraction]);

  return (
    <AnimatePresence>
      {attraction && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bottom-sheet-overlay"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={attraction.name}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bottom-sheet pb-safe"
            style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom))' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Hero Photo */}
            <div className="relative h-56 mx-4 mt-2 rounded-2xl overflow-hidden">
              <img
                src={attraction.photo}
                alt={attraction.name}
                className="w-full h-full object-cover"
                loading="lazy"
                fetchPriority="low"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 photo-overlay" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <X size={16} aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {attraction.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pt-5 pb-4">
              <h2 className="text-xl font-bold text-text-primary mb-1">{attraction.name}</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{attraction.description}</p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: Clock, label: 'Duration', value: attraction.visitDuration },
                  { icon: MapPin, label: 'Difficulty', value: attraction.difficulty },
                  { icon: Sun, label: 'Best Time', value: attraction.bestTime },
                  { icon: ExternalLink, label: 'Open Hours', value: attraction.openingHours },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="glass-card p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-primary" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => onStory(attraction.name)}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles size={16} aria-hidden="true" />
                Tell me the Story
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AttractionSheet;
