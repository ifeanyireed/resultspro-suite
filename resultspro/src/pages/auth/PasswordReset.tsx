import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight01 } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/auth/forgot-password`, {
        email: email.trim(),
      });

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send reset link. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col">
        <Navigation />

        {/* Success Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
          {/* Background Image */}
          <img
            src="/Hero.png"
            className="absolute h-full w-full object-cover inset-0"
            alt="Background"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          <div className="relative z-10 max-w-md mx-auto text-center w-full">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-white">
              Check Your <span className="text-blue-400">Email</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              We've sent a password reset link to <span className="font-semibold text-white">{email}</span>
            </p>

            {/* Info Card */}
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] mb-8">
              <div className="space-y-4 text-left mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Follow the link in the email to reset your password. The link will expire in 24 hours.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-[12px] p-4">
                  <p className="text-gray-400 text-xs">
                    <span className="font-semibold text-blue-300">Tip:</span> Check your spam or junk folder if you don't see the email within a few minutes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEmail('');
                  setSubmitted(false);
                }}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white"
              >
                Try Different Email
                <ArrowRight01 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
                <p className="text-gray-400 text-sm">Modern results management for Nigerian schools.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Product</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
                  <li><a href="/features" className="hover:text-blue-400 transition-colors">Features</a></li>
                  <li><a href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Company</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Legal</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-blue-500/10 pt-8 text-center text-gray-500 text-sm">
              <p>&copy; 2026 Results Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Reset Request Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
        {/* Background Image */}
        <img
          src="/Hero.png"
          className="absolute h-full w-full object-cover inset-0"
          alt="Background"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-md mx-auto text-center w-full">          <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight text-white">
            Reset Password
          </h1>
          <p className="text-gray-400 text-sm mb-12">Enter your email to receive a reset link</p>

          {/* Reset Card */}
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder=" "
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-base"
                  disabled={loading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={email ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  Email Address
                </label>
              </div>

              {error && (
                <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <InlineLoadingSpinner size="sm" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight01 className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Back to Sign In
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/10 bg-black py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Results Pro</h4>
              <p className="text-gray-400 text-sm">Modern results management for Nigerian schools.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="/features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-white">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Results Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PasswordReset;
