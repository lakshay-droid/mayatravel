import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Frontend validation & sanitization
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setFormError('Please enter both username and password.');
      return;
    }

    const success = await login(cleanUsername, cleanPassword);
    if (success) {
      navigate('/');
    }
  };

  const activeError = formError || authError;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 overflow-hidden">
      {/* Dynamic Background Gradients (Landon Norris Style) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
            <Compass size={28} className="animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            LocalLens <Sparkles size={16} className="text-primary fill-primary" />
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium text-center px-4">
            Discover Places. Experience Culture. Travel Like a Local.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-xl border border-white/60">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Sign In</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
            Enter your credentials to start exploring
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {activeError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-semibold leading-relaxed"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{activeError}</span>
              </motion.div>
            )}

            <Input
              label="Username"
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Login Credentials Helper */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 select-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Demo Credentials</span>
            <div className="flex justify-between w-full text-xs font-medium text-slate-600">
              <span>Username: <strong className="text-slate-800">admin</strong></span>
              <span>Password: <strong className="text-slate-800">admin123</strong></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
