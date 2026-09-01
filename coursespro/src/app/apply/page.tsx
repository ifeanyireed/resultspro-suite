'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Briefcase, Sparkles, Building2, Users, ShieldCheck, ArrowRight, Loader2, Target } from 'lucide-react';

export default function ApplyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/onboarding/plan');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Aesthetic */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0B1021]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="CoursesPRO" width={64} height={64} className="object-contain" priority />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">CoursesPRO</h1>
              <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest">COHORT APPLICATION</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Oct 15th Cohort Open</span>
            </div>
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Stop watching tutorials. Start shipping code.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              12 weeks of mentor-guided, project-based building. Join 24 other professionals and build the portfolio that gets you hired.
            </p>

            <div className="flex space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">24 Seats</h4>
                  <p className="text-slate-400 text-sm">Strictly limited</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-1">
                  <img src="/avatars/mentor.jpg" alt="Mentor" className="w-full h-full rounded-xl object-cover" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=Chidi+A&background=5546E0&color=fff'} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">Mentor Chidi</h4>
                  <p className="text-slate-400 text-sm">Senior Engineer @ Stripe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Applications close October 10th</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-16 relative h-screen overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
           <Image src="/logo.png" alt="CoursesPRO" width={48} height={48} className="bg-slate-900 rounded-lg p-1" />
           <span className="font-bold text-slate-900">CoursesPRO</span>
        </div>

        <div className="w-full max-w-md my-auto pt-12 lg:pt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Apply for Admission</h2>
            <p className="text-slate-500 font-medium">Tell us about your goals so we can place you in the right peer group.</p>
          </div>

          <form onSubmit={handleApply} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Ada" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Lovelace" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input type="email" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="ada@coursespro.co" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Current Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <select required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none">
                  <option value="" disabled selected>Select an option</option>
                  <option value="employed_tech">Employed in Tech</option>
                  <option value="employed_non_tech">Employed outside Tech</option>
                  <option value="student">Student / Recent Grad</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Why this cohort?</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <Target className="h-4 w-4 text-slate-400" />
                </div>
                <textarea required rows={3} className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none" placeholder="What are you hoping to achieve?"></textarea>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 font-medium">
              No payment required to apply. By submitting, you agree to our{' '}
              <Link href="#" className="text-slate-600 hover:underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
