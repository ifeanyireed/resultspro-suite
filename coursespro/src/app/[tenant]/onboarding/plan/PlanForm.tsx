'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { COURSES_API } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import TenantLogo from '@/components/TenantLogo';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function PlanForm({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState('upfront');
  const [cohort, setCohort] = useState<any>(null);

  useEffect(() => {
    const fetchCohort = async () => {
      const cohortId = Cookies.get('selected_cohort_id');
      if (!cohortId) return;
      try {
        const res = await fetch(`${COURSES_API}/api/public/cohorts/${cohortId}`, {
          headers: { 'X-Tenant-Domain': tenant.slug }
        });
        if (res.ok) {
          const data = await res.json();
          setCohort(data.cohort);
        }
      } catch (err) {}
    };
    fetchCohort();
  }, [tenant.slug]);

  const upfrontPrice = cohort?.price || 150000;
  const installmentTotal = upfrontPrice * 1.15;
  const monthlyCost = installmentTotal / 3;


  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const cohortId = Cookies.get('selected_cohort_id');
      if (!cohortId) {
        router.push('/dashboard');
        return;
      }
      const token = Cookies.get('token');
      const res = await fetch(`${COURSES_API}/api/payments/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Domain': tenant.slug,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cohort_id: cohortId, plan_type: plan })
      });
      
      if (res.ok) {
        Cookies.remove('selected_cohort_id');
        router.push('/onboarding/orientation');
      } else {
        console.error("Payment failed");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Aesthetic */}
      <div className="hidden lg:flex w-[35%] relative overflow-hidden bg-[#0B1021]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center space-x-3">
            <TenantLogo theme="dark" height={40} logoUrl={tenant?.logo_url} darkLogoUrl={tenant?.dark_logo_url} flattenLogo={tenant?.flatten_logo} tenantName={tenant?.name} />
            <div>
              <h1 className="font-bold text-white text-xl tracking-tight">{tenant?.name || "Tenant"}</h1>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span>Application Accepted</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4">
              Choose your commitment
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Select how you'd like to fund your transformation. Pay upfront to save, or split it across 3 months.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Secured by Paystack</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Plans & Checkout */}
      <div className="w-full lg:w-[65%] bg-slate-50 flex items-center justify-center p-8 sm:p-16 relative overflow-y-auto h-screen">
        <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">
          
          {/* Plan Selection */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Select a plan</h3>
            <div className="space-y-4">
              
              {/* Upfront Plan */}
              <label className={`relative flex flex-col bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all shadow-sm ${plan === 'upfront' ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-200 hover:border-blue-300'}`}>
                <div className="absolute -top-3 right-6 bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full tracking-widest uppercase shadow-sm">
                  Recommended
                </div>
                <input type="radio" name="plan" value="upfront" checked={plan === 'upfront'} onChange={() => setPlan('upfront')} className="absolute top-6 right-6 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-600" />
                <span className="font-bold text-xs uppercase tracking-widest text-blue-600 mb-2 block">Full Cohort (Upfront)</span>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-slate-900">₦120,000</span>
                </div>
                <p className="text-sm text-slate-400 mb-5 line-through">₦135,000</p>
                
                <ul className="space-y-2.5 mb-2">
                  <li className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Save ₦15,000 immediately
                  </li>
                  <li className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> 1-on-1 portfolio review session
                  </li>
                </ul>
              </label>

              {/* Monthly Plan */}
              <label className={`relative flex flex-col bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all shadow-sm ${plan === 'monthly' ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-slate-200 hover:border-blue-300'}`}>
                <input type="radio" name="plan" value="monthly" checked={plan === 'monthly'} onChange={() => setPlan('monthly')} className="absolute top-6 right-6 w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-600" />
                <span className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-2 block">Monthly Installment</span>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-slate-900">₦45,000</span>
                  <span className="text-slate-500 text-sm font-medium">/mo</span>
                </div>
                <ul className="space-y-2.5 mb-2">
                  <li className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Billed every 4 weeks
                  </li>
                  <li className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Cancel anytime
                  </li>
                </ul>
              </label>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[350px]">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Order Summary</h3>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-semibold text-slate-700">{plan === 'upfront' ? 'Full Cohort (Upfront)' : 'Monthly Installment'}</span>
                <span className="text-sm font-bold text-slate-900">{plan === 'upfront' ? '₦135,000' : '₦45,000'}</span>
              </div>
              {plan === 'upfront' && (
                <div className="flex justify-between mb-4 text-emerald-600">
                  <span className="text-sm font-semibold">Upfront Discount</span>
                  <span className="text-sm font-bold">-₦15,000</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Due Today</span>
                <span className="text-2xl font-bold text-blue-600">{plan === 'upfront' ? '₦120,000' : '₦45,000'}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
              <div className="bg-white border-2 border-blue-600 ring-4 ring-blue-600/10 rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Paystack Secure</p>
                    <p className="text-xs font-medium text-slate-500">Cards, Bank Transfer</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <button onClick={handlePayment} disabled={isLoading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed group">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Pay {plan === 'upfront' ? '₦120,000' : '₦45,000'} securely
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
