'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconMail as Mail, IconLock as Lock, IconShieldCheck as ShieldCheck, IconArrowRight as ArrowRight, IconLoader2 as Loader2, IconSparkles as Sparkles, IconBuilding as Building2, IconUsers as Users, IconEye as Eye, IconEyeOff as EyeOff, IconUser as UserIcon, IconPhone as Phone } from '@tabler/icons-react';

import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import api from '@/lib/api';

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
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: any = { full_name: name, email, phone, password };
      if (refCode) payload.referral_code = refCode;
      
      const res = await api.post(signupEndpoint, payload);
      
      const token = res.data.token || res.data.access_token;
      if (token) {
        setAuth(res.data.user, token);
        toast.success("Account created successfully!");
        router.push(redirectPath);
      } else {
        toast.success("Account created! Please log in.");
        router.push('/login');
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
              Join thousands of students and educators across Nigeria and beyond.
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
        {/* Mobile Logo overlay */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
           <Image src={logoSrc} alt={brandTitle} width={48} height={48} className="bg-slate-900 rounded-lg p-1" />
           <span className="font-bold text-slate-900">{brandTitle}</span>
        </div>

        <div className="w-full max-w-md py-12">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create an Account</h2>
            <p className="text-slate-500 font-medium">Join {brandTitle} and start learning today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="08012345678"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 mt-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

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
      </div>
    </div>
  );
}
