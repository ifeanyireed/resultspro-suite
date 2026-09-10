'use client';

import { useState } from 'react';
import styles from '@/app/(marketing)/pricing/Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const productTypes = ['ClassroomPRO', 'PuzzlePRO', 'CoursesPRO', 'TutorsPRO'];

const productPlans = {
  ClassroomPRO: [
    {
      name: 'SOLO',
      price: '₦2,000',
      period: 'per month',
      features: ['Single Educator Access', 'Virtual Classrooms', 'Basic Assignment Tracking', 'Email Support'],
      cta: 'Start Solo',
      highlight: false
    },
    {
      name: 'FAMILY',
      price: '₦5,000',
      period: 'per month',
      features: ['Up to 5 Users', 'Interactive Whiteboard', 'Live Lesson Recording', 'Priority Support'],
      cta: 'Get Family Plan',
      highlight: true
    },
    {
      name: 'SCHOOL',
      price: '₦20,000',
      period: 'per month',
      features: ['Unlimited Teachers & Students', 'School-wide Analytics', 'Custom Branding', 'Dedicated Support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  PuzzlePRO: [
    {
      name: 'SOLO',
      price: '₦1,000',
      period: 'per month',
      features: ['Single Student Access', 'Standard Educational Games', 'Basic Progress Tracking', 'Email Support'],
      cta: 'Start Solo',
      highlight: false
    },
    {
      name: 'FAMILY',
      price: '₦3,000',
      period: 'per month',
      features: ['Up to 5 Students', 'All Premium Games', 'Detailed Cognitive Reports', 'Priority Support'],
      cta: 'Get Family Plan',
      highlight: true
    },
    {
      name: 'SCHOOL',
      price: '₦15,000',
      period: 'per month',
      features: ['Unlimited Students', 'School-wide Leaderboards', 'Curriculum Integration', 'Dedicated Support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  CoursesPRO: [
    {
      name: 'SOLO',
      price: '₦3,000',
      period: 'per month',
      features: ['Single Creator Access', 'Course Creator Tool', 'Standard Video Hosting', 'Email Support'],
      cta: 'Start Solo',
      highlight: false
    },
    {
      name: 'FAMILY',
      price: '₦7,500',
      period: 'per month',
      features: ['Up to 5 Family Members', 'Advanced Course Builder', 'Certificate Generation', 'Priority Support'],
      cta: 'Get Family Plan',
      highlight: true
    },
    {
      name: 'SCHOOL',
      price: '₦25,000',
      period: 'per month',
      features: ['Unlimited Access', 'Custom Domain', 'White-label Certificates', 'Dedicated Support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ],
  TutorsPRO: [
    {
      name: 'SOLO',
      price: '₦2,500',
      period: 'per month',
      features: ['Single Tutor Profile', 'Basic Scheduling', 'Standard Video Calling', 'Email Support'],
      cta: 'Start Solo',
      highlight: false
    },
    {
      name: 'FAMILY',
      price: '₦6,000',
      period: 'per month',
      features: ['Multiple Profiles', 'Featured Profile Status', 'Session Recording', 'Priority Support'],
      cta: 'Get Family Plan',
      highlight: true
    },
    {
      name: 'SCHOOL',
      price: '₦20,000',
      period: 'per month',
      features: ['Unlimited Tutors', 'School-wide Booking System', 'Advanced Analytics', 'Dedicated Support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ]
};

export default function ProductPricingSection() {
  const [activeTab, setActiveTab] = useState('ClassroomPRO');

  return (
    <section className="section section-white pt-12 md:pt-16 pb-24 md:pb-32 bg-gray-50">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-nets-navy)] mb-4">Single Product Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Only need a specific tool? Choose individual product plans tailored to your exact requirements.</p>
          </div>
          <div className={styles.tabs} style={{ flexWrap: 'wrap' }}>
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
          {productPlans[activeTab as keyof typeof productPlans].map((plan, i) => (
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
                  href="/onboard/school"
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
