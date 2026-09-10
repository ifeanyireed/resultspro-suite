'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/(marketing)/pricing/Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const productTypes = ['ExamsPRO', 'ClassroomPRO', 'PuzzlePRO', 'CoursesPRO', 'TutorsPRO'];

export default function ProductPricingSection() {
  const [activeTab, setActiveTab] = useState('ExamsPRO');
  const [dbPlans, setDbPlans] = useState<Record<string, any[]>>({
    'ExamsPRO': [],
    'ClassroomPRO': [],
    'PuzzlePRO': [],
    'CoursesPRO': [],
    'TutorsPRO': []
  });
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
        const res = await fetch(`${USERS_API}/api/v1/billing/plans`);
        if (res.ok) {
          const responseData = await res.json();
          const data = responseData.plans || responseData || [];
          if (Array.isArray(data) && data.length > 0) {
            const grouped: Record<string, any[]> = {
              'ExamsPRO': [],
              'ClassroomPRO': [],
              'PuzzlePRO': [],
              'CoursesPRO': [],
              'TutorsPRO': []
            };
            data.forEach((p: any) => {
              const cat = p.app_module || 'ExamsPRO';
              if (grouped[cat] !== undefined) {
                grouped[cat].push({
                  name: p.name,
                  monthly_price: p.monthly_price || p.price || 0,
                  annual_price: p.annual_price || ((p.monthly_price || p.price || 0) * 11),
                  currency: p.currency === 'USD' ? '$' : '₦',
                  period: p.period || 'per month',
                  features: (typeof p.features === 'string' && p.features.startsWith('[')) ? JSON.parse(p.features) : (p.features || []),
                  cta: p.ctaText || 'Get Started',
                  highlight: p.highlight
                });
              }
            });
            setDbPlans(grouped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section className="section bg-light pt-24 md:pt-32 pb-24 md:pb-32" id="product-pricing">
      <div className="w-full px-6 md:px-16 lg:px-24 mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6">
              Modular Apps <span className="text-blue">Pricing</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Get standalone subscriptions for our powerful specialized apps. 
              Perfect for independent creators, standalone academies, or specific use-cases.
            </p>
          </div>

          <div className={styles.tabs}>
            {productTypes.map((type) => (
              <button
                key={type}
                className={`${styles.tab} ${activeTab === type ? styles.active : ''}`}
                onClick={() => setActiveTab(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center mt-8 mb-4 space-x-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-navy' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-navy transition-colors focus:outline-none"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-semibold ${isAnnual ? 'text-navy' : 'text-slate-400'}`}>
              Annually <span className="text-xs text-red-500 font-bold ml-1">(Save 8%)</span>
            </span>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {!loading && dbPlans[activeTab] && dbPlans[activeTab].map((plan, i) => {
            const rawMonthly = plan.monthly_price !== undefined ? plan.monthly_price : (parseInt(String(plan.price).replace(/[^0-9]/g, ''), 10) || 0);
            const rawAnnual = plan.annual_price !== undefined ? plan.annual_price : rawMonthly * 11;
            const currency = plan.currency || '₦';
            const displayPrice = isAnnual ? `${currency}${rawAnnual.toLocaleString()}` : `${currency}${rawMonthly.toLocaleString()}`;
            const displayPeriod = plan.period === 'forever' ? 'forever' : (isAnnual ? 'per year' : 'per month');
            
            return (
            <ScrollReveal key={plan.name} animation="fade-up" delay={i * 100} className={styles.revealWrapper}>
              <div className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
                {plan.highlight && <div className={styles.badge}>Most Popular</div>}
                <div className={styles.planHeader}>
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>
                    {displayPrice}
                    {displayPeriod !== 'forever' && <span className={styles.period}> / {displayPeriod}</span>}
                  </div>
                </div>
                <ul className={styles.featureList}>
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className={styles.featureItem}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.check}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={`/onboard/${activeTab.toLowerCase()}`}
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} w-full mt-auto`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          );})}
          {!loading && dbPlans[activeTab] && dbPlans[activeTab].length === 0 && (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-slate-500">
              Pricing configuring for {activeTab}. Please check back later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
