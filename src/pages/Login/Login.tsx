import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80',
    city: 'Jaipur',
    tagline: 'Pink City · Rajput Heritage',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Varanasi_Munshi_Ghat3.jpg',
    city: 'Varanasi',
    tagline: 'Sacred Ghats · Ancient Rituals',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    city: 'Goa',
    tagline: 'Golden Beaches · Spice Gardens',
  },
  {
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
    city: 'Dehradun',
    tagline: 'Valley of Doon · Himalayan Gateway',
  },
];

/**
 * Login component renders user authentication options (signIn / signUp).
 * It features a cycling fullscreen photography carousel (LCP) and pre-filled demo accounts.
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Prefill demo user by default per user request
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  // Auto-cycle hero images every 4 seconds
  useEffect(() => {
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsSignUp(prev => !prev);
    setError(null);
    if (isSignUp) {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('');
      setPassword('');
    }
    setEmail('');
  }, [isSignUp]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !username.trim() || !password.trim()) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }
        const result = await signup(email, password, username);
        if (result.success) {
          navigate('/onboarding', { replace: true });
        } else {
          setError(result.error || 'Signup failed.');
        }
      } else {
        if (!username.trim() || !password.trim()) {
          setError('Please enter your username and password.');
          setLoading(false);
          return;
        }
        const result = await login(username, password);
        if (result.success) {
          const hasOnboarded = localStorage.getItem(`onboarded_${username.trim()}`);
          navigate(hasOnboarded ? '/' : '/onboarding', { replace: true });
        } else {
          setError(result.error || 'Invalid credentials.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, username, password, isSignUp, login, signup, navigate]);

  const currentHero = HERO_IMAGES[heroIdx];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-end md:items-center justify-center">
      {/* Full-screen rotating hero background - LCP: fetchpriority high */}
      <AnimatePresence mode="sync">
        <motion.div
          key={heroIdx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <img
            src={currentHero.url}
            alt={currentHero.city}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* City label top-left */}
      <motion.div
        key={`label-${heroIdx}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-6 z-10"
      >
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{currentHero.tagline}</p>
        <h2 className="text-white text-2xl font-black tracking-tight">{currentHero.city}</h2>
      </motion.div>

      {/* Hero indicator dots */}
      <div className="absolute top-10 right-6 z-10 flex flex-col gap-1.5">
        {HERO_IMAGES.map((item, i) => (
          <button
            key={item.city}
            onClick={() => setHeroIdx(i)}
            className={`w-1 rounded-full transition-all duration-500 ${
              i === heroIdx ? 'h-6 bg-white' : 'h-2 bg-white/30'
            }`}
            aria-label={`View ${item.city}`}
          />
        ))}
      </div>

      {/* Glass login card — slide up from bottom */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4 mb-8 md:mb-0"
      >
        <div className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-premium">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center shadow-glow">
              <Compass size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-lg text-text-primary tracking-tight">LocalLens</span>
                <Sparkles size={12} className="text-primary" aria-hidden="true" />
              </div>
              <p className="text-[10px] text-text-muted font-semibold uppercase tracking-widest">AI Travel Companion</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-text-primary mb-1">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            {isSignUp ? 'Sign up to explore destinations with AI' : 'Sign in to explore destinations with AI'}
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-4"
              role="alert"
            >
              <AlertCircle size={15} className="text-rose-400 shrink-0" aria-hidden="true" />
              <p className="text-rose-300 text-xs font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            {isSignUp && (
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  aria-required="true"
                />
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-text-secondary mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-dark"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-12"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
              )}
              {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Continue')}
            </button>
          </form>

          {/* Toggle view link */}
          <div className="mt-5 text-center">
            <button
              onClick={handleToggleMode}
              className="text-xs text-primary font-semibold hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
