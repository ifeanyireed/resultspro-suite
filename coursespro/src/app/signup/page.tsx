"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Building2, Users, ShieldCheck } from 'lucide-react';
// import axiosInstance from '@/lib/axiosConfig'; // we can mock the login for now or use this

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
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
            <Image src="/logo.png" alt="CoursesPRO" width={64} height={64} className="object-contain" priority />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">CoursesPRO</h1>
              <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest">EDU SUITE</p>
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
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
           <Image src="/logo.png" alt="CoursesPRO" width={48} height={48} className="bg-slate-900 rounded-lg p-1" />
           <span className="font-bold text-slate-900">CoursesPRO</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access the admin hub.</p>
          </div>

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
                  placeholder="user@coursespro.co"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
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
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Protected by reCAPTCHA and subject to the CoursesPRO{' '}
              <Link href="#" className="text-slate-600 hover:underline">Privacy Policy</Link> and{' '}
              <Link href="#" className="text-slate-600 hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
