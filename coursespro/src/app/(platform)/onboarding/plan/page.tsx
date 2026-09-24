'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { COURSES_API } from '@/lib/api';

export default function PlanSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState('upfront');
  const [cohort, setCohort] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCohort = async () => {
      const cohortId = Cookies.get('selected_cohort_id');
      if (!cohortId) {
        setError('No cohort selected. Please return to the catalogue and select a cohort to enroll in.');
        return;
      }
      try {
        const res = await axios.get(`${COURSES_API}/api/public/cohorts/${cohortId}?tenant_id=coursespro`);
        if (res.data?.cohort) {
          setCohort(res.data.cohort);
        } else {
          setError('Failed to load cohort details. The cohort may have been removed or is unavailable.');
        }
      } catch (err) {
        setError('A network error occurred while loading the cohort details.');
      }
    };
    fetchCohort();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full text-center border border-slate-200">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Checkout Error</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link href="/" className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  const basePrice = Number(cohort.price);
  const upfrontDiscount = basePrice >= 50000 ? 15000 : (basePrice > 10000 ? 5000 : 0);
  const upfrontPrice = basePrice - upfrontDiscount;
  const monthlyCost = Math.round(basePrice / 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: cohort?.currency || 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/onboarding/orientation');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding & Aesthetic */}
      <div className="hidden lg:flex w-[35%] relative overflow-hidden bg-[#0B1021]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="CoursesPRO" width={64} height={64} className="object-contain" priority />
            <div>
              <h1 className="font-bold text-white text-xl tracking-tight">CoursesPRO</h1>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span>Accepted into {cohort ? cohort.title : 'Cohort'}</span>
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
                <span className="font-bold text-xs uppercase tracking-widest text-blue-600 mb-2 block">{cohort ? cohort.title : 'Full Cohort'} (Upfront)</span>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-slate-900">{formatCurrency(upfrontPrice)}</span>
                </div>
                <p className="text-sm text-slate-400 mb-5 line-through">{formatCurrency(basePrice)}</p>
                
                <ul className="space-y-2.5 mb-2">
                  <li className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Save {formatCurrency(upfrontDiscount)} immediately
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
                  <span className="text-3xl font-bold text-slate-900">{formatCurrency(monthlyCost)}</span>
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
                <span className="text-sm font-semibold text-slate-700">{plan === 'upfront' ? `${cohort ? cohort.title : 'Full Cohort'} (Upfront)` : 'Monthly Installment'}</span>
                <span className="text-sm font-bold text-slate-900">{plan === 'upfront' ? formatCurrency(basePrice) : formatCurrency(monthlyCost)}</span>
              </div>
              {plan === 'upfront' && (
                <div className="flex justify-between mb-4 text-emerald-600">
                  <span className="text-sm font-semibold">Upfront Discount</span>
                  <span className="text-sm font-bold">-{formatCurrency(upfrontDiscount)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Due Today</span>
                <span className="text-2xl font-bold text-blue-600">{plan === 'upfront' ? formatCurrency(upfrontPrice) : formatCurrency(monthlyCost)}</span>
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
                  Pay {plan === 'upfront' ? formatCurrency(upfrontPrice) : formatCurrency(monthlyCost)} securely
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
