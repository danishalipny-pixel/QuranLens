import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/profile');
    } else {
      setFormError(res.message || 'Registration failed.');
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
          Create Your Learning Account
        </h1>
        <p className="text-xs text-charcoal-500">
          Save your reflections, organize study collections, and build daily reading habits.
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 text-charcoal-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 text-charcoal-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 dark:text-charcoal-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-charcoal-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}
