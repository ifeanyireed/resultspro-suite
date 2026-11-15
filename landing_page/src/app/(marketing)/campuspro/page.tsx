import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import { MotionRise } from '@/components/ScrollRiseProvider';
import CampusProModulesGrid from '@/components/CampusProModulesGrid';
import Link from 'next/link';
import {
  IconBuildingCommunity,
  IconCheck,
  IconArrowRight,
  IconShieldLock,
  IconServer,
  IconDevices,
  IconUsers,
} from '@tabler/icons-react';

export const metadata = {
  title: 'CampusPRO | 20 Integrated Modules School Operations ERP',
  description:
    'The complete institutional ERP for modern schools: 20 integrated operational modules spanning Academics, Biometric Attendance, Bursary Invoicing, Clinic Sick Bay, Hostel Exeat, Security Gate, Cashless Cafeteria, and Fleet GPS.',
};

export default function CampusProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '11rem', paddingBottom: '7rem' }}
      >
        <div className="absolute top-0 right-0 w-[55%] h-[100%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[70%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md text-amber-300">
                <IconBuildingCommunity size={16} />
                <span>ResultsPro CampusPRO · 20 Enterprise Modules</span>
              </div>
              <h1
                className="font-light tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}
              >
                Run your entire campus on <span style={{ fontWeight: 800, color: 'white' }}>autopilot.</span>
              </h1>
              <p className="text-body-lg text-white/80 mt-6 max-w-2xl text-base sm:text-lg leading-relaxed">
                From biometric gate turnstiles and automated bursary tuition collections to digital sick bay triage, QR hostel exeat vouchers, cashless cafeteria wallets, and live school bus GPS tracking—CampusPRO unifies all 20 operational departments of your institution.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 pt-8 border-t border-white/10 max-w-3xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">20</div>
                  <div className="text-xs text-white/60 font-medium mt-0.5">Built-in Modules</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">100%</div>
                  <div className="text-xs text-white/60 font-medium mt-0.5">Tenant Isolated</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">0 ms</div>
                  <div className="text-xs text-white/60 font-medium mt-0.5">Biometric Gate Lag</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">Multi</div>
                  <div className="text-xs text-white/60 font-medium mt-0.5">Branch Network</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                <Link
                  href="/onboard"
                  className="btn w-full sm:w-auto text-center shadow-lg hover:brightness-105 transition-all"
                  style={{
                    backgroundColor: 'var(--color-nets-red, #FBBC04)',
                    color: '#0D1060',
                    fontWeight: 700,
                    padding: '0.9rem 2.25rem',
                    fontSize: '1rem',
                    borderRadius: '12px',
                  }}
                >
                  Deploy CampusPRO Suite
                </Link>
                <Link
                  href="#modules"
                  className="btn btn-outline-white w-full sm:w-auto text-center"
                  style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderRadius: '12px' }}
                >
                  Browse All 20 Modules ↓
                </Link>
              </div>
            </div>
          </HeroAnimationWrapper>
        </div>
      </section>

      {/* Value Prop & Executive Overview */}
      <section className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <MotionRise>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                A Unified Operating System
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">
                Total visibility for school leaders, seamless peace of mind for parents.
              </h2>
              <p className="text-muted text-base sm:text-lg mb-8 leading-relaxed">
                Replace fragmented spreadsheets, paper logbooks, and informal WhatsApp chats with a hardened operational platform engineered specifically for modern African K-12 and tertiary campuses.
              </p>
              <ul className="space-y-3.5">
                {[
                  'Automated termly bursary billing, Paystack reconciliation & digital receipts',
                  'Biometric optical fingerprint & RFID gate cards with instant parent SMS alerts',
                  'Fraud-proof digital exeat passes with QR scanning for boarding houses',
                  'Live school bus telemetry with parent proximity push notifications',
                  'Strict child safeguarding with single-use dismissal PIN authentication',
                  'Cashless tuck shop & cafeteria RFID wristbands with parental spending limits',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-emerald-100 text-emerald-700 p-1 rounded-full flex-shrink-0">
                      <IconCheck size={14} stroke={3} />
                    </div>
                    <span className="font-semibold text-navy text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </MotionRise>
            <MotionRise delay={0.15} className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src="https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/photo13.jpg"
                alt="CampusPRO School Operations"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white text-xs sm:text-sm font-medium backdrop-blur-md bg-black/40 p-4 rounded-xl border border-white/20 w-full">
                  <span className="font-bold text-amber-300 block mb-0.5">High-Precision Campus Coordination</span>
                  Unifying bursary, infirmary, boarding, gates, and academics under one strict tenant-isolated database.
                </div>
              </div>
            </MotionRise>
          </div>
        </div>
      </section>

      {/* Complete 20 Modules Section */}
      <section id="modules" className="section-py bg-light">
        <div className="container-nets">
          <MotionRise className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              Full Institutional Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy mb-4 tracking-tight">
              All 20 CampusPRO Modules
            </h2>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Every operational department of a modern primary, secondary, or collegiate campus—digitized, automated, and deeply integrated with zero third-party patchwork.
            </p>
          </MotionRise>

          {/* Interactive 20 Modules Grid with Search & Category Filters */}
          <CampusProModulesGrid />
        </div>
      </section>

      {/* Enterprise Reliability & Infrastructure Grid */}
      <section className="section-py bg-white border-t border-b border-gray-200">
        <div className="container-nets">
          <MotionRise className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-wider font-bold text-blue-600 mb-2">Built For African Realities</div>
            <h2 className="text-3xl font-bold text-navy mb-3">Enterprise Foundation. Rock-Solid Engineering.</h2>
            <p className="text-gray-600 text-sm sm:text-base">Designed to operate reliably across intermittent power, variable network bandwidth, and multi-campus environments.</p>
          </MotionRise>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <IconShieldLock size={24} />
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Strict Tenant Isolation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Row-level security enforcement across every database query. Student medical files, staff salaries, and fees are cryptographically partitioned.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <IconServer size={24} />
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Multi-Campus Sync</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Manage branch campuses (Primary, College, Boarding) from a centralized executive portal with consolidated financial and enrollment analytics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <IconDevices size={24} />
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Multi-Telco SMS Fallback</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                When internet access is unstable, automated priority queues fall back to low-cost SMS channels so parents never miss an emergency alert or gate notification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <IconUsers size={24} />
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Fine-Grained RBAC</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated role-based portals for School Owners, Bursars, Nurses, Housemasters, Gate Marshals, Teachers, Parents, and Students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 bg-navy text-white relative overflow-hidden"
        style={{ background: 'var(--color-nets-navy-dark)' }}
      >
        <div className="absolute top-0 right-1/4 w-[40%] h-[100%] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <MotionRise className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
            Get Started Today
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to deploy all 20 modules across your school?
          </h2>
          <p className="text-base sm:text-xl text-white/80 mb-10 leading-relaxed">
            Eliminate operational chaos and join Africa’s most forward-thinking institutions running on CampusPRO. Onboard your institution in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboard"
              className="btn inline-flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl"
              style={{
                backgroundColor: 'var(--color-nets-red, #FBBC04)',
                color: '#0D1060',
                fontWeight: 800,
                padding: '1rem 2.75rem',
                fontSize: '1.125rem',
                borderRadius: '12px',
              }}
            >
              Deploy CampusPRO Now <IconArrowRight size={20} />
            </Link>
            <Link
              href="/demo"
              className="btn btn-outline-white w-full sm:w-auto text-center"
              style={{ padding: '1rem 2.25rem', fontSize: '1.125rem', borderRadius: '12px' }}
            >
              Book Leadership Walkthrough
            </Link>
          </div>
        </MotionRise>
      </section>
    </main>
  );
}
