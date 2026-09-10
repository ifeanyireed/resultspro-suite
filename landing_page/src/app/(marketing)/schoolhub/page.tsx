import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import Link from 'next/link';
import { 
  IconBuildingBank, 
  IconUsers, 
  IconCalendarEvent, 
  IconFileInvoice, 
  IconChartBar, 
  IconCheck, 
  IconArrowRight, IconSchool 
} from '@tabler/icons-react';

export const metadata = {
  title: 'SchoolHub | ResultsPro Edu Suite',
  description: 'The complete operating system for modern African schools. Manage finance, HR, admissions, and more in one unified platform.',
};

const FEATURES = [
  {
    icon: IconFileInvoice,
    title: 'Automated Fee Collection',
    desc: 'Stop chasing payments. Automatically generate invoices, send SMS reminders, and reconcile payments instantly via our secure gateways.'
  },
  {
    icon: IconUsers,
    title: 'HR & Staff Payroll',
    desc: 'Manage teacher profiles, track attendance, and automate payroll processing with comprehensive tax and deduction calculations.'
  },
  {
    icon: IconBuildingBank,
    title: 'Smart Admissions',
    desc: 'Digitize your entire enrollment funnel. Accept applications online, conduct CBT entrance exams, and issue admission letters seamlessly.'
  },
  {
    icon: IconCalendarEvent,
    title: 'Dynamic Timetabling',
    desc: 'Our AI engine resolves classroom and teacher clashes automatically, generating optimal timetables in seconds instead of weeks.'
  },
  {
    icon: IconChartBar,
    title: 'Executive Dashboards',
    desc: 'Real-time birds-eye view of your school\'s health. Track revenue growth, student retention, and staff performance from your phone.'
  }
];

export default function SchoolHubPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300">
              <IconSchool size={16} />
              <span>ResultsPro SchoolHub</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              The operating system for <span style={{ fontWeight: 700, color: 'white' }}>modern schools.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Eliminate paper trails and disjointed software. SchoolHub unifies your admissions, finance, human resources, and daily operations into one powerful, mobile-first command center.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/school" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Deploy SchoolHub
              </Link>
              <Link href="#features" className="btn btn-outline-white w-full sm:w-auto text-center" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Explore Features
              </Link>
            </div>
          </div>
          </HeroAnimationWrapper>
        </div>
      </section>

      {/* Value Prop */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl fw-600 text-navy mb-6 leading-tight">
                Run your school like a modern enterprise.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Most schools in Africa lose up to 15% of their potential revenue to inefficiencies, manual receipt tracking, and undocumented expenses. SchoolHub plugs the leaks by bringing bank-grade financial technology directly into your administrative office.
              </p>
              <ul className="space-y-4">
                {[
                  'Zero setup cost for partner schools',
                  'Bank-grade data encryption',
                  'Works flawlessly on mobile networks',
                  'Dedicated account manager'
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
                src="/photo12.jpeg" 
                alt="School Administrator using SchoolHub" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Everything you need to scale.</h2>
            <p className="text-muted text-lg">No more switching between accounting software, Excel sheets, and WhatsApp groups.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600">
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
      <section className="py-24 bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl fw-600 mb-6">Ready to digitize your campus?</h2>
          <p className="text-xl text-white/70 mb-10">Join over 140+ forward-thinking schools using ResultsPro to power their infrastructure.</p>
          <Link href="/onboard/school" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Start Onboarding <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
