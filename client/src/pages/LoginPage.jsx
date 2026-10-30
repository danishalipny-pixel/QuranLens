import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(res.message || 'Login failed.');
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    const res = await login(demoEmail, demoPass);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-arabic text-xl font-bold shadow-soft">
            قرآن
          </div>
          <span className="text-2xl font-bold font-serif text-charcoal-900 dark:text-white">
            QuranLens
          </span>
        </Link>
        <h1 className="text-xl font-bold text-charcoal-900 dark:text-white pt-2">
          Welcome to your Study Account
        </h1>
        <p className="text-xs text-charcoal-500">
          Sign in to access your saved bookmarks, reading history, and personal notes.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-charcoal-900 p-8 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft-lg space-y-5">
        
        {(formError || error) && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 text-charcoal-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 text-charcoal-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="pt-4 border-t border-ivory-200 dark:border-charcoal-800 space-y-2">
          <div className="text-[11px] font-semibold text-charcoal-400 text-center">
            Instant One-Click Demo Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('demo@quranlens.com', 'demo1234')}
              className="py-1.5 px-3 rounded-lg bg-ivory-100 dark:bg-charcoal-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 border border-ivory-300 dark:border-charcoal-700 transition"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@quranlens.com', 'admin1234')}
              className="py-1.5 px-3 rounded-lg bg-gold-50 dark:bg-gold-950/40 hover:bg-gold-100 text-xs font-semibold text-gold-900 dark:text-gold-300 border border-gold-300 dark:border-gold-800/60 transition"
            >
              Admin Account
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs text-charcoal-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>

    </div>
  );
}
