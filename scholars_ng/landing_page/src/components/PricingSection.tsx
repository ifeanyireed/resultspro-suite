"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconCheck, IconCalculator, IconSparkles, IconTrendingUp } from '@tabler/icons-react';

type BillingCycle = 'term' | 'session';

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

const LEVY_PRESETS = [1000, 1500, 2000, 2500, 3000];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('term');
  const [studentCount, setStudentCount] = useState<number>(300);
  const [levyPerStudent, setLevyPerStudent] = useState<number>(2000);

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

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

  return (
    <section id="pricing" className="section-py bg-white border-y border-gray-200">
      <div className="container-nets">
        {/* ── Header & Term / Session Billing Toggle ── */}
        <div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          style={{ marginBottom: '3.5rem' }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>
              Term-Aligned Subscriptions
            </div>
            <h2 className="text-d4 fw-400">
              Self-Funding Digital Infrastructure Built Around the Nigerian Academic Calendar.
            </h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              No monthly bills during school holidays. Pay per academic term—or lock in a full 3-term session for 20% off—while turning scratch cards and coding access into a net bursary surplus.
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

        {/* ── 4 Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => {
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
                        fontSize: '2.15rem',
                        fontWeight: 800,
                        color: 'var(--color-nets-navy-dark)',
                        letterSpacing: '-0.03em'
                      }}
                    >
                      {formatNaira(activePrice)}
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

                  {billingCycle === 'session' && activePrice > 0 && (
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#16A34A',
                        fontWeight: 600,
                        marginBottom: '0.5rem'
                      }}
                    >
                      Billed {formatNaira(activePrice * 3)} per 3-term session (Save{' '}
                      {formatNaira((tier.termPrice - tier.sessionTermPrice) * 3)}/yr)
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
          })}
        </div>

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
                    {formatNaira(levyPerStudent)} / student / term
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
                        {formatNaira(amount)} / term
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
                    Recommended Plan ({matchedTier.name})
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {formatNaira(subscriptionCostPerTerm)} / term
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
                    {formatNaira(grossTermRevenue)} / term
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
                      +{formatNaira(netTermSurplus)}
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
                      +{formatNaira(netSessionSurplus)} net surplus per 3-term academic session
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
