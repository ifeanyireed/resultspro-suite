"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Building2, Users, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import TenantLogo from '@/components/TenantLogo';
// import axiosInstance from '@/lib/axiosConfig'; // we can mock the login for now or use this

export default function LoginForm({ tenant }: { tenant: any }) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  React.useEffect(() => {
    if (user && token) {
      const Cookies = require('js-cookie');
      const selectedCohortId = Cookies.get('selected_cohort_id');
      
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        const roles = payload.roles || [];
        
        if (roles.includes('tenant-admin') || roles.includes('superadmin') || roles.includes('platform-admin')) {
          router.push('/admin');
          return;
        } else if (roles.includes('mentor')) {
          router.push('/mentor');
          return;
        }
      } catch (e) {
        // ignore decode errors
      }

      if (selectedCohortId) {
        router.push('/onboarding/orientation');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, token, router]);
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      const tenantSlug = params?.tenant;
      
      const res = await axios.post(`${USERS_API}/api/v1/auth/login`, { 
        email, 
        password,
        tenant_slug: tenantSlug,
        app_module: 'coursespro'
      });
      
      const token = res.data.access_token || res.data.token;
      if (token) {
        setAuth(res.data.user, token);
        
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          const roles = payload.roles || [];
          
          if (roles.includes('tenant-admin') || roles.includes('superadmin') || roles.includes('platform-admin')) {
            router.push('/admin');
          } else if (roles.includes('mentor')) {
            router.push('/mentor');
          } else {
            const Cookies = require('js-cookie');
            const selectedCohortId = Cookies.get('selected_cohort_id');
            if (selectedCohortId) {
              router.push('/onboarding/orientation');
            } else {
              router.push('/dashboard');
            }
          }
        } catch (e) {
          const Cookies = require('js-cookie');
          const selectedCohortId = Cookies.get('selected_cohort_id');
          if (selectedCohortId) {
            router.push('/onboarding/orientation');
          } else {
            router.push('/dashboard');
          }
        }
      }
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.response?.status === 403 && err.response?.data?.error === "unverified") {
        setShowOTP(true);
        setError('');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed');
      }
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
            <TenantLogo theme="dark" height={40} logoUrl={tenant?.logo_url} darkLogoUrl={tenant?.dark_logo_url} flattenLogo={tenant?.flatten_logo} tenantName={tenant?.name} />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">{tenant?.name || "Tenant"}</h1>
              <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest">Learning Management System</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Version 2.0 Released</span>
            </div>
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              The Ultimate Learning Management System
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Manage cohorts, peer reviews, and interactive learning, and payments across the entire ecosystem from one centralized command center.
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

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-16 relative">
        {/* Mobile Logo overlay */}
        <div className="lg:hidden flex items-center justify-center mb-10 w-full absolute top-8 left-0 right-0">
           <TenantLogo theme="light" height={40} logoUrl={tenant?.logo_url} darkLogoUrl={tenant?.dark_logo_url} flattenLogo={tenant?.flatten_logo} tenantName={tenant?.name} />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access the hub.</p>
          </div>

          {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="admin@school.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-4">
            <p className="text-sm font-medium text-slate-600">
              Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Protected by reCAPTCHA and subject to the {tenant?.name || "Tenant"}{' '}
              <a href="https://www.resultspro.ng/privacy" className="text-slate-600 hover:underline">Privacy Policy</a> and{' '}
              <a href="https://www.resultspro.ng/terms" className="text-slate-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
