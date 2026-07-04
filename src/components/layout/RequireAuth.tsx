import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase, isMockMode } from '../../services/supabase/supabaseClient';

/**
 * Props for the RequireAuth component.
 * 
 * @interface RequireAuthProps
 */
interface RequireAuthProps {
  /**
   * The child components to render when authentication is successful.
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  /**
   * Whether to check and enforce onboarding preference state.
   * If true, non-onboarded users are redirected to the onboarding flow,
   * and onboarded users attempting to access the onboarding page are redirected to the homepage.
   * @type {boolean}
   * @default true
   */
  requireOnboarding?: boolean;
}

/**
 * A route guard component that protects sub-routes, requiring users to be authenticated.
 * It handles loading states, purges invalid/mock sessions in live production mode,
 * and routes users based on their onboarding status.
 * 
 * @param {RequireAuthProps} props - Props for configuring the authorization guard.
 * @returns {React.ReactElement} The rendered element or Navigate redirect.
 */
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

      // Live mode check: purge poisoned mock sessions (like usr-admin-123)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      if (!isMockMode && !isUuid) {
        sessionStorage.removeItem('locallens_user');
        window.location.href = '/login';
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
