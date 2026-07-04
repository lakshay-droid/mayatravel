import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-6 text-center border-t border-slate-100 bg-white/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
      <div>
        &copy; {new Date().getFullYear()} LocalLens AI. Experience travel like a local.
      </div>
      <div className="flex items-center gap-1">
        Made for Hackathon with <Heart size={12} className="text-rose-500 fill-rose-500" /> & Generative AI
      </div>
    </footer>
  );
};
