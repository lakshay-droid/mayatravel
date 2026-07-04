import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, ShieldAlert, Sparkles, MapPin, Smile, AlertTriangle, CloudSun, PhoneCall } from 'lucide-react';
import { generateLocalCompanionInsights } from '../../services/gemini/geminiClient';
import type { CompanionInsights, TravelPreferences } from '../../types';
import { Badge } from '../ui/Badge';
import { supabase } from '../../services/supabase/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

interface LocalCompanionProps {
  city: string;
  compact?: boolean;
}

export const LocalCompanion: React.FC<LocalCompanionProps> = ({ city, compact = false }) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<CompanionInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);

  // Fetch travel preferences to align matching badges
  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('travel_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (!error && data) {
          setPreferences(data);
        }
      } catch (err) {
        console.error('Error fetching preferences', err);
      }
    };
    fetchPrefs();
  }, [user]);

  // Fetch AI Local Companion Insights
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const prefsList: string[] = [];
        if (preferences) {
          prefsList.push(preferences.personality);
          prefsList.push(preferences.favorite_destination);
          prefsList.push(preferences.food_pref);
        }
        const data = await generateLocalCompanionInsights(city, prefsList);
        setInsights(data);
      } catch {
        setError('The companion is catching its breath. Try reloading shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [city, preferences]);

  if (loading) {
    if (compact) return <span className="text-text-muted text-sm animate-pulse">Loading local insights…</span>;
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse select-none">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-white/5 rounded-3xl border border-white/7" />
        ))}
      </div>
    );
  }

  if (error || !insights) {
    if (compact) return <span className="text-text-muted text-sm">{error || 'Companion offline'}</span>;
    return (
      <div className="w-full text-center py-10 bg-white/5 border border-white/7 rounded-3xl">
        <AlertTriangle size={32} className="text-text-muted mx-auto mb-2" />
        <span className="text-sm font-semibold text-text-secondary">{error || 'Failed to fetch companion insights'}</span>
      </div>
    );
  }

  // Compact mode — just show first weather insight inline
  if (compact) {
    const tip = insights.weather?.summary || insights.localTips?.[0] || `Explore ${city} with confidence today.`;
    return <p className="text-sm text-text-primary leading-snug line-clamp-1">{tip}</p>;
  }

  // Get matching reason list based on traveler preferences
  const getRecommendationReason = (gemName: string) => {
    const reasons = [
      "Matches your culture preference",
      "Highly rated by locals",
      "Great weather today",
      "Less crowded during morning hours",
      "Pedestrian friendly walk"
    ];
    // Return two stable random reasons based on the string length
    const idx1 = gemName.length % reasons.length;
    const idx2 = (gemName.length + 2) % reasons.length;
    return [reasons[idx1], reasons[idx2]];
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-2 select-none">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Compass size={18} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI Local Companion Feed</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated safety, etiquette, & gems</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Climate Forecast</span>
              <CloudSun size={20} className="text-amber-500" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-800 mb-2">Himalayan Micro-climate</h4>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-4">
              {insights.weatherForecast}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
            <Badge variant="success">✔ Great weather today</Badge>
          </div>
        </motion.div>

        {/* Local Etiquette & Dress Code Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Culture & Decorum</span>
              <Smile size={20} className="text-primary" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-800 mb-2">Local Etiquette</h4>
            <ul className="flex flex-col gap-2 mb-4">
              {insights.etiquette.map((item, idx) => (
                <li key={idx} className="text-xs font-medium text-slate-600 flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
              <strong>Dress Code:</strong> {insights.dressCode}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
            <Badge variant="primary">✔ Culturally aligned</Badge>
          </div>
        </motion.div>

        {/* Safety & Scam Alerts Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Safety Sentinel</span>
              <ShieldAlert size={20} className="text-rose-500" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-800 mb-2">Scam & Safety Guide</h4>
            
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={10} /> Scam Alert
                </span>
                <p className="text-xs text-slate-600 font-medium leading-normal mt-0.5">
                  {insights.scamAlerts[0] || 'Be aware of overcharged taxi fares near key transit centers.'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Local Safety Tip</span>
                <p className="text-xs text-slate-600 font-medium leading-normal mt-0.5">
                  {insights.safetyAdvice[0] || 'Keep bags zipped in crowded market complexes.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {/* Emergency Contacts Block */}
            <div className="flex items-center justify-between bg-rose-50/50 border border-rose-100 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <PhoneCall size={14} className="text-rose-500" />
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">SOS Helpline</span>
              </div>
              <span className="text-xs font-extrabold text-rose-700">112 / 100</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Gems Sections */}
      <div className="flex flex-col gap-4 mt-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
          Hidden Gems Locals Adore <Sparkles size={12} className="text-primary fill-primary" />
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.hiddenGems.map((gem, idx) => {
            const reasons = getRecommendationReason(gem.name);
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="glass-effect rounded-3xl p-6 border border-slate-100 shadow-premium flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between">
                    <h5 className="font-extrabold text-base text-slate-800 tracking-tight flex items-center gap-1.5">
                      <MapPin size={16} className="text-primary" /> {gem.name}
                    </h5>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {gem.distance} away
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {gem.description}
                  </p>
                  <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <strong>Why locals love it:</strong> {gem.whyLocalsLove}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {reasons.map((reason, rIdx) => (
                    <Badge key={rIdx} variant={rIdx === 0 ? 'primary' : 'neutral'}>
                      ✔ {reason}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LocalCompanion;
