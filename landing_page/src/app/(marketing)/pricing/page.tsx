'use client';

import { useState } from 'react';
import styles from './Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import PhotoHero from '@/components/PhotoHero';
import Link from 'next/link';

const planTypes = ['School', 'Family', 'Agent'];

const plans = {
  School: [
    {
      name: 'FREE',
      price: '₦0',
      period: 'forever',
      features: ['Branded School Website', 'Mobile App Access (SchoolHub)', 'Basic School Profile', 'Community Support'],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'BASIC',
      price: '₦50,000',
      period: 'per term',
      features: ['Up to 100 Students', 'Full Ecosystem Access (4 Sub-apps)', 'Branded Website & Apps', 'Standard Support'],
      cta: 'Start with Basic',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦150,000',
      period: 'per term',
      features: ['Up to 500 Students', 'AI Performance Insights', 'Full Ecosystem Access', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    },
    {
      name: 'PREMIUM',
      price: 'Contact Us',
      period: 'custom',
      features: ['Manage Multiple Schools', 'Multi-school Dashboard', 'Unlimited Students', 'Dedicated Support'],
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

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('School');

  return (
    <>
      <PhotoHero 
        title="Choose Your Plan" 
        subtitle="Empower your educational journey with ResultsPRO's comprehensive infrastructure. Flexible plans tailored for schools, families, and agents." 
        image="/photo07.jpeg" 
        tagline="Flexible Pricing"
      />

      <section className="section section-white">
        <div className="container">
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
    </>
  );
}
