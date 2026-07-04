import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-full
        border transition-all duration-300 text-xs font-semibold
        focus:outline-none focus:ring-2 focus:ring-primary/40
        bg-surface border-border text-text-secondary
        hover:border-primary/40 hover:text-primary
      "
    >
      {/* Track */}
      <div className="relative w-8 h-4 rounded-full bg-white/10 dark:bg-white/10 border border-white/10 transition-colors duration-300 shrink-0">
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
            isDark
              ? 'left-4 bg-primary'
              : 'left-0.5 bg-amber-400'
          }`}
        />
      </div>
      {isDark ? (
        <Moon size={13} className="text-primary" />
      ) : (
        <Sun size={13} className="text-amber-500" />
      )}
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;
