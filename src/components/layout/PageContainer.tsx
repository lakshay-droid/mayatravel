import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const isPlainLayout = path === '/login' || path === '/onboarding';

  if (isPlainLayout) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center overflow-x-hidden font-sans">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 flex flex-col justify-center items-center"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:px-8 md:py-10 flex flex-col gap-8"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};
