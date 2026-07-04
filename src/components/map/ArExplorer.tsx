import React from 'react';
import { Camera, Sparkles, Eye } from 'lucide-react';
import { Badge } from '../ui/Badge';

/**
 * AI AR Explorer Component.
 * Renders a simulated preview interface for an Augmented Reality heritage walk.
 * Shows mockup elements including camera viewport, floating AR pins, and controls.
 * 
 * @component
 * @returns {React.ReactElement} The rendered AI AR Explorer component.
 */
export const ArExplorer: React.FC = () => {
  return (
    <div className="glass-effect rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col items-center text-center gap-6 w-full">
      <div className="flex flex-col items-center gap-1 select-none">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
          <Eye size={18} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI AR Explorer</h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Augmented Reality Heritage Walk</span>
      </div>

      {/* Simulated Phone Mockup */}
      <div className="relative w-full max-w-[280px] h-[400px] border-[10px] border-slate-800 rounded-[36px] bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
          <div className="w-8 h-1 bg-slate-900 rounded-full" />
        </div>

        {/* Camera Viewport Mockup (Using a beautiful background image representing Dehradun valleys or palaces) */}
        <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-slate-950/20" />

        {/* AR Overlay Markers */}
        <div className="relative z-10 flex flex-col h-full justify-between pt-6 pb-2">
          {/* Top Info */}
          <div className="flex items-center justify-between text-white text-[9px] font-bold bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 select-none">
            <span className="flex items-center gap-1">
              <Camera size={10} className="text-primary animate-pulse" /> AR Mode Active
            </span>
            <span>DED Foothills</span>
          </div>

          {/* Floating AR Pins */}
          <div className="flex flex-col gap-12 w-full px-2">
            {/* Pin 1 */}
            <div className="self-start bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/20 animate-bounce">
              <span>✦ Robber's Cave</span>
              <span className="text-[7px] text-emerald-200">120m</span>
            </div>

            {/* Pin 2 */}
            <div className="self-end bg-purple-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/20 animate-bounce [animation-delay:0.5s]">
              <span>✦ Old Shrine</span>
              <span className="text-[7px] text-purple-200">45m</span>
            </div>
          </div>

          {/* Interactive controls mockup */}
          <div className="flex flex-col gap-2 items-center">
            <button 
              disabled
              className="w-full py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 flex items-center justify-center gap-1"
            >
              <Sparkles size={10} /> Scan Landscape
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Badge variant="warning">Coming Soon</Badge>
        <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">
          Walk through local valleys and point your camera to unlock historical stories, holographic guides, and local folklore overlays.
        </p>
      </div>
    </div>
  );
};
export default ArExplorer;
