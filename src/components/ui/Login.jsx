import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';

const Login = () => {
  const { isDark, toggle }              = useDarkMode();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log('Login attempt:', { email, password, rememberMe });
      setLoading(false);
    }, 1800);
  };

  // Derive styles from isDark directly — no reliance on Tailwind's `dark:` class cascade
  const s = {
    page:        isDark ? '#0a0f1e' : '#ffffff',
    card:        isDark ? '#111827' : '#ffffff',
    heading:     isDark ? '#f1f5f9' : '#111827',
    subtext:     isDark ? '#6b7280' : '#9ca3af',
    label:       isDark ? '#9ca3af' : '#4b5563',
    inputBg:     isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    inputBgFocus:isDark ? '#1f2937' : '#ffffff',
    inputBorder: isDark ? '#374151' : '#e5e7eb',
    inputBorderHover: isDark ? '#4b5563' : '#d1d5db',
    inputText:   isDark ? '#f1f5f9' : '#111827',
    placeholder: isDark ? '#6b7280' : '#9ca3af',
    divider:     isDark ? '#1f2937' : '#f3f4f6',
    dividerText: isDark ? '#4b5563' : '#9ca3af',
    googleBorder:isDark ? '#374151' : '#e5e7eb',
    googleBorderHover: isDark ? '#4b5563' : '#d1d5db',
    googleBg:    isDark ? '#1f2937' : '#f9fafb',
    googleText:  isDark ? '#d1d5db' : '#374151',
    footerText:  isDark ? '#6b7280' : '#9ca3af',
    checkBorder: isDark ? '#4b5563' : '#d1d5db',
    rememberText:isDark ? '#9ca3af' : '#6b7280',
    eyeHover:    isDark ? '#d1d5db' : '#374151',
  };

  const inputStyle = (field) => ({
    background: focusedField === field ? s.inputBgFocus : s.inputBg,
    border: `1px solid ${focusedField === field ? '#3889FA' : s.inputBorder}`,
    boxShadow: focusedField === field ? '0 0 0 3px rgba(56,137,250,0.12)' : 'none',
    color: s.inputText,
    transition: 'all 0.2s',
  });

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: s.page }}
    >
      {/* ── Left brand panel — always blue, no dark variant needed ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
        style={{ background: '#3889FA' }}
      >
        {/* Grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.25)', filter: 'blur(1px)' }} />
        <div className="absolute top-20 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.3)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-xs font-black tracking-tight">AD</span>
          </div>
          <span className="text-white font-bold text-sm tracking-wide">AdDashboard</span>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.15em] mb-4">Campaign Intelligence</p>
            <h2 className="text-white text-4xl font-bold leading-[1.15] mb-5">
              Every click.<br />Every conversion.<br />In one place.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Manage your campaigns, track performance, and generate AI-powered creative briefs — all from a single dashboard.
            </p>
          </motion.div>
        </div>

        {/* Stat pills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center gap-3">
          {[['12K+', 'Campaigns'], ['98%', 'Uptime'], ['4.9★', 'Rating']].map(([val, lbl]) => (
            <div key={lbl} className="bg-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2.5">
              <p className="text-white text-sm font-bold">{val}</p>
              <p className="text-white/60 text-[10px] font-medium mt-0.5">{lbl}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative" style={{ background: s.page }}>

        {/* Dark mode toggle — top right */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggle}
          className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: isDark ? '#9ca3af' : '#6b7280',
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span key="sun" initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.18 }} className="block">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              </motion.span>
            ) : (
              <motion.span key="moon" initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                transition={{ duration: 0.18 }} className="block">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#3889FA' }}>
              <span className="text-white text-xs font-black">AD</span>
            </div>
            <span className="font-bold text-sm" style={{ color: s.heading }}>AdDashboard</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1.5" style={{ color: s.heading }}>Welcome back</h1>
            <p className="text-sm font-medium" style={{ color: s.subtext }}>Sign in to continue to your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: s.label }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                  style={{ color: focusedField === 'email' ? '#3889FA' : s.placeholder }} />
                <input
                  id="email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none"
                  style={{
                    ...inputStyle('email'),
                    '::placeholder': { color: s.placeholder },
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: s.label }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                  style={{ color: focusedField === 'password' ? '#3889FA' : s.placeholder }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm font-medium outline-none"
                  style={inputStyle('password')}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 transition-colors"
                  style={{ color: s.placeholder }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0"
                  style={{
                    borderColor: rememberMe ? '#3889FA' : s.checkBorder,
                    background: rememberMe ? '#3889FA' : 'transparent',
                  }}
                  onClick={() => setRememberMe(p => !p)}
                >
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium select-none" style={{ color: s.rememberText }}>Remember me</span>
              </label>
              <a href="#" className="text-xs font-semibold hover:underline" style={{ color: '#3889FA' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.975 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white mt-2 disabled:opacity-70"
              style={{ background: '#3889FA', boxShadow: '0 4px 16px rgba(56,137,250,0.30)', transition: 'all 0.2s' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </motion.span>
                ) : (
                  <motion.span key="label" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: s.divider }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: s.dividerText }}>or</span>
            <div className="flex-1 h-px" style={{ background: s.divider }} />
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.012, background: s.googleBg, borderColor: s.googleBorderHover }}
            whileTap={{ scale: 0.985 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{ color: s.googleText, border: `1px solid ${s.googleBorder}`, background: 'transparent' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Sign up */}
          <p className="text-center text-xs mt-7" style={{ color: s.footerText }}>
            Don't have an account?{' '}
            <a href="#" className="font-semibold hover:underline" style={{ color: '#3889FA' }}>
              Create one free
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;