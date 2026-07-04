import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, CalendarRange, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Explore', icon: Compass },
  { path: '/planner', label: 'Planner', icon: CalendarRange },
  { path: '/profile', label: 'Profile', icon: User },
];

/**
 * BottomTabBar component provides sticky bottom tabbed navigation for small screens.
 */
export const BottomTabBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Main navigation"
    >
      {/* Solid backing layer */}
      <div className="absolute inset-0 bg-slate-950 border-t border-white/10 shadow-[0_-4px_32px_rgba(0,0,0,0.6)]" />

      <div className="relative flex items-center justify-around max-w-lg mx-auto px-4 pt-3 pb-1">
        {tabs.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-5 py-1 rounded-2xl transition-all duration-300 group ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary/20 shadow-[0_0_12px_rgba(108,99,255,0.3)]' : 'group-hover:bg-white/5'
                }`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-300"
                    aria-hidden="true"
                  />
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(108,99,255,0.8)]" />
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-slate-600'
                }`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabBar;
