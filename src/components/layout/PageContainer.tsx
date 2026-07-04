import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BottomTabBar } from './BottomTabBar';
import { Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Props for the PageContainer component.
 * 
 * @interface PageContainerProps
 */
interface PageContainerProps {
  /**
   * The child components or content to be rendered inside the page container.
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * A layout wrapper component that conditionally displays the application frame.
 * For login and onboarding routes, it renders a fullscreen plain layout.
 * For standard application routes, it includes a sticky header, bottom navigation bar, and animations.
 * 
 * @param {PageContainerProps} props - Props for configuring the PageContainer.
 * @returns {React.ReactElement} The rendered PageContainer element.
 */
export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const isPlainLayout = path === '/login' || path === '/onboarding';

  // Plain layout — no chrome (used for Login & Onboarding fullscreen pages)
  if (isPlainLayout) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col overflow-x-hidden font-sans">
        <motion.div
          key={path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // App layout — minimal top header + content + bottom tab bar
  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      {/* Minimal top header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-glow">
            <Compass size={16} className="text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-black text-text-primary text-base tracking-tight">LocalLens</span>
            <Sparkles size={11} className="text-primary" />
          </div>
        </Link>
        <ThemeToggle />
      </header>

      {/* Page content — padded above bottom tab bar */}
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-2xl mx-auto w-full px-4 pt-5 pb-28 flex flex-col gap-5"
      >
        {children}
      </motion.main>

      {/* Bottom navigation tab bar */}
      <BottomTabBar />
    </div>
  );
};
