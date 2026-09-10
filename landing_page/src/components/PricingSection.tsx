'use client';

import { useState } from 'react';
import styles from '@/app/(marketing)/pricing/Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const planTypes = ['School', 'Family', 'Agent'];

const plans = {
  School: [
    {
      name: 'FREE',
      price: '₦0',
      period: 'forever',
      features: ['Up to 100 Students & 15 Teachers', 'SchoolHub Mobile Apps', 'ResultsPRO (Basic)', 'ExamsPRO (Free)', '2GB Storage'],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'STARTER',
      price: '₦15,000',
      period: 'per month',
      features: ['Up to 500 Students & 50 Teachers', 'SchoolHub Mobile Apps', 'ResultsPRO (Full)', 'ExamsPRO (Standard CBT)', 'ClassroomPRO', '15GB Storage'],
      cta: 'Start with Starter',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦35,000',
      period: 'per month',
      features: ['Up to 2,000 Students & 300 Teachers', 'SchoolHub Mobile Apps', 'ResultsPRO & ExamsPRO', 'ClassroomPRO', 'PuzzlePRO', '50GB Storage'],
      cta: 'Upgrade to Pro',
      highlight: true
    },
    {
      name: 'ENTERPRISE',
      price: '₦80,000',
      period: 'per month',
      features: ['Unlimited Students & Teachers', 'SchoolHub Mobile Apps', 'ResultsPRO & ExamsPRO', 'ClassroomPRO', 'Access to All Suite Products', 'Custom Domain & White-labeling', '500GB Storage'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  Family: [
    {
      name: 'FREE',
      price: '₦0',
      period: 'forever',
      features: ['1 Student Profile', 'ResultsPRO Parent Portal', 'Community Access', 'Mobile App'],
      cta: 'Join Free',
      highlight: false
    },
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['1 Student Tracking', 'Access to 4 Core Sub-apps', 'Detailed Progress Reports', 'Standard Support'],
      cta: 'Choose Basic',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦12,000',
      period: 'per month',
      features: ['Up to 3 Students', 'Full Ecosystem Access', 'Detailed AI Insights', 'Priority Support'],
      cta: 'Go Pro',
      highlight: true
    },
    {
      name: 'PREMIUM',
      price: '₦20,000',
      period: 'per month',
      features: ['Up to 5 Students', 'Full Ecosystem Access', 'Weekly Expert Consult', 'Priority Support'],
      cta: 'Get Premium',
      highlight: false
    }
  ],
  Agent: [
    {
      name: 'BASIC',
      price: '₦10,000',
      period: 'per month',
      features: ['Manage up to 5 Schools', 'Basic Commission Tracking', 'Marketing Materials', 'Email Support'],
      cta: 'Become an Agent',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦30,000',
      period: 'per month',
      features: ['Manage up to 20 Schools', 'Advanced Analytics', 'Training Workshops', 'Priority Support'],
      cta: 'Growth Plan',
      highlight: true
    },
    {
      name: 'PREMIUM',
      price: '₦100,000',
      period: 'per month',
      features: ['Unlimited Schools', 'Master Agent Status', 'Team Management', 'Direct Executive Support'],
      cta: 'Master Plan',
      highlight: false
    }
  ]
};

import { useEffect } from 'react';

export default function PricingSection({ initialTab = 'School' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dbPlans, setDbPlans] = useState<Record<string, any[]>>(plans);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const EXAMS_API = process.env.NEXT_PUBLIC_EXAMS_API || 'https://resultspro-service-examspro.onrender.com';
        const res = await fetch(`${EXAMS_API}/api/v1/payment/plans`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Group by category
            const grouped: Record<string, any[]> = { School: [], Family: [], Agent: [] };
            data.forEach((p: any) => {
              const cat = p.category || 'School';
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push({
                name: p.name,
                price: `₦${p.price.toLocaleString()}`,
                period: p.period || 'per month',
                features: p.features ? JSON.parse(p.features) : [],
                cta: p.ctaText || 'Get Started',
                highlight: p.highlight
              });
            });
            // Merge with defaults if empty
            if (grouped['School'].length > 0) setDbPlans(grouped);
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
    <section className="section section-white pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="w-full px-6 md:px-16 lg:px-24 mx-auto">
        <ScrollReveal animation="fade-up">

          <div className={styles.tabs}>
            {planTypes.map((type) => (
              <button
                key={type}
                className={`${styles.tab} ${activeTab === type ? styles.active : ''}`}
                onClick={() => setActiveTab(type)}
              >
                {type} Plans
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {dbPlans[activeTab as keyof typeof plans].map((plan, i) => (
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
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.check}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={activeTab === 'School' ? '/onboard/school' : activeTab === 'Family' ? '/onboard/family' : '/onboard/agent'}
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} w-full mt-auto`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
