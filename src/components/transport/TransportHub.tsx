import React, { useMemo } from 'react';
import { Train, Bus, Car, Navigation, ExternalLink, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RouteEstimate {
  from: string;
  to: string;
  time: string;
  mode: string;
}

const DEHRADUN_ESTIMATES: RouteEstimate[] = [
  { from: 'Jolly Grant Airport (DED)', to: 'Dehradun City Center', time: '50-60 mins (30 km)', mode: 'Prepaid Taxi' },
  { from: 'Dehradun Railway Station', to: 'Paltan Bazaar / Clock Tower', time: '10-15 mins (2 km)', mode: 'Walking / Auto' },
  { from: 'ISBT Bus Terminal', to: 'Dehradun City Center', time: '25-30 mins (8 km)', mode: 'City Bus / Vikram' }
];

const JAIPUR_ESTIMATES: RouteEstimate[] = [
  { from: 'Jaipur International Airport (JAI)', to: 'Pink City (Hawa Mahal)', time: '35-45 mins (12 km)', mode: 'Uber / Ola Cab' },
  { from: 'Jaipur Junction Railway Station', to: 'Old City Gates', time: '15-20 mins (4 km)', mode: 'E-Rickshaw' },
  { from: 'Sindhi Camp Bus Stand', to: 'Johari Bazaar', time: '15-20 mins (3.5 km)', mode: 'Metro / Auto' }
];

interface TransportHubProps {
  city: string;
}

/**
 * TransportHub component displays lists of useful transit/booking portals
 * and travel time estimations for a specific city.
 * 
 * @param city The active city
 */
export const TransportHub: React.FC<TransportHubProps> = ({ city }) => {
  const isJaipur = city.toLowerCase() === 'jaipur';
  const estimates = useMemo(() => isJaipur ? JAIPUR_ESTIMATES : DEHRADUN_ESTIMATES, [isJaipur]);

  const transportLinks = useMemo(() => [
    { name: 'Google Maps', desc: 'Realtime route planning', url: 'https://www.google.com/maps', icon: <Navigation className="text-emerald-500" size={16} aria-hidden="true" /> },
    { name: 'Uber Rides', desc: 'Premium private cabs', url: 'https://www.uber.com', icon: <Car className="text-slate-800" size={16} aria-hidden="true" /> },
    { name: 'Ola Cabs', desc: 'City autos & rentals', url: 'https://www.olacabs.com', icon: <Car className="text-yellow-500" size={16} aria-hidden="true" /> },
    { name: 'IRCTC Railways', desc: 'Indian train booking', url: 'https://www.irctc.co.in', icon: <Train className="text-blue-500" size={16} aria-hidden="true" /> },
    { name: 'RedBus', desc: 'Intercity bus booking', url: 'https://www.redbus.in', icon: <Bus className="text-rose-500" size={16} aria-hidden="true" /> }
  ], []);

  return (
    <div className="glass-effect rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6 w-full">
      {/* Title */}
      <div className="flex items-center gap-2 select-none">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Train size={18} aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Local Transport Hub</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deep links & transit estimations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deep links section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Transit & Booking Portals</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transportLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100/60 hover:border-primary/20 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{link.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{link.desc}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-slate-400 group-hover:text-primary transition-colors" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Travel Time Estimations */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Travel Time Estimates ({city})</h4>
          <div className="flex flex-col gap-3">
            {estimates.map((est) => (
              <div
                key={`${est.from}-${est.to}`}
                className="p-4 bg-slate-50 border border-slate-100/60 rounded-2xl flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MapPin size={12} className="text-primary" aria-hidden="true" />
                    <span>{est.from}</span>
                  </div>
                  <Badge variant="info">{est.mode}</Badge>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold pl-4">
                  To: {est.to}
                </div>
                <div className="text-xs font-extrabold text-slate-800 pl-4 mt-1">
                  ⏱ {est.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransportHub;
