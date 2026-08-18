import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight01, Eye, EyeOff, CheckSquare, Check } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PasswordResetConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const navigate = useNavigate();

  // Extract token and email from URL query params
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate that both token and email exist
    if (!token || !email) {
      setInvalidToken(true);
      setError('Invalid or expired reset link. Please request a new one.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!token || !email) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/auth/reset-password`, {
        email,
        token,
        newPassword: password,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-white">
              Password <span className="text-green-400">Reset!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Your password has been successfully reset.
            </p>

            {/* Info Card */}
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] mb-8">
              <div className="space-y-4 text-left mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your new password is now active. You can sign in with your updated credentials. Redirecting to login in 3 seconds...
                </p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-[12px] p-4">
                  <p className="text-gray-400 text-xs">
                    <span className="font-semibold text-green-300">Success:</span> Keep your new password secure and don't share it with anyone.
                  </p>
                </div>
              </div>

              <Link
                to="/auth/login"
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white"
              >
                Sign In
                <ArrowRight01 className="w-5 h-5" />
              </Link>
            </div>
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

  // Show error if invalid token
  if (invalidToken) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex flex-col">
        <Navigation />

        {/* Error Section */}
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v1m0-1v-1m0-4V9m0 4h2m0 0h1m-1-1h-1m0 0h-1" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-white">
              Invalid <span className="text-red-400">Link</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              This password reset link is invalid or has expired.
            </p>

            {/* Info Card */}
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] mb-8">
              <div className="space-y-4 text-left mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Password reset links expire after 1 hour for security reasons.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-[12px] p-4">
                  <p className="text-gray-400 text-xs">
                    <span className="font-semibold text-red-300">Solution:</span> Please request a new password reset link.
                  </p>
                </div>
              </div>

              <Link
                to="/auth/password-reset"
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white"
              >
                Request New Link
                <ArrowRight01 className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-center text-gray-400 text-sm">
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
  }

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Reset Confirm Section */}
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
          <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight text-white">
            Create New Password
          </h1>
          <p className="text-gray-400 text-sm mb-12">Enter a strong password for your account</p>

          {/* Reset Card */}
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder=" "
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-base pr-12"
                  disabled={loading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={password ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder=" "
                  className="w-full px-6 py-4 rounded-[15px] bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-base pr-12"
                  disabled={loading}
                />
                <label className="absolute left-6 top-4 text-gray-400 text-sm transition-all pointer-events-none"
                  style={confirmPassword ? { top: '-8px', fontSize: '12px', color: 'rgb(96, 165, 250)' } : {}}>
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-[12px] p-4">
                <p className="text-gray-400 text-xs leading-relaxed">
                  <span className="font-semibold text-blue-300">Password requirements:</span>
                  <br />• At least 8 characters
                  <br />• Mix of uppercase and lowercase
                  <br />• Include numbers and symbols
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !password.trim() || !confirmPassword.trim()}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <InlineLoadingSpinner size="sm" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    Reset Password
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

export default PasswordResetConfirm;
