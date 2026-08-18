import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight01, Mail, RotateCcw } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Get email from state or localStorage
    const passedEmail = location.state?.email || localStorage.getItem('registerEmail');
    if (!passedEmail) {
      navigate('/auth/register');
      return;
    }
    setEmail(passedEmail);
  }, [location, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/auth/verify-email`, {
        email,
        otp: otpCode,
      });

      // Clear stored email
      localStorage.removeItem('registerEmail');

      // Store school info from verification response for next steps
      if (response.data.data?.schoolId) {
        localStorage.setItem('schoolId', response.data.data.schoolId);
      }

      // Redirect with success message and school info
      navigate('/auth/login', {
        state: { 
          message: 'Email verified successfully! You can now login.',
          fromEmailVerification: true,
        },
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);

    try {
      await axios.post(`${API_BASE}/auth/resend-verification`, { email });
      // Start countdown immediately after successful request
      setResendCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setSuccess('✓ Verification code sent! Check your email.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Verification Section */}
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
          <h1 className="text-5xl md:text-5xl font-bold mb-2 tracking-tight leading-tight text-white">
            Verify Email
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            We sent a 6-digit code to:
          </p>
          <p className="text-blue-400 text-sm mb-12 font-semibold">
            {email}
          </p>

          {/* Verification Card */}
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    placeholder="-"
                    className="w-12 h-14 text-center text-lg font-bold rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    disabled={loading}
                  />
                ))}
              </div>

              {error && (
                <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-[12px] bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <InlineLoadingSpinner size="sm" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight01 className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend Button */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || resendCountdown > 0}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  {resendLoading ? (
                    <>
                      <Loading01 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCountdown > 0 ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resend in {resendCountdown}s
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resend Code
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-400 text-xs mt-8">
            <a href="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Use different email
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
