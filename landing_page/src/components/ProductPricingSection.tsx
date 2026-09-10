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
                  price: (p.currency === 'USD' ? '$' : '₦') + (p.monthly_price || p.price || 0).toLocaleString(),
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
        </ScrollReveal>

        <div className={styles.grid}>
          {!loading && dbPlans[activeTab] && dbPlans[activeTab].map((plan, i) => (
            <ScrollReveal key={plan.name} animation="fade-up" delay={i * 100} className={styles.revealWrapper}>
              <div className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
                {plan.highlight && <div className={styles.badge}>Most Popular</div>}
                <div className={styles.planHeader}>
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>
                    {plan.price}
                    {plan.period !== 'custom' && <span className={styles.period}> / {plan.period}</span>}
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
          ))}
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
