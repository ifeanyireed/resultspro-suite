'use client';

import React, { useState } from 'react';
import TenantLogo from '@/components/TenantLogo';
import { useRouter } from 'next/navigation';
import { User, Mail, Briefcase, Sparkles, Users, ShieldCheck, ArrowRight, Loader2, Target, GraduationCap } from 'lucide-react';

export default function MentorApplyForm({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate application process
    setTimeout(() => {
      setIsLoading(false);
      // Typically mentors would see a confirmation screen, but for now we route them to home
      router.push('/login'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Aesthetic */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#0B1021]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/20 blur-[150px]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center space-x-3">
            <TenantLogo theme="dark" height={40} logoUrl={tenant?.logo_url} darkLogoUrl={tenant?.dark_logo_url} flattenLogo={tenant?.flatten_logo} tenantName={tenant?.name} />
            <div>
              <h1 className="font-bold text-white text-3xl tracking-tight">{tenant?.name || "Tenant"}</h1>
              <p className="text-red-400 font-semibold text-xs uppercase tracking-widest">INSTRUCTOR APPLICATION</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-blue-400 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>We're Hiring Instructors</span>
            </div>
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Become an Instructor.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Share your industry expertise with a global audience, lead interactive cohorts, and earn a steady passive income while shaping the next generation.
            </p>

            <div className="flex space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">Top Talent</h4>
                  <p className="text-slate-400 text-sm">Train the best</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xl">Earn More</h4>
                  <p className="text-slate-400 text-sm">Multiple payout models</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Competitive compensation</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-16 relative h-screen overflow-y-auto">
        <div className="lg:hidden flex items-center justify-center mb-10 w-full absolute top-8 left-0 right-0 z-10 bg-white/80 backdrop-blur-md py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <TenantLogo theme="light" height={32} logoUrl={tenant?.logo_url} darkLogoUrl={tenant?.dark_logo_url} flattenLogo={tenant?.flatten_logo} tenantName={tenant?.name} />
            <span className="font-bold text-slate-900 text-xl tracking-tight">{tenant?.name || "Tenant"}</span>
          </div>
        </div>

        <div className="w-full max-w-md my-auto pt-12 lg:pt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Instructor Application</h2>
            <p className="text-slate-500 font-medium">Tell us about your background and area of expertise.</p>
          </div>

          <form onSubmit={handleApply} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Jane" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="Doe" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input type="email" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="jane@example.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Area of Expertise</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <select required defaultValue="" className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none">
                  <option value="" disabled>Select a field</option>
                  <option value="tech">Software Engineering</option>
                  <option value="design">Product Design</option>
                  <option value="business">Business & Marketing</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">LinkedIn URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-slate-400" />
                </div>
                <input type="url" required className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" placeholder="https://linkedin.com/in/..." />
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
              We review applications on a rolling basis. By submitting, you agree to our{' '}
              <a href="https://www.resultspro.ng/terms" className="text-slate-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
