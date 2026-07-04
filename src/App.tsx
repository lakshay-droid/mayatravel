import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { RequireAuth } from './components/layout/RequireAuth';

// Route-level Code Splitting for optimal page loading efficiency
const Login = React.lazy(() => import('./pages/Login/Login').then(m => ({ default: m.Login })));
const Onboarding = React.lazy(() => import('./pages/Onboarding/Onboarding').then(m => ({ default: m.Onboarding })));
const Home = React.lazy(() => import('./pages/Home/Home').then(m => ({ default: m.Home })));
const Planner = React.lazy(() => import('./pages/Planner/Planner').then(m => ({ default: m.Planner })));
const Profile = React.lazy(() => import('./pages/Profile/Profile').then(m => ({ default: m.Profile })));

/**
 * App component provides router boundaries, Global layout wrapper (PageContainer),
 * and route definitions dynamically chunked using React.Suspense.
 */
export const App: React.FC = () => {
  return (
    <Router>
      <PageContainer>
        <React.Suspense
          fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="mt-4 text-xs font-semibold text-text-muted uppercase tracking-widest">
                Loading Lens...
              </span>
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes (RequireAuth) */}
            <Route
              path="/onboarding"
              element={
                <RequireAuth requireOnboarding={false}>
                  <Onboarding />
                </RequireAuth>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/planner"
              element={
                <RequireAuth>
                  <Planner />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </PageContainer>
    </Router>
  );
};

export default App;
