'use client';

import { useState } from 'react';
import styles from '@/app/(marketing)/pricing/Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const productTypes = ['ResultsPRO', 'ExamsPRO', 'ClassroomPRO', 'PuzzlePRO', 'CoursesPRO', 'TutorsPRO'];

const productPlans = {
  ResultsPRO: [
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['Basic Report Cards', 'Standard Templates', 'Email Support'],
      cta: 'Get ResultsPRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Advanced Analytics', 'Custom Templates', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ],
  ExamsPRO: [
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['Standard CBT', 'Question Bank Access', 'Email Support'],
      cta: 'Get ExamsPRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Advanced Anti-cheat', 'Custom Question Banks', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ],
  ClassroomPRO: [
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['Virtual Classrooms', 'Assignment Tracking', 'Email Support'],
      cta: 'Get ClassroomPRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Interactive Whiteboard', 'Live Lesson Recording', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ],
  PuzzlePRO: [
    {
      name: 'BASIC',
      price: '₦2,000',
      period: 'per month',
      features: ['Standard Educational Games', 'Basic Progress Tracking', 'Email Support'],
      cta: 'Get PuzzlePRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦5,000',
      period: 'per month',
      features: ['All Premium Games', 'Detailed Cognitive Reports', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ],
  CoursesPRO: [
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['Course Creator', 'Standard Video Hosting', 'Email Support'],
      cta: 'Get CoursesPRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Advanced Course Builder', 'Certificate Generation', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ],
  TutorsPRO: [
    {
      name: 'BASIC',
      price: '₦5,000',
      period: 'per month',
      features: ['Tutor Profile', 'Basic Scheduling', 'Standard Video Calling', 'Email Support'],
      cta: 'Get TutorsPRO',
      highlight: false
    },
    {
      name: 'PRO',
      price: '₦15,000',
      period: 'per month',
      features: ['Featured Profile', 'Advanced Booking System', 'Session Recording', 'Priority Support'],
      cta: 'Upgrade to Pro',
      highlight: true
    }
  ]
};

export default function ProductPricingSection() {
  const [activeTab, setActiveTab] = useState('ResultsPRO');

  return (
    <section className="section section-white pt-12 md:pt-16 pb-24 md:pb-32 bg-gray-50">
      <div className="container">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-nets-navy)] mb-4">Product-Specific Plans</h2>
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
