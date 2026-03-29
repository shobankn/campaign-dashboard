import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', { email, password, rememberMe });
      setLoading(false);
      // Add your real authentication logic here
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
            <ShieldCheck className="w-9 h-9" style={{ color: '#3889FA' }} />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2 text-lg">Sign in to access your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#3889FA] focus:ring-4 focus:ring-[#3889FA]/20 transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#3889FA] focus:ring-4 focus:ring-[#3889FA]/20 transition-all text-gray-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#3889FA] rounded border-gray-300"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-[#3889FA] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3889FA] hover:bg-[#2b6ed6] active:bg-[#1f5ab8] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#3889FA]/30 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-3">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account?{' '}
          <a href="#" className="text-[#3889FA] font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;