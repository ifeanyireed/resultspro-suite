'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/(marketing)/pricing/Pricing.module.css';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

const productTypes = [
  'ResultsPRO',
  'CampusPRO',
  'ExamsPRO',
  'ClassroomPRO',
  'PuzzlePRO',
  'CoursesPRO',
  'TutorsPRO'
];

const defaultProductPlans: Record<string, any[]> = {
  ResultsPRO: [
    {
      name: 'PILOT',
      monthly_price: 0,
      annual_price: 0,
      currency: '₦',
      period: 'first term',
      features: [
        'Up to 50 Active Students',
        'Automated CA1/CA2 & Terminal Exam Math',
        '50 Encrypted Scratch Card PINs',
        'Standard PDF Report Card Templates',
        'Email Support'
      ],
      cta: 'Start ResultsPRO Free',
      highlight: false,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'SCHOOL STARTER',
      monthly_price: 35000,
      annual_price: 84000,
      currency: '₦',
      period: 'per term',
      features: [
        'Up to 250 Active Students (~₦140/student/term)',
        'Full CA/Exam Weighting & Position Ranking',
        '250 Encrypted Scratch Card PINs / Term',
        'Custom School Crest & Principal Signature',
        'Parent SMS/WhatsApp Result Notifications'
      ],
      cta: 'Deploy ResultsPRO Starter',
      highlight: true,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'SCHOOL PRO',
      monthly_price: 65000,
      annual_price: 156000,
      currency: '₦',
      period: 'per term',
      features: [
        'Up to 1,000 Active Students (~₦65/student/term)',
        'Unlimited Scratch Card PIN Batch Generation',
        'AI Subject Mastery & Teacher Analytics',
        'WAEC, NECO, IGCSE & Custom Grading Scales',
        'Priority WhatsApp & Phone Support'
      ],
      cta: 'Deploy ResultsPRO Pro',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ],
  CampusPRO: [
    {
      name: 'CAMPUS CORE',
      monthly_price: 40000,
      annual_price: 96000,
      currency: '₦',
      period: 'per term',
      features: [
        'Up to 250 Active Students',
        'Digital Admissions Funnel & Enrollment CRM',
        'Public School Website CMS (Notices, News & Events)',
        'Student & Staff Attendance Tracking',
        'Parent Circular & SMS/WhatsApp Broadcast Hub'
      ],
      cta: 'Deploy CampusPRO Core',
      highlight: false,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'FULL CAMPUS ERP',
      monthly_price: 75000,
      annual_price: 180000,
      currency: '₦',
      period: 'per term',
      features: [
        'Up to 750 Active Students',
        'Campus Mobile App (Parents, Teachers, Drivers & Admins)',
        'Bursary Invoicing, Paystack Reconciliation & Debtors',
        'Staff HR Records, Allowances & Automated Payroll',
        'Clash-Free Master Timetable, Library, Inventory & Transport'
      ],
      cta: 'Deploy Full CampusPRO',
      highlight: true,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'MULTI-CAMPUS GROUP',
      monthly_price: 180000,
      annual_price: 432000,
      currency: '₦',
      period: 'per term',
      features: [
        'Unlimited Students & Multi-Branch Campuses',
        'Consolidated Multi-Branch Revenue & Expense Telemetry',
        'Biometric Staff & Student Clock-In Integration',
        'Custom Approval Workflows & Audit Trails',
        'Dedicated Technical Account Manager'
      ],
      cta: 'Contact Institutional Sales',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ],
  ExamsPRO: [
    {
      name: 'SINGLE PAPER / STARTER',
      monthly_price: 3000,
      annual_price: 33000,
      currency: '₦',
      period: 'per month',
      features: [
        'Access to 1 Exam Track / Paper',
        'WAEC, JAMB & ICAN Past Questions Bank',
        'Simulated CBT Exam Environment',
        'AI Step-by-Step Explanations',
        'Email Support'
      ],
      cta: 'Start Practicing',
      highlight: false,
      redirectUrl: '/onboard/examspro'
    },
    {
      name: 'COMPLETE LEVEL / PRO',
      monthly_price: 7000,
      annual_price: 77000,
      currency: '₦',
      period: 'per month',
      features: [
        'Access to All Subjects / Papers in Level',
        'Live Multiplayer CBT Battles & Leaderboards',
        '24/7 AI Study Tutor & Weakness Mapping',
        'Performance Analytics for Parents & Schools',
        'Priority Support'
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      redirectUrl: '/onboard/examspro'
    },
    {
      name: 'SCHOOL CBT CENTER',
      monthly_price: 25000,
      annual_price: 275000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 500 School Candidates',
        'Custom Mock CBT Exams & Anti-Cheat Browser Lock',
        'School-Wide WAEC/JAMB Readiness Analytics',
        'Bulk Question Bank Upload',
        'Dedicated CBT Support'
      ],
      cta: 'Deploy School CBT',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ],
  ClassroomPRO: [
    {
      name: 'SOLO',
      monthly_price: 2000,
      annual_price: 22000,
      currency: '₦',
      period: 'per month',
      features: [
        '1 Teacher',
        'Up to 50 Students',
        'Virtual Classrooms & Lesson Notes',
        'Basic Assignment & Quiz Tracking',
        'Email Support'
      ],
      cta: 'Start Solo',
      highlight: false,
      redirectUrl: '/onboard/classroompro'
    },
    {
      name: 'FAMILY / TUTOR TEAM',
      monthly_price: 5000,
      annual_price: 55000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 5 Teachers',
        'Up to 200 Students',
        'Spaced-Repetition (SRS) Flashcards',
        'Offline-First Student Mobile Sync',
        'Priority Support'
      ],
      cta: 'Get Family Plan',
      highlight: true,
      redirectUrl: '/onboard/classroompro'
    },
    {
      name: 'SCHOOL STARTER',
      monthly_price: 15000,
      annual_price: 165000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 20 Teachers & 500 Students',
        'Full NERDC Curriculum Syllabus Repository',
        'Basic School Analytics & Branding',
        'Automated Formative Quiz Grading',
        'Email Support'
      ],
      cta: 'Start with Starter',
      highlight: false,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'SCHOOL PRO',
      monthly_price: 35000,
      annual_price: 385000,
      currency: '₦',
      period: 'per month',
      features: [
        'Unlimited Teachers & Students',
        'School-Wide Engagement Analytics',
        'Custom Branding & Domain',
        'Dedicated Faculty Onboarding Support'
      ],
      cta: 'Contact Sales',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ],
  PuzzlePRO: [
    {
      name: 'SOLO',
      monthly_price: 1000,
      annual_price: 11000,
      currency: '₦',
      period: 'per month',
      features: [
        '1 Student Account',
        '636 Progressive Coding Quests',
        'Blockly, HTML, CSS, JavaScript & Python',
        'Basic XP & Milestone Tracking'
      ],
      cta: 'Start Solo',
      highlight: false,
      redirectUrl: '/onboard/puzzlepro'
    },
    {
      name: 'FAMILY',
      monthly_price: 3000,
      annual_price: 33000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 5 Children',
        'All 636 Coding Adventure Quests',
        'Detailed Cognitive Progress Reports',
        'Priority Support'
      ],
      cta: 'Get Family Plan',
      highlight: true,
      redirectUrl: '/onboard/puzzlepro'
    },
    {
      name: 'SCHOOL STARTER',
      monthly_price: 10000,
      annual_price: 110000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 500 Students',
        'Educator Portal & Class Rosters',
        'Passwordless 8-Digit Student Access Codes',
        'School Coding Leaderboards'
      ],
      cta: 'Start with Starter',
      highlight: false,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'SCHOOL PRO',
      monthly_price: 25000,
      annual_price: 275000,
      currency: '₦',
      period: 'per month',
      features: [
        'Unlimited Students',
        'Inter-House & Inter-School Coding Leagues',
        'Full STEM Curriculum Integration',
        'Dedicated Support'
      ],
      cta: 'Contact Sales',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ],
  CoursesPRO: [
    {
      name: 'STARTER',
      monthly_price: 15000,
      annual_price: 165000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 100 Students',
        'Up to 5 Courses',
        'Course Creator Studio',
        'Standard Video Hosting & Basic Certificates',
        'Email Support'
      ],
      cta: 'Start with Starter',
      highlight: false,
      redirectUrl: '/onboard/coursespro'
    },
    {
      name: 'PRO',
      monthly_price: 35000,
      annual_price: 385000,
      currency: '₦',
      period: 'per month',
      features: [
        'Up to 1,000 Students',
        'Up to 25 Courses',
        'Advanced Course Builder & Verifiable Certificates',
        'Custom Academy Domain',
        'Priority Support'
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      redirectUrl: '/onboard/coursespro'
    },
    {
      name: 'ENTERPRISE',
      monthly_price: 80000,
      annual_price: 880000,
      currency: '₦',
      period: 'per month',
      features: [
        'Unlimited Students & Courses',
        'White-Label Certificates & Portal',
        'Dedicated Account Manager',
        '24/7 Priority Support'
      ],
      cta: 'Contact Sales',
      highlight: false,
      redirectUrl: '/onboard/coursespro'
    }
  ],
  TutorsPRO: [
    {
      name: 'SOLO',
      monthly_price: 15,
      annual_price: 14,
      currency: '$',
      period: 'per hour',
      features: [
        'Billed in Blocks of 5 Hours',
        '1 Subject Focus',
        'Interactive Digital Whiteboard Room',
        'Flexible Scheduling & Basic Progress Tracking'
      ],
      cta: 'Start Solo',
      highlight: false,
      redirectUrl: '/onboard/tutorspro'
    },
    {
      name: 'FAMILY',
      monthly_price: 12,
      annual_price: 10,
      currency: '$',
      period: 'per hour',
      features: [
        'Billed in Blocks of 20 Hours',
        'Up to 3 Subjects',
        'Multi-Student Sibling Support',
        'Detailed Parent Mastery Analytics'
      ],
      cta: 'Get Family Plan',
      highlight: true,
      redirectUrl: '/onboard/tutorspro'
    },
    {
      name: 'SCHOOL STARTER',
      monthly_price: 10,
      annual_price: 9,
      currency: '$',
      period: 'per hour',
      features: [
        'Billed in Blocks of 100 Hours',
        'Unlimited Subjects',
        'Small Group Remedial Classes',
        'Basic School Analytics'
      ],
      cta: 'Start with Starter',
      highlight: false,
      redirectUrl: '/onboard/school'
    },
    {
      name: 'SCHOOL PRO',
      monthly_price: 8,
      annual_price: 7,
      currency: '$',
      period: 'per hour',
      features: [
        'Billed in Blocks of 500 Hours',
        'Unlimited Subjects & Multi-Student Cohorts',
        'Synced with ResultsPRO At-Risk Student Flags',
        'Advanced School Analytics'
      ],
      cta: 'Contact Sales',
      highlight: false,
      redirectUrl: '/onboard/school'
    }
  ]
};

export default function ProductPricingSection() {
  const [activeTab, setActiveTab] = useState('ResultsPRO');
  const [dbPlans, setDbPlans] = useState<Record<string, any[]>>(defaultProductPlans);
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const USERS_API = process.env.NEXT_PUBLIC_USERS_API || '';
        const res = await fetch(`${USERS_API}/api/v1/billing/plans`);
        if (res.ok) {
          const responseData = await res.json();
          const data = responseData.plans || responseData || [];
          if (Array.isArray(data) && data.length > 0) {
            const grouped: Record<string, any[]> = {
              ResultsPRO: [],
              CampusPRO: [],
              ExamsPRO: [],
              ClassroomPRO: [],
              PuzzlePRO: [],
              CoursesPRO: [],
              TutorsPRO: []
            };
            data.forEach((p: any) => {
              const cat = p.app_module || '';
              if (grouped[cat] !== undefined) {
                const isTermPlan = String(p.period || '').toLowerCase().includes('term');
                const basePrice = p.monthly_price || p.price || 0;
                grouped[cat].push({
                  name: p.name,
                  monthly_price: basePrice,
                  annual_price:
                    p.annual_price ||
                    (isTermPlan ? Math.round(basePrice * 3 * 0.8) : basePrice * 11),
                  currency: p.currency === 'USD' || p.period === 'per hour' ? '$' : '₦',
                  period: p.period || 'per month',
                  features:
                    typeof p.features === 'string' && p.features.startsWith('[')
                      ? JSON.parse(p.features)
                      : p.features || [],
                  cta: p.ctaText || 'Get Started',
                  highlight: p.highlight,
                  redirectUrl: p.redirect_url
                });
              }
            });
            setDbPlans((prev) => {
              const merged = { ...prev };
              Object.keys(grouped).forEach((key) => {
                if (grouped[key].length > 0) {
                  merged[key] = grouped[key];
                }
              });
              return merged;
            });
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

  const isTermBasedTab = activeTab === 'ResultsPRO' || activeTab === 'CampusPRO';

  return (
    <section className="section bg-light pt-24 md:pt-32 pb-24 md:pb-32" id="product-pricing">
      <div className="w-full px-6 md:px-16 lg:px-24 mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-navy mb-6">
              Individual Specialist Apps <span className="text-blue">Pricing</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Need just one standalone application? Subscribe to any individual ResultsPRO Suite product—or bundle all 5 apps above under ScholarsNG to save up to 45%.
            </p>
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

          <div className="flex justify-center items-center mt-8 mb-4 space-x-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-navy' : 'text-slate-400'}`}>
              {isTermBasedTab ? 'Per Term (4 Months)' : 'Monthly'}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-navy transition-colors focus:outline-none"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${isAnnual ? 'text-navy' : 'text-slate-400'}`}>
              {isTermBasedTab ? 'Full Session (3 Terms)' : 'Annually'}{' '}
              <span className="text-xs text-[#FBBC04] font-bold ml-1">
                {isTermBasedTab ? '(Save 20%)' : '(Save 8%)'}
              </span>
            </span>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {!loading &&
            dbPlans[activeTab] &&
            dbPlans[activeTab].map((plan, i) => {
              const rawMonthly =
                plan.monthly_price !== undefined
                  ? plan.monthly_price
                  : parseInt(String(plan.price).replace(/[^0-9]/g, ''), 10) || 0;
              const isTermPlan = String(plan.period || '').toLowerCase().includes('term');
              const isHourlyPlan = String(plan.period || '').toLowerCase().includes('hour');
              const discountedTermPrice = Math.round(rawMonthly * 0.8);
              const rawAnnual =
                plan.annual_price !== undefined
                  ? plan.annual_price
                  : isTermPlan
                  ? discountedTermPrice * 3
                  : rawMonthly * 11;
              const currency = plan.currency || '₦';

              const displayPrice = isTermPlan
                ? isAnnual
                  ? `${currency}${discountedTermPrice.toLocaleString()}`
                  : `${currency}${rawMonthly.toLocaleString()}`
                : isHourlyPlan
                ? isAnnual
                  ? `${currency}${rawAnnual.toLocaleString()}`
                  : `${currency}${rawMonthly.toLocaleString()}`
                : isAnnual
                ? `${currency}${rawAnnual.toLocaleString()}`
                : `${currency}${rawMonthly.toLocaleString()}`;

              const displayPeriod =
                plan.period === 'forever' || plan.period === 'first term'
                  ? plan.period
                  : plan.period === 'per diet'
                  ? 'per diet (6 months)'
                  : isHourlyPlan
                  ? 'per hour'
                  : isTermPlan
                  ? 'per term'
                  : isAnnual
                  ? 'per year'
                  : 'per month';

              return (
                <ScrollReveal
                  key={plan.name}
                  animation="fade-up"
                  delay={i * 100}
                  className={styles.revealWrapper}
                >
                  <div className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
                    {plan.highlight && <div className={styles.badge}>Most Popular</div>}
                    <div className={styles.planHeader}>
                      <div className={styles.planName}>{plan.name}</div>
                      <div className={styles.planPrice}>
                        {displayPrice}
                        {displayPeriod !== 'forever' && (
                          <span className={styles.period}> / {displayPeriod}</span>
                        )}
                      </div>
                      {isTermPlan && isAnnual && rawMonthly > 0 && (
                        <div className="text-xs font-semibold text-emerald-600 mt-2">
                          Billed {currency}
                          {rawAnnual.toLocaleString()} per 3-term session
                        </div>
                      )}
                    </div>
                    <ul className={styles.featureList}>
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className={styles.featureItem}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.check}
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.redirectUrl || `/onboard/${activeTab.toLowerCase()}`}
                      className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} w-full mt-auto`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}
