'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PlatformPricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
        const res = await fetch(`${USERS_API}/api/v1/billing/plans?app_module=CoursesPRO`);
        if (res.ok) {
          const responseData = await res.json();
          const data = responseData.plans || responseData || [];
          if (Array.isArray(data)) {
            // Filter on frontend as a fallback in case backend hasn't updated yet
            const filteredData = data.filter(p => 
              p.app_module && p.app_module.toLowerCase() === 'coursespro'
            );
            
            setPlans(filteredData.map(p => ({
              name: p.name,
              monthly_price: p.monthly_price || p.price || 0,
              annual_price: p.annual_price || ((p.monthly_price || p.price || 0) * 11),
              currency: p.currency === 'USD' ? '$' : '₦',
              period: p.period || 'per month',
              features: (typeof p.features === 'string' && p.features.startsWith('[')) ? JSON.parse(p.features) : (p.features || []),
              cta: p.ctaText || 'Get Started',
              highlight: p.highlight,
              redirectUrl: p.redirect_url || '/signup'
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <Navbar hideInstructorLink={true} isPlatform={true} />
      
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Simple, transparent <span style={{ fontWeight: 700, color: 'white' }}>pricing.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl mx-auto">
              Start building your academy for free. Upgrade when you need more storage and advanced features.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-py pt-24 md:pt-32 pb-24 md:pb-32 bg-white">
        <div className="w-full px-6 md:px-16 lg:px-24 mx-auto max-w-7xl">
          <div className="flex justify-center items-center mb-16 space-x-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
              style={{ background: 'var(--color-nets-navy)' }}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Annually <span className="text-xs font-bold ml-1" style={{ color: 'var(--color-nets-red)' }}>(Save 8%)</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-12 w-full mx-auto">
            {loading ? (
              <div className="flex justify-center py-12 w-full">
                <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 text-slate-500 w-full">
                No plans available at the moment. Please check back later.
              </div>
            ) : (
              plans.map((plan, i) => {
                const rawMonthly = plan.monthly_price;
                const rawAnnual = plan.annual_price;
                const currency = plan.currency || '₦';
                const displayPrice = isAnnual ? `${currency}${rawAnnual.toLocaleString()}` : `${currency}${rawMonthly.toLocaleString()}`;
                const displayPeriod = plan.period === 'forever' ? 'forever' : (isAnnual ? 'per year' : 'per month');
                
                return (
                  <div 
                    key={plan.name}
                    className={`flex-1 flex flex-col relative transition-all duration-300 bg-white rounded-3xl p-10 lg:p-12 ${
                      plan.highlight 
                        ? 'border-2 scale-105 z-10' 
                        : 'border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: plan.highlight ? 'var(--color-nets-navy)' : undefined,
                      boxShadow: plan.highlight ? '0 20px 40px -10px rgba(20, 110, 245, 0.15)' : undefined,
                      background: plan.highlight ? 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)' : undefined,
                    }}
                  >
                    {plan.highlight && (
                      <div 
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] shadow-[0_4px_12px_rgba(20,110,245,0.4)]"
                        style={{ background: 'var(--color-nets-navy)' }}
                      >
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-8 text-center">
                      <div className={`text-xl font-extrabold mb-2 ${plan.highlight ? '' : 'text-slate-900'}`} style={{ color: plan.highlight ? 'var(--color-nets-navy)' : undefined }}>
                        {plan.name}
                      </div>
                      <div className="text-[3rem] font-extrabold text-slate-900 leading-[1.1] tracking-[-0.03em] mt-2">
                        {displayPrice}
                        {displayPeriod !== 'forever' && <span className="block text-sm font-medium text-slate-500 mt-1"> / {displayPeriod}</span>}
                      </div>
                    </div>
                    
                    <ul className="list-none p-0 m-0 mb-10 flex flex-col gap-4 flex-grow">
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex flex-col items-center justify-center text-center gap-3 text-sm text-slate-600 leading-[1.6]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-nets-navy)', flexShrink: 0 }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      href={plan.redirectUrl || '/signup'}
                      className={`btn w-full mt-auto ${plan.highlight ? 'btn-red' : 'bg-transparent text-slate-800 border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50'}`}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        textAlign: 'center',
                        display: 'block',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
      
      <Footer hideInstructorLink={true} isPlatform={true} />
    </main>
  );
}
