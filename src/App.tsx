import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { RequireAuth } from './components/layout/RequireAuth';
import { Login } from './pages/Login/Login';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { Home } from './pages/Home/Home';
import { Planner } from './pages/Planner/Planner';
import { Profile } from './pages/Profile/Profile';

export const App: React.FC = () => {
  return (
    <Router>
      <PageContainer>
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
      </PageContainer>
    </Router>
  );
};

export default App;
