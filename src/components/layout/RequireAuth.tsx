import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/supabaseClient';

interface RequireAuthProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requireOnboarding = true 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [checkingPreferences, setCheckingPreferences] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkPreferences = async () => {
      if (!user) {
        setCheckingPreferences(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('travel_preferences')
          .select('id')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          setHasPreferences(true);
        } else {
          setHasPreferences(false);
        }
      } catch (err) {
        console.error('Failed to verify travel preferences', err);
        setHasPreferences(false);
      } finally {
        setCheckingPreferences(false);
      }
    };

    if (isAuthenticated) {
      checkPreferences();
    } else if (!loading) {
      setCheckingPreferences(false);
    }
  }, [user, isAuthenticated, loading]);

  if (loading || checkingPreferences) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading LocalLens AI...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed onboarding and is not currently on /onboarding, redirect
  if (requireOnboarding && !hasPreferences && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user HAS completed onboarding and tries to visit /onboarding, redirect to home
  if (hasPreferences && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
