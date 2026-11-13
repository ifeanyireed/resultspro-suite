"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconCheck,
  IconCalculator,
  IconSparkles,
  IconTrendingUp,
  IconChartBar,
  IconBuildingCommunity,
  IconBook2,
  IconPuzzle,
  IconUsers,
  IconLayersSubtract,
  IconBoxMultiple
} from '@tabler/icons-react';

type PricingViewMode = 'suite' | 'standalone';
type BillingCycle = 'term' | 'session';
type StandaloneAppId = 'ResultsPRO' | 'CampusPRO' | 'ClassroomPRO' | 'PuzzlePRO' | 'TutorsPRO';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  termPrice: number;
  sessionTermPrice: number;
  periodLabel: string;
  unitCostTerm: string;
  unitCostSession: string;
  desc: string;
  students: string;
  features: string[];
  cta: string;
  popular: boolean;
  isPrefixPrice?: boolean;
  currency?: string;
  isHourly?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pilot',
    name: 'SANDBOX PILOT',
    termPrice: 0,
    sessionTermPrice: 0,
    periodLabel: '/ first term',
    unitCostTerm: 'Free 1-Term Evaluation Pilot',
    unitCostSession: 'Free 1-Term Evaluation Pilot',
    desc: 'Run a live terminal exam pilot with encrypted scratch cards before committing your school bursary.',
    students: 'Up to 50 active students',
    features: [
      'ResultsPRO automated CA1/CA2 & broadsheets',
      'CampusPRO Lite (Student & class directory)',
      '50 encrypted result scratch card PINs included',
      'Instant subdomain (school.scholars.ng)',
      'PuzzlePRO coding preview (first 20 quests)'
    ],
    cta: 'Start 1-Term Free Pilot',
    popular: false
  },
  {
    id: 'growth',
    name: 'GROWTH ACADEMY',
    termPrice: 65000,
    sessionTermPrice: 52000,
    periodLabel: '/ term',
    unitCostTerm: '~₦260 / student / term',
    unitCostSession: '~₦208 / student / term',
    desc: 'Built for growing nursery, primary, and junior secondary academies ready to monetize ICT & coding.',
    students: 'Up to 250 active students',
    features: [
      'ResultsPRO + ClassroomPRO + PuzzlePRO Starter',
      'CampusPRO Core (Admissions, Attendance & Website CMS)',
      '250 encrypted scratch card PINs per term',
      'Custom school crest, theme & principal signature',
      'Parent SMS/WhatsApp alerts & Paystack fee collection'
    ],
    cta: 'Deploy Growth Academy',
    popular: false
  },
  {
    id: 'pro',
    name: 'DIGITAL CAMPUS PRO',
    termPrice: 135000,
    sessionTermPrice: 108000,
    periodLabel: '/ term',
    unitCostTerm: '~₦180 / student / term',
    unitCostSession: '~₦144 / student / term',
    desc: 'The complete 5-app institutional operating system for modern secondary schools and colleges.',
    students: 'Up to 750 active students',
    features: [
      'All 5 Specialist Apps Unlocked (ResultsPRO, ClassroomPRO, TutorsPRO, PuzzlePRO & CampusPRO)',
      'Full CampusPRO ERP (Bursary, HR/Payroll, Timetable, Library, Inventory & Transport)',
      'Custom institutional domain (portal.school.edu.ng)',
      'Unlimited encrypted scratch card PIN batches',
      'Dedicated 24/7 WhatsApp & phone priority SLA'
    ],
    cta: 'Deploy Pro Campus',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'INSTITUTIONAL',
    termPrice: 350000,
    sessionTermPrice: 280000,
    periodLabel: '/ term',
    unitCostTerm: 'Multi-Campus & Custom SLA',
    unitCostSession: 'Multi-Campus & Custom SLA',
    desc: 'Engineered for multi-campus school groups, diocese networks, and state education boards.',
    students: 'Unlimited students & campuses',
    features: [
      'Multi-Campus CampusPRO command & cross-branch analytics',
      'All 5 Specialist Apps with unlimited student seats',
      'White-label iOS & Android mobile apps under school brand',
      'Biometric attendance & SUBEB/Ministry compliance exports',
      'White-glove historical migration & dedicated account manager'
    ],
    cta: 'Book Institutional Briefing',
    popular: false,
    isPrefixPrice: true
  }
];

const STANDALONE_APPS: {
  id: StandaloneAppId;
  label: string;
  tagline: string;
  icon: any;
  tiers: PricingTier[];
}[] = [
  {
    id: 'ResultsPRO',
    label: 'ResultsPRO',
    tagline: 'Standalone automated CA/exam computation, terminal broadsheets & encrypted scratch cards.',
    icon: IconChartBar,
    tiers: [
      {
        id: 'resultspro-free',
        name: 'PILOT',
        termPrice: 0,
        sessionTermPrice: 0,
        periodLabel: '/ first term',
        unitCostTerm: 'Free 50-student pilot',
        unitCostSession: 'Free 50-student pilot',
        desc: 'Test automated grading and digital report cards for one class or micro-school.',
        students: 'Up to 50 active students',
        features: [
          'Automated CA1/CA2 & terminal exam math',
          '50 encrypted scratch card PINs',
          'Standard PDF report card templates',
          'Email support'
        ],
        cta: 'Start ResultsPRO Free',
        popular: false
      },
      {
        id: 'resultspro-starter',
        name: 'SCHOOL STARTER',
        termPrice: 35000,
        sessionTermPrice: 28000,
        periodLabel: '/ term',
        unitCostTerm: '~₦140 / student / term',
        unitCostSession: '~₦112 / student / term',
        desc: 'Automated broadsheets and scratch card verification for primary & junior schools.',
        students: 'Up to 250 active students',
        features: [
          'Full CA/Exam weighting & position ranking',
          '250 encrypted scratch card PINs / term',
          'Custom school crest & principal signature',
          'Psychomotor & affective domain grading',
          'Parent SMS/WhatsApp result notifications'
        ],
        cta: 'Deploy ResultsPRO Starter',
        popular: true
      },
      {
        id: 'resultspro-pro',
        name: 'SCHOOL PRO',
        termPrice: 65000,
        sessionTermPrice: 52000,
        periodLabel: '/ term',
        unitCostTerm: '~₦65 / student / term',
        unitCostSession: '~₦52 / student / term',
        desc: 'High-volume examination processing and cognitive analytics for secondary colleges.',
        students: 'Up to 1,000 active students',
        features: [
          'Unlimited scratch card PIN batch generation',
          'AI subject mastery & teacher performance analytics',
          'WAEC, NECO, IGCSE & custom grading scales',
          'Bulk 1-click PDF dossier export',
          'Priority WhatsApp & phone support'
        ],
        cta: 'Deploy ResultsPRO Pro',
        popular: false
      }
    ]
  },
  {
    id: 'CampusPRO',
    label: 'CampusPRO',
    tagline: 'Standalone school ERP covering bursary, admissions, timetables, HR payroll, library & transport.',
    icon: IconBuildingCommunity,
    tiers: [
      {
        id: 'campuspro-core',
        name: 'CAMPUS CORE',
        termPrice: 40000,
        sessionTermPrice: 32000,
        periodLabel: '/ term',
        unitCostTerm: '~₦160 / student / term',
        unitCostSession: '~₦128 / student / term',
        desc: 'Digitize admissions, attendance, public website CMS, and parent communications.',
        students: 'Up to 250 active students',
        features: [
          'Digital admissions funnel & enrollment CRM',
          'Assigned Campus Mobile App (Parent & Teacher App IDs)',
          'Public school website CMS (Notices, News & Events)',
          'Student & staff attendance tracking',
          'Parent circular & SMS/WhatsApp broadcast hub'
        ],
        cta: 'Deploy CampusPRO Core',
        popular: false
      },
      {
        id: 'campuspro-erp',
        name: 'FULL CAMPUS ERP',
        termPrice: 75000,
        sessionTermPrice: 60000,
        periodLabel: '/ term',
        unitCostTerm: '~₦100 / student / term',
        unitCostSession: '~₦80 / student / term',
        desc: 'Complete financial, HR payroll, timetable, and operational control for modern schools.',
        students: 'Up to 750 active students',
        features: [
          'Assigned Campus Mobile App (Parents, Teachers, Drivers & Admins)',
          'Bursary invoicing, Paystack reconciliation & debtors',
          'Staff HR records, allowances & automated payroll',
          'Clash-free master timetable & room allocation',
          'Library catalog, store inventory & transport fleet'
        ],
        cta: 'Deploy Full CampusPRO',
        popular: true
      },
      {
        id: 'campuspro-group',
        name: 'MULTI-CAMPUS GROUP',
        termPrice: 180000,
        sessionTermPrice: 144000,
        periodLabel: '/ term',
        unitCostTerm: 'Unlimited branches & seats',
        unitCostSession: 'Unlimited branches & seats',
        desc: 'Centralized board-level governance across multiple school annexes and campuses.',
        students: 'Unlimited students & campuses',
        features: [
          'Consolidated multi-branch revenue & expense telemetry',
          'Biometric staff & student clock-in integration',
          'Custom approval workflows & audit trails',
          'Dedicated technical account manager'
        ],
        cta: 'Contact Institutional Sales',
        popular: false,
        isPrefixPrice: true
      }
    ]
  },
  {
    id: 'ClassroomPRO',
    label: 'ClassroomPRO',
    tagline: 'Standalone offline-first NERDC curriculum handouts, formative quizzes & SRS flashcards.',
    icon: IconBook2,
    tiers: [
      {
        id: 'classroompro-solo',
        name: 'SOLO EDUCATOR',
        termPrice: 7500,
        sessionTermPrice: 6000,
        periodLabel: '/ term',
        unitCostTerm: '1 Teacher · Up to 50 Students',
        unitCostSession: '1 Teacher · Up to 50 Students',
        desc: 'For independent teachers and lesson coaches sharing digital notes and quizzes.',
        students: 'Up to 50 active students',
        features: [
          'Digital lesson notes & assignment builder',
          'Auto-graded formative quizzes',
          'Spaced-repetition (SRS) student flashcards',
          'Email support'
        ],
        cta: 'Start ClassroomPRO Solo',
        popular: false
      },
      {
        id: 'classroompro-starter',
        name: 'SCHOOL STARTER',
        termPrice: 40000,
        sessionTermPrice: 32000,
        periodLabel: '/ term',
        unitCostTerm: '~₦80 / student / term',
        unitCostSession: '~₦64 / student / term',
        desc: 'Equip your faculty with offline-ready curriculum resources and digital assignments.',
        students: 'Up to 500 active students',
        features: [
          'Up to 30 teachers & 500 students',
          'Full NERDC secondary syllabus repository',
          'Offline-first student mobile sync',
          'Class engagement & quiz analytics'
        ],
        cta: 'Deploy School Starter',
        popular: true
      },
      {
        id: 'classroompro-pro',
        name: 'SCHOOL PRO',
        termPrice: 85000,
        sessionTermPrice: 68000,
        periodLabel: '/ term',
        unitCostTerm: 'Unlimited teachers & students',
        unitCostSession: 'Unlimited teachers & students',
        desc: 'Institution-wide digital LMS with custom school branding and multimedia storage.',
        students: 'Unlimited active students',
        features: [
          'Unlimited teachers, classes & student seats',
          'Custom curriculum publishing & department review',
          'White-label school branding & domain',
          'Priority faculty training & support'
        ],
        cta: 'Deploy School Pro',
        popular: false
      }
    ]
  },
  {
    id: 'PuzzlePRO',
    label: 'PuzzlePRO',
    tagline: 'Standalone gamified coding curriculum with 636 quests in Blockly, HTML, CSS, JS & Python.',
    icon: IconPuzzle,
    tiers: [
      {
        id: 'puzzlepro-family',
        name: 'FAMILY / SOLO',
        termPrice: 9000,
        sessionTermPrice: 7200,
        periodLabel: '/ term',
        unitCostTerm: 'Up to 5 children at home',
        unitCostSession: 'Up to 5 children at home',
        desc: 'Give your children a head start in coding, robotics logic, and computational thinking.',
        students: 'Up to 5 learners',
        features: [
          'All 636 coding adventure quests unlocked',
          'Blockly visual blocks + HTML, CSS, JS & Python',
          'Parent cognitive progress reports',
          'Instant passwordless 8-digit access codes'
        ],
        cta: 'Get Family Coding Pass',
        popular: false
      },
      {
        id: 'puzzlepro-starter',
        name: 'SCHOOL ICT CLUB',
        termPrice: 35000,
        sessionTermPrice: 28000,
        periodLabel: '/ term',
        unitCostTerm: '~₦100 / student / term',
        unitCostSession: '~₦80 / student / term',
        desc: 'Launch a profitable coding & STEM club in your primary or secondary school computer lab.',
        students: 'Up to 350 active students',
        features: [
          'Educator portal & class roster management',
          'Grade-aligned coding labs & XP leaderboards',
          'Browser-based (zero installation on lab PCs)',
          'Printable student coding certificates'
        ],
        cta: 'Launch School ICT Club',
        popular: true
      },
      {
        id: 'puzzlepro-pro',
        name: 'CAMPUS STEM PRO',
        termPrice: 75000,
        sessionTermPrice: 60000,
        periodLabel: '/ term',
        unitCostTerm: 'Unlimited students & inter-house leagues',
        unitCostSession: 'Unlimited students & inter-house leagues',
        desc: 'Full-school coding curriculum with inter-house hackathons and custom school leaderboards.',
        students: 'Unlimited active students',
        features: [
          'Unlimited student accounts across all grades',
          'Inter-house & inter-school coding tournaments',
          'Custom character sprites & school branding',
          'Dedicated STEM curriculum onboarding'
        ],
        cta: 'Deploy Campus STEM Pro',
        popular: false
      }
    ]
  },
  {
    id: 'TutorsPRO',
    label: 'TutorsPRO',
    tagline: 'On-demand 1-on-1 remedial tutoring with vetted subject-matter educators and live whiteboards.',
    icon: IconUsers,
    tiers: [
      {
        id: 'tutorspro-solo',
        name: 'SOLO LEARNER',
        termPrice: 15,
        sessionTermPrice: 14,
        periodLabel: '/ hour',
        unitCostTerm: 'Billed in 5-hour blocks',
        unitCostSession: 'Billed in 15-hour term blocks',
        desc: 'Targeted 1-on-1 exam prep or remedial support in a single subject.',
        students: '1 student · Flexible schedule',
        features: [
          'Vetted WAEC, NECO, JAMB & IGCSE tutors',
          'Interactive virtual classroom & digital whiteboard',
          'Session recording & post-class summary',
          'Flexible rescheduling'
        ],
        cta: 'Book Solo Tutor',
        popular: false,
        currency: '$',
        isHourly: true
      },
      {
        id: 'tutorspro-family',
        name: 'FAMILY MENTORSHIP',
        termPrice: 12,
        sessionTermPrice: 10,
        periodLabel: '/ hour',
        unitCostTerm: 'Billed in 20-hour blocks',
        unitCostSession: 'Billed in 60-hour session blocks',
        desc: 'Multi-subject private tuition shared across siblings with detailed parent analytics.',
        students: 'Up to 3 siblings · Up to 3 subjects',
        features: [
          'Top 5% vetted subject specialists',
          'Synced directly with school weak-topic reports',
          'Detailed weekly parent mastery reports',
          'Priority tutor matching guarantee'
        ],
        cta: 'Start Family Plan',
        popular: true,
        currency: '$',
        isHourly: true
      },
      {
        id: 'tutorspro-school',
        name: 'SCHOOL REMEDIAL BLOCK',
        termPrice: 8,
        sessionTermPrice: 7,
        periodLabel: '/ hour',
        unitCostTerm: 'Institutional bulk blocks (100+ hrs)',
        unitCostSession: 'Institutional bulk blocks (300+ hrs)',
        desc: 'Augment your teaching staff with specialist WAEC/STEM intervention clinics for exam classes.',
        students: 'Small-group & SSS3 clinic cohorts',
        features: [
          'Bulk institutional tutoring hours for exam classes',
          'Integrated with ResultsPRO at-risk student flags',
          'Principal & HOD progress dashboards',
          'Dedicated academic success coordinator'
        ],
        cta: 'Reserve School Block',
        popular: false,
        currency: '$',
        isHourly: true
      }
    ]
  }
];

const LEVY_PRESETS = [1000, 1500, 2000, 2500, 3000];

export default function PricingSection() {
  const [viewMode, setViewMode] = useState<PricingViewMode>('suite');
  const [selectedApp, setSelectedApp] = useState<StandaloneAppId>('ResultsPRO');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('term');
  const [studentCount, setStudentCount] = useState<number>(300);
  const [levyPerStudent, setLevyPerStudent] = useState<number>(2000);

  const formatAmount = (amount: number, currency = '₦') =>
    `${currency}${amount.toLocaleString('en-NG')}`;

  // Determine recommended tier cost based on student count and billing cycle
  const matchedTier =
    studentCount <= 250
      ? PRICING_TIERS[1]
      : studentCount <= 750
      ? PRICING_TIERS[2]
      : PRICING_TIERS[3];

  const subscriptionCostPerTerm =
    billingCycle === 'term' ? matchedTier.termPrice : matchedTier.sessionTermPrice;

  const grossTermRevenue = studentCount * levyPerStudent;
  const netTermSurplus = Math.max(0, grossTermRevenue - subscriptionCostPerTerm);
  const netSessionSurplus = netTermSurplus * 3;
  const roiMultiple =
    subscriptionCostPerTerm > 0
      ? (grossTermRevenue / subscriptionCostPerTerm).toFixed(1)
      : '10.0';

  const currentStandaloneApp =
    STANDALONE_APPS.find((a) => a.id === selectedApp) || STANDALONE_APPS[0];

  const renderTierCard = (tier: PricingTier, colCount: number) => {
    const currency = tier.currency || '₦';
    const activePrice =
      billingCycle === 'term' ? tier.termPrice : tier.sessionTermPrice;
    const unitCost =
      billingCycle === 'term' ? tier.unitCostTerm : tier.unitCostSession;

    return (
      <div
        key={tier.id}
        className={`card p-8 flex flex-col justify-between relative ${
          tier.popular ? 'border-2' : ''
        }`}
        style={
          tier.popular
            ? {
                borderColor: 'var(--color-nets-red)',
                transform: 'translateY(-4px)',
                boxShadow: 'var(--shadow-card-lg)',
                overflow: 'visible'
              }
            : {}
        }
      >
        {tier.popular && (
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20
            }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                background: 'var(--color-nets-red)',
                color: '#0D1060',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.35rem 0.95rem',
                borderRadius: '999px',
                border: '2px solid #FFFFFF',
                boxShadow:
                  '0 8px 20px rgba(251, 188, 4, 0.5), 0 2px 6px rgba(13, 16, 96, 0.18)',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <IconSparkles size={12} strokeWidth={2.5} />
              <span>Most Popular</span>
            </motion.div>
          </div>
        )}

        <div>
          <div className="overline" style={{ marginBottom: '0.5rem' }}>
            {tier.name}
          </div>

          {tier.isPrefixPrice && (
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-nets-text-2)',
                marginTop: '0.25rem'
              }}
            >
              Starting From
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.25rem',
              margin: '0.5rem 0'
            }}
          >
            <span
              style={{
                fontSize: colCount === 3 ? '2.35rem' : '2.15rem',
                fontWeight: 800,
                color: 'var(--color-nets-navy-dark)',
                letterSpacing: '-0.03em'
              }}
            >
              {formatAmount(activePrice, currency)}
            </span>
            <span className="text-muted text-xs">{tier.periodLabel}</span>
          </div>

          {/* Unit Economics Callout Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.6rem',
              borderRadius: '2px',
              background: tier.popular
                ? 'rgba(251, 188, 4, 0.16)'
                : 'rgba(26, 31, 168, 0.08)',
              color: '#0D1060',
              marginBottom: '0.65rem'
            }}
          >
            <IconSparkles size={13} />
            <span>{unitCost}</span>
          </div>

          {billingCycle === 'session' && activePrice > 0 && !tier.isHourly && (
            <div
              style={{
                fontSize: '0.7rem',
                color: '#16A34A',
                fontWeight: 600,
                marginBottom: '0.5rem'
              }}
            >
              Billed {formatAmount(activePrice * 3, currency)} per 3-term session (Save{' '}
              {formatAmount((tier.termPrice - tier.sessionTermPrice) * 3, currency)}/yr)
            </div>
          )}

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--color-nets-navy)',
              marginBottom: '0.65rem'
            }}
          >
            {tier.students}
          </div>

          <p className="text-muted text-xs mb-6 leading-relaxed">{tier.desc}</p>

          <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-6">
            {tier.features.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-start gap-2 text-xs text-muted">
                <IconCheck
                  className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Link
            href={`/school/register?plan=${tier.id}&billing=${billingCycle}`}
            className={tier.popular ? 'btn btn-red w-full' : 'btn btn-navy w-full'}
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
          >
            {tier.cta}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section id="pricing" className="section-py bg-white border-y border-gray-200">
      <div className="container-nets">
        {/* ── Header & Controls ── */}
        <div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          style={{ marginBottom: '2.5rem' }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>
              Term-Aligned Subscriptions
            </div>
            <h2 className="text-d4 fw-400">
              Self-Funding Digital Infrastructure Built Around the Nigerian Academic Calendar.
            </h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Deploy the unified 5-app ScholarsNG Digital Campus or subscribe to individual specialist apps standalone. Pay per academic term—or lock in a 3-term session for 20% off.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--color-nets-light)',
              border: '1px solid var(--color-nets-border)',
              borderRadius: '3px',
              padding: '0.3rem',
              gap: '0.25rem',
              alignSelf: 'flex-start'
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle('term')}
              style={{
                padding: '0.625rem 1.125rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: billingCycle === 'term' ? 'var(--color-nets-navy-dark)' : 'transparent',
                color: billingCycle === 'term' ? '#FFFFFF' : 'var(--color-nets-text-2)'
              }}
            >
              Per Term (4 Months)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('session')}
              style={{
                padding: '0.625rem 1.125rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background:
                  billingCycle === 'session' ? 'var(--color-nets-navy-dark)' : 'transparent',
                color: billingCycle === 'session' ? '#FFFFFF' : 'var(--color-nets-text-2)'
              }}
            >
              <span>Full Session (3 Terms)</span>
              <span
                style={{
                  background: 'var(--color-nets-red)',
                  color: '#0D1060',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Primary Mode Tabs: ScholarsNG Full Suite vs. Individual Specialist Apps ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--color-nets-border)'
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('suite')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.5rem',
              borderRadius: '3px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              background:
                viewMode === 'suite' ? 'var(--color-nets-navy-dark)' : 'var(--color-nets-light)',
              color: viewMode === 'suite' ? '#FFFFFF' : 'var(--color-nets-text)',
              border:
                viewMode === 'suite'
                  ? '2px solid var(--color-nets-navy-dark)'
                  : '1px solid var(--color-nets-border)',
              boxShadow: viewMode === 'suite' ? 'var(--shadow-card-md)' : 'none'
            }}
          >
            <IconLayersSubtract size={18} style={{ color: 'var(--color-nets-red)' }} />
            <span>ScholarsNG Complete Suite (All 5 Apps Bundled)</span>
            <span
              style={{
                background:
                  viewMode === 'suite' ? 'var(--color-nets-red)' : 'rgba(26, 31, 168, 0.08)',
                color: '#0D1060',
                fontSize: '0.625rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              Best Value
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('standalone')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.5rem',
              borderRadius: '3px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              background:
                viewMode === 'standalone'
                  ? 'var(--color-nets-navy-dark)'
                  : 'var(--color-nets-light)',
              color: viewMode === 'standalone' ? '#FFFFFF' : 'var(--color-nets-text)',
              border:
                viewMode === 'standalone'
                  ? '2px solid var(--color-nets-navy-dark)'
                  : '1px solid var(--color-nets-border)',
              boxShadow: viewMode === 'standalone' ? 'var(--shadow-card-md)' : 'none'
            }}
          >
            <IconBoxMultiple size={18} style={{ color: 'var(--color-nets-red)' }} />
            <span>Individual Specialist Apps (Standalone Plans)</span>
          </button>
        </div>

        {/* ── VIEW 1: SCHOLARS_NG COMPLETE SUITE BUNDLE (4 CARDS) ── */}
        {viewMode === 'suite' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => renderTierCard(tier, 4))}
          </div>
        )}

        {/* ── VIEW 2: INDIVIDUAL SPECIALIST APPS (MODULAR PRICING) ── */}
        {viewMode === 'standalone' && (
          <div>
            {/* Sub-navigation for the 5 specialist apps */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}
            >
              {STANDALONE_APPS.map((app) => {
                const Icon = app.icon;
                const isSelected = selectedApp === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApp(app.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.15rem',
                      borderRadius: '2px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      background: isSelected ? 'var(--color-nets-red)' : '#FFFFFF',
                      color: isSelected ? '#0D1060' : 'var(--color-nets-text-2)',
                      border: isSelected
                        ? '1.5px solid var(--color-nets-red)'
                        : '1.5px solid var(--color-nets-border)'
                    }}
                  >
                    <Icon size={16} />
                    <span>{app.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active App Tagline */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'var(--color-nets-light)',
                border: '1px solid var(--color-nets-border)',
                borderRadius: '3px',
                marginBottom: '2.25rem'
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'var(--color-nets-text)' }}>
                <strong style={{ color: 'var(--color-nets-navy-dark)' }}>
                  {currentStandaloneApp.label} Standalone:
                </strong>{' '}
                {currentStandaloneApp.tagline}
              </div>
              <button
                type="button"
                onClick={() => setViewMode('suite')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-nets-navy)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Save up to 45% by bundling all 5 apps in ScholarsNG &rarr;
              </button>
            </div>

            {/* 3 Cards for the Selected Individual App */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentStandaloneApp.tiers.map((tier) => renderTierCard(tier, 3))}
            </div>
          </div>
        )}

        {/* ── Interactive Self-Funding Bursary & Scratch Card ROI Calculator ── */}
        <div
          style={{
            marginTop: '3.5rem',
            background: 'var(--color-nets-navy-dark)',
            color: '#FFFFFF',
            borderRadius: '4px',
            padding: '2.5rem',
            borderLeft: '4px solid var(--color-nets-red)',
            boxShadow: 'var(--shadow-card-lg)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>
                  <IconCalculator size={14} />
                  <span>Bursary Revenue Simulator</span>
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    letterSpacing: '-0.015em',
                    marginBottom: '0.5rem'
                  }}
                >
                  Turn Your Portal Into a Net Surplus for Your School Bursary
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.6
                  }}
                >
                  Most Nigerian schools include a modest termly ICT, Coding &amp; Scratch Card PIN fee on student bills. Slide your enrollment below to see how ScholarsNG pays for itself multiple times over every term.
                </p>
              </div>

              {/* Slider 1: Student Count */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}
                >
                  <label
                    htmlFor="student-count-slider"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'rgba(255,255,255,0.75)'
                    }}
                  >
                    1. Active Student Enrollment
                  </label>
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: 'var(--color-nets-red)'
                    }}
                  >
                    {studentCount.toLocaleString()} Students
                  </span>
                </div>
                <input
                  id="student-count-slider"
                  type="range"
                  min={50}
                  max={1500}
                  step={25}
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#FBBC04',
                    cursor: 'pointer'
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.6875rem',
                    color: 'rgba(255,255,255,0.45)',
                    marginTop: '0.25rem'
                  }}
                >
                  <span>50 Students</span>
                  <span>250 (Growth)</span>
                  <span>750 (Pro Campus)</span>
                  <span>1,500+ (Institutional)</span>
                </div>
              </div>

              {/* Selector 2: Termly Scratch Card / ICT Levy per Student */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'rgba(255,255,255,0.75)'
                    }}
                  >
                    2. Termly Scratch Card &amp; Coding Portal Fee Charged to Parents
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#FFFFFF'
                    }}
                  >
                    {formatAmount(levyPerStudent)} / student / term
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LEVY_PRESETS.map((amount) => {
                    const isSelected = levyPerStudent === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setLevyPerStudent(amount)}
                        style={{
                          padding: '0.45rem 0.9rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          background: isSelected
                            ? 'var(--color-nets-red)'
                            : 'rgba(255,255,255,0.08)',
                          color: isSelected ? '#0D1060' : '#FFFFFF',
                          border: isSelected
                            ? '1px solid var(--color-nets-red)'
                            : '1px solid rgba(255,255,255,0.18)'
                        }}
                      >
                        {formatAmount(amount)} / term
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Results Card */}
            <div className="lg:col-span-5">
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '3px',
                  padding: '1.75rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.875rem',
                    marginBottom: '0.875rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                    Recommended Suite Plan ({matchedTier.name})
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {formatAmount(subscriptionCostPerTerm)} / term
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.875rem',
                    marginBottom: '1.125rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                    Gross Termly ICT &amp; PIN Revenue
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4ade80' }}>
                    {formatAmount(grossTermRevenue)} / term
                  </span>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-nets-red)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    Net Bursary Surplus Retained by Your School
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      +{formatAmount(netTermSurplus)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                      per term ({roiMultiple}x return)
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#4ade80',
                      fontWeight: 600,
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <IconTrendingUp size={15} />
                    <span>
                      +{formatAmount(netSessionSurplus)} net surplus per 3-term academic session
                    </span>
                  </div>
                </div>

                <Link
                  href={`/school/register?plan=${matchedTier.id}&billing=${billingCycle}&students=${studentCount}`}
                  className="btn btn-red w-full"
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Deploy {matchedTier.name} Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
