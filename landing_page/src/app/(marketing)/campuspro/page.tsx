import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import Link from 'next/link';
import {
  IconBuildingCommunity,
  IconBus,
  IconCreditCard,
  IconDeviceMobile,
  IconBellRinging,
  IconCheck,
  IconArrowRight,
} from '@tabler/icons-react';

export const metadata = {
  title: 'CampusPRO | ResultsPro Edu Suite',
  description:
    'Complete school operations ERP with automated bursary billing, school bus GPS tracking, campus social feeds, push notifications, and a unified campus mobile app.',
};

const FEATURES = [
  {
    icon: IconCreditCard,
    title: 'Bursary & Tuition Ledger',
    desc: 'Automate termly fee invoicing, track partial payments in real time, and issue instant digital receipts with zero reconciliation headaches.',
  },
  {
    icon: IconBus,
    title: 'School Bus GPS Tracking',
    desc: 'Monitor campus transit routes in real time and notify parents automatically when the school bus is approaching their stop or arriving on campus.',
  },
  {
    icon: IconDeviceMobile,
    title: 'Dedicated Campus Mobile App',
    desc: 'Give parents, teachers, bus drivers, and administrators a unified mobile companion featuring campus social feeds, direct messaging, and results checking.',
  },
  {
    icon: IconBellRinging,
    title: 'Instant Alerts & Reminders',
    desc: 'Send real-time push notifications for gate attendance, bus arrivals, SOS alerts, fee reminders, upcoming events, and class sessions.',
  },
];

export default function CampusProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section
        className="bg-navy text-white relative overflow-hidden"
        style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}
      >
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-rose-300">
                <IconBuildingCommunity size={16} />
                <span>ResultsPro CampusPRO</span>
              </div>
              <h1
                className="fw-300 tracking-tight"
                style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}
              >
                Run your entire campus on <span style={{ fontWeight: 700, color: 'white' }}>autopilot.</span>
              </h1>
              <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
                From automated bursary collections and HR payroll to live school bus GPS tracking, campus social feeds, and instant parent notifications—CampusPRO unifies everyday school operations.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                <Link
                  href="/onboard"
                  className="btn w-full sm:w-auto"
                  style={{
                    backgroundColor: 'var(--color-nets-red)',
                    color: '#0D1060',
                    fontWeight: 700,
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                  }}
                >
                  Deploy CampusPRO
                </Link>
                <Link
                  href="#features"
                  className="btn btn-outline-white w-full sm:w-auto text-center"
                  style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </HeroAnimationWrapper>
        </div>
      </section>

      {/* Value Prop */}
      <section className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl fw-600 text-navy mb-6 leading-tight">
                Total visibility for school leaders and peace of mind for parents.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Replace fragmented spreadsheets and informal chat groups with a structured operating system built for modern African schools. Every department, bus route, and family stays connected in real time.
              </p>
              <ul className="space-y-4">
                {[
                  'Automated fee reminders & digital receipts',
                  'Live school bus tracking & arrival push alerts',
                  'Campus social feeds & direct parent-teacher messaging',
                  'Gate attendance, SOS notifications & custom reminders',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 text-green-700 p-1 rounded-full">
                      <IconCheck size={14} />
                    </div>
                    <span className="fw-500 text-navy">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://res.cloudinary.com/qsdwzejd/image/upload/v1789250607/landing_page/photo13.jpg"
                alt="CampusPRO School Operations"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="section-py bg-light">
        <div className="container-nets">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="overline-dark mb-4">Core Capabilities</div>
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Everything your campus needs.</h2>
            <p className="text-muted text-lg">Built to streamline administration, safety, and parent engagement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-card-lg transition-all"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mb-6 text-rose-600">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-3">{feat.title}</h3>
                <p className="text-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 bg-navy text-white relative overflow-hidden"
        style={{ background: 'var(--color-nets-navy-dark)' }}
      >
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl fw-600 mb-6">Ready to modernize your campus operations?</h2>
          <p className="text-xl text-white/70 mb-10">
            Launch CampusPRO across your institution in minutes or book a tailored walkthrough for your leadership team.
          </p>
          <Link
            href="/onboard"
            className="btn inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--color-nets-red)',
              color: '#0D1060',
              fontWeight: 700,
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
            }}
          >
            Get Started with CampusPRO <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
