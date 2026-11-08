import { Metadata } from 'next';
import DemoBookingFlow from '@/components/demo/DemoBookingFlow';
import {
  IconCheck,
  IconShieldCheck,
  IconDeviceLaptop,
  IconUsers,
  IconServer,
  IconHelpCircle,
  IconSparkles,
  IconArrowRight,
} from '@tabler/icons-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book a Tailored Demo | ResultsPRO Edu Suite',
  description:
    'Schedule an interactive demonstration of ResultsPRO, ExamsPRO, ClassroomPRO, and CoursesPRO configured to your institution scale, infrastructure, and core pain points.',
};

export default function DemoPage() {
  const faqs = [
    {
      q: 'Who should attend our institution’s demo session?',
      a: 'We recommend having your School Proprietor / Board Member, Principal, Head of Academics or Exam Officer, and your IT or School Bursar present. This ensures all pedagogical, technical, and financial questions are addressed in a single, high-impact session.',
    },
    {
      q: 'Can you demonstrate how the platform runs 100% offline?',
      a: 'Yes. Every session includes our live Sub-Saharan Offline Failover Simulation. We physically disconnect internet connectivity during the test and show how students continue CBT exams on local LAN with zero data loss, automatically syncing back to the cloud when power/network is restored.',
    },
    {
      q: 'How long does historical data migration take from Excel or paper files?',
      a: 'Our automated migration tools ingest existing student registers, parent phone rosters, subject combinations, and historical broadsheets in under 48 hours. Our engineering team assists with full data validation and deduplication.',
    },
    {
      q: 'Is physical on-campus deployment and staff training available?',
      a: 'Absolutely. In addition to virtual onboarding, our certified deployment engineers provide on-campus hardware setup, LAN server commissioning, and hands-on teacher training across Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Kaduna, and Kano.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FC]">
      {/* HERO SECTION */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #090C45 0%, #0D1060 60%, #1A1FA8 100%)',
          paddingTop: '9rem',
          paddingBottom: '5rem',
        }}
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FBBC04]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-nets relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-bold mb-6 backdrop-blur-md text-[#FBBC04]">
            <IconSparkles size={16} />
            <span>Tailored Institutional Walkthrough</span>
          </div>

          <h1
            className="font-light tracking-tight text-white mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 4.25rem)',
              lineHeight: 1.15,
            }}
          >
            Experience ResultsPRO Built For{' '}
            <span className="font-extrabold text-[#FBBC04] block sm:inline">
              Your Exact Scale.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Select your institution type, operational pain points, and infrastructure context.
            Our senior EdTech architects will calibrate a live, hands-on demonstration around your exact needs.
          </p>

          {/* Social Proof Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 max-w-3xl mx-auto text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">150+</p>
              <p className="text-xs text-white/60">Partner Schools &amp; Campuses</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FBBC04]">350k+</p>
              <p className="text-xs text-white/60">Report Cards Verified</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">99.98%</p>
              <p className="text-xs text-white/60">Offline CBT Exam Uptime</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FBBC04]">14</p>
              <p className="text-xs text-white/60">Nigerian States Deployed</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WIZARD SECTION */}
      <section className="relative -mt-10 z-20 pb-20 px-4 sm:px-6">
        <div className="container-nets">
          <DemoBookingFlow />
        </div>
      </section>

      {/* WHY BOOK A TAILORED DEMO SECTION */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="container-nets max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">
              The ResultsPRO Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Institutional Leaders Book Our Custom Walkthrough
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              We don’t show canned generic slide decks. You experience the software simulating your school’s student volume, grading policies, and network reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D1060] text-[#FBBC04] flex items-center justify-center font-bold">
                <IconServer size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Offline LAN Simulation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch how ExamsPRO keeps running when power cuts out and internet drops. Experience tamper-proof local proctoring and zero-data-loss synchronization.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FBBC04] text-[#0D1060] flex items-center justify-center font-bold">
                <IconShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Anti-Fraud Report Cards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test holographic QR code report slips. Parents scan with any smartphone camera to instantly verify genuine broadsheet grades against our immutable database.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D1060] text-[#FBBC04] flex items-center justify-center font-bold">
                <IconUsers size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Bespoke Migration Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bring your current Excel mark-sheets or legacy software exports. Our engineers evaluate your schema live and map out a 48-hour seamless onboarding path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="container-nets max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Everything You Need to Know About the Demo
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
              >
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                  <IconHelpCircle size={18} className="text-blue-600 shrink-0" />
                  <span>{item.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 bg-[#0D1060] text-white text-center">
        <div className="container-nets max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Transform Your Campus Infrastructure?
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking school proprietors, registrars, and education commissioners deploying ResultsPRO today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#top"
              className="px-8 py-3.5 rounded-xl bg-[#FBBC04] text-[#0D1060] font-black text-sm hover:bg-[#E5A800] transition shadow-lg inline-flex items-center gap-2"
            >
              <span>Scroll to Demo Configurator</span>
              <IconArrowRight size={18} />
            </a>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition"
            >
              Contact Sales Directly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
