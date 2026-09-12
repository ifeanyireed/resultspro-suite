"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [academyName, setAcademyName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from academy name
  useEffect(() => {
    if (academyName) {
      setSlug(academyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [academyName]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userId = sessionStorage.getItem('temp_creator_id');
      if (!userId) {
        throw new Error("Session expired. Please log in again.");
      }

      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      const res = await fetch(`${USERS_API}/api/v1/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: academyName, 
          slug: slug, 
          user_id: userId,
          type: 'academy'
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to provision academy');
      
      setSuccess(true);
      
      // Redirect to the new tenant's dashboard after 2 seconds
      setTimeout(() => {
        // If they created "skillup", redirect to https://skillup.resultspro.ng or local equivalent
        const host = window.location.host; // e.g. localhost:3006 or coursespro.resultspro.ng
        const isLocal = host.includes('localhost');
        if (isLocal) {
          // Since local testing of subdomains is hard, we just go to root (which middleware routes to platform locally if host is localhost:3006)
          // Actually, we can just redirect to http://slug.localhost:3006 if they have it setup, or just go to /dashboard
          window.location.href = `http://${slug}.localhost:3006`;
        } else {
          window.location.href = `https://${slug}.resultspro.ng`;
        }
      }, 2500);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0B1021]">
      {/* Background Abstract Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-12">
          <Image src="/logo.png" alt="CoursesPRO" width={48} height={48} className="object-contain" priority />
          <h1 className="font-bold text-white text-2xl tracking-tight">CoursesPRO</h1>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 w-full">
          {success ? (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Academy Created!</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed font-medium mb-6">
                Your workspace is ready. Redirecting you to <strong>{slug}.resultspro.ng</strong>...
              </p>
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-500">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm mb-6 flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Name your academy</h2>
                <p className="text-slate-500 font-medium">This will be your brand's home and URL.</p>
              </div>

              {error && <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

              <form onSubmit={handleCreateTenant} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Academy Name</label>
                  <input
                    type="text"
                    required
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="e.g. Skill Up Academy"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Your Domain</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      placeholder="skillup"
                    />
                    <div className="px-4 py-3 bg-slate-100 border border-slate-200 border-l-0 rounded-r-xl text-slate-500 font-medium">
                      .resultspro.ng
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !academyName}
                  className="w-full mt-4 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Academy Workspace
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
