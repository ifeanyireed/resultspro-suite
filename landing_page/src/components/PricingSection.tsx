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
      features: ['Up to 100 Students & 15 Teachers', 'Basic report cards', 'Free ExamsPRO', '2GB Storage'],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'STARTER',
      price: '₦15,000',
      period: 'per month',
      features: ['Up to 500 Students & 50 Teachers', 'Standard CBT', 'Scratch card PIN access', '15GB Storage'],
      cta: 'Start with Starter',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦35,000',
      period: 'per month',
      features: ['Up to 2,000 Students & 300 Teachers', 'SMS Notifications', 'Advanced Analytics', 'TutorsPRO integration', '50GB Storage'],
      cta: 'Upgrade to Pro',
      highlight: true
    },
    {
      name: 'ENTERPRISE',
      price: '₦80,000',
      period: 'per month',
      features: ['Unlimited Students & Teachers', 'Custom Domain & White-labeling', 'Dedicated Account Manager', '500GB Storage'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  Family: [
    {
      name: 'FREE',
      price: '₦0',
      period: 'forever',
      features: ['1 Student Profile', 'Basic Progress View', 'Community Access', 'Mobile App'],
      cta: 'Join Free',
      highlight: false
    },
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['1 Student Tracking', 'Full Ecosystem Access (4 Sub-apps)', 'Detailed Progress Reports', 'Standard Support'],
      cta: 'Choose Basic',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦12,000',
      period: 'per month',
      features: ['Up to 3 Students', 'Detailed AI Insights', 'Full Ecosystem Access', 'Priority Support'],
      cta: 'Go Pro',
      highlight: true
    },
    {
      name: 'PREMIUM',
      price: '₦20,000',
      period: 'per month',
      features: ['Up to 5 Students', 'Weekly Expert Consult', 'Full Ecosystem Access', 'Full Dashboard'],
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

export default function PricingSection({ initialTab = 'School' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <section className="section section-white">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-nets-navy)] mb-4">Flexible Pricing for Everyone</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your needs. Empower your educational journey with our comprehensive infrastructure.</p>
          </div>
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
          {plans[activeTab as keyof typeof plans].map((plan, i) => (
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
                  href={activeTab === 'School' ? '/onboard/school' : activeTab === 'Family' ? 'https://schoolhub.resultspro.ng' : '/onboard/agent'}
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
