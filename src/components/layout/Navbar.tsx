import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, CalendarRange, User, LogOut, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase/supabaseClient';

/**
 * Navbar component provides sticky header navigation, logo, and active path indicators.
 * It also exposes a simulated/real logout action.
 */
export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  const navItems = useMemo(() => [
    { path: '/', label: 'Explore', icon: <Compass size={18} aria-hidden="true" /> },
    { path: '/planner', label: 'Trip Planner', icon: <CalendarRange size={18} aria-hidden="true" /> },
    { path: '/profile', label: 'My Lens', icon: <User size={18} aria-hidden="true" /> },
  ], []);

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4 glass-effect border-b border-slate-100 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group" aria-label="LocalLens - Go to homepage">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
          <Compass size={20} className="animate-pulse" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-base leading-none tracking-tight flex items-center gap-1">
            LocalLens <Sparkles size={12} className="text-primary fill-primary" aria-hidden="true" />
          </span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">AI Travel Companion</span>
        </div>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-2 md:gap-4 bg-slate-100/60 p-1.5 rounded-full">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                isActive 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center p-2.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
        aria-label="Logout"
        title="Sign Out"
      >
        <LogOut size={18} aria-hidden="true" />
      </button>
    </nav>
  );
};
