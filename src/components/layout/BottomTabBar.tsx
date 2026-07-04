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
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-t border-white/8"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-4 pt-2 pb-1">
        {tabs.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-5 py-1 rounded-2xl transition-all duration-300 group ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary/15' : 'group-hover:bg-white/5'
                }`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="transition-all duration-300"
                    aria-hidden="true"
                  />
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-text-muted'
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
