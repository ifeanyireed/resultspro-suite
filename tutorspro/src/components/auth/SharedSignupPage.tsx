'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconMail as Mail, IconLock as Lock, IconShieldCheck as ShieldCheck, IconArrowRight as ArrowRight, IconLoader2 as Loader2, IconSparkles as Sparkles, IconBuilding as Building2, IconUsers as Users, IconEye as Eye, IconEyeOff as EyeOff, IconUser as UserIcon, IconPhone as Phone } from '@tabler/icons-react';

import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import api, { USERS_API } from '@/lib/api';
import { useGoogleLogin } from '@react-oauth/google';

export interface SharedSignupPageProps {
  appName?: string;
  appDescription?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  logoSrc?: string;
  redirectPath?: string;
  signupEndpoint?: string;
}

export default function SharedSignupPage({
  appName = "Edu Suite",
  appDescription = "The Engine Powering Modern Education.",
  brandTitle = "ResultsPRO",
  brandSubtitle = "EDU SUITE",
  logoSrc = "/logo.png",
  redirectPath = "/dashboard",
  signupEndpoint = "/auth/signup",
}: SharedSignupPageProps) {
  const router = useRouter();
  const [refCode, setRefCode] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRefCode(params.get('ref') || '');
    }
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setResendLoading(true);
    try {
      await api.post(`${USERS_API}/api/v1/auth/resend-verification`, { email });
      setResendCountdown(60);
      toast.success('Verification code resent successfully.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await api.post(`${USERS_API}/api/v1/auth/google`, { idToken: tokenResponse.access_token, app_module: 'tutorspro' });
        const user = res.data.user;
        setAuth(user, res.data.token || res.data.access_token);
        toast.success('Logged in with Google! 🎉');
        router.push(redirectPath);
      } catch {
        toast.error('Google login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
      setIsLoading(false);
    },
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: any = { full_name: name, email, phone, password, app_module: 'tutorspro' };
      if (refCode) payload.referral_code = refCode;
      
      const res = await api.post(signupEndpoint, payload);
      const token = res.data.token || res.data.access_token;
      if (token) {
        setAuth(res.data.user, token);
        toast.success("Account created successfully!");
        
        let targetPath = redirectPath;
        try {
          const payloadJwt = JSON.parse(atob(token.split('.')[1]));
          const roles = payloadJwt.roles || res.data.user?.roles || [];
          if (roles.includes("TUTOR") || roles.includes("tutor")) targetPath = "/tutor";
          else if (roles.includes("STUDENT") || roles.includes("student")) targetPath = "/student";
          else if (roles.includes("PARENT") || roles.includes("parent")) targetPath = "/parent";
        } catch (e) {
          console.error("Failed to parse token for redirect", e);
        }

        router.push(targetPath);
      } else {
        toast.success("Account created! Check your email for OTP.");
        setShowOTP(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Aesthetic */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0B1021]">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Image src={logoSrc} alt={brandTitle} width={64} height={64} className="object-contain" priority />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">{brandTitle}</h1>
              <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest">{brandSubtitle}</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Version 2.0 Released</span>
            </div>
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              {appDescription}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Manage schools, tutors, assessments, and payments across the entire ecosystem from one centralized command center.
            </p>

            <div className="flex space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">140+</h4>
                  <p className="text-slate-400 text-sm">Active Schools</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">4.8k+</h4>
                  <p className="text-slate-400 text-sm">Total Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>End-to-end encrypted infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-16 relative overflow-y-auto">
        {showOTP ? (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Verify Your Email</h2>
              <p className="text-slate-500 text-sm">
                We've sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>.
              </p>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setVerificationLoading(true);
              try {
                await api.post(`${USERS_API}/api/v1/auth/verify-email`, { token: otp });
                toast.success("Email verified successfully!");
                router.push('/login');
              } catch (err: any) {
                toast.error(err.response?.data?.error || "Invalid OTP");
              } finally {
                setVerificationLoading(false);
              }
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none" 
                  placeholder="------" 
                  maxLength={6}
                />
              </div>
              <button 
                type="submit" 
                disabled={verificationLoading || otp.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {verificationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify Account</span>}
              </button>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-500">Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || resendCountdown > 0}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {resendLoading ? "Resending..." : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        ) : (
        <div className="w-full max-w-md py-12 lg:py-0">
          
          {/* Mobile Logo standalone */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <Image src={logoSrc} alt={brandTitle} width={64} height={64} className="object-contain" priority />
          </div>
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create an Account</h2>
            <p className="text-slate-500 font-medium">Join {brandTitle} and start learning today.</p>
          </div>

          <div className="space-y-5">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-slate-200 rounded-full shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Protected by reCAPTCHA and subject to the ResultsPRO{' '}
              <a href="https://www.resultspro.ng/privacy" className="text-slate-600 hover:underline">Privacy Policy</a> and{' '}
              <a href="https://www.resultspro.ng/terms" className="text-slate-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
