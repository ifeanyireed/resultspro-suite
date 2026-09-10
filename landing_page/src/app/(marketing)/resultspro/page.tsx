import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { 
  IconChartBar, 
  IconBrain, 
  IconReportAnalytics, 
  IconDeviceMobile, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'ResultsPRO | ResultsPro Edu Suite',
  description: 'AI-powered results processing and insights. Turn raw grading data into actionable cognitive mapping.',
};

const FEATURES = [
  {
    icon: IconBrain,
    title: 'Cognitive Analytics',
    desc: 'Go beyond simple letter grades. Our AI analyzes assessment data to map out a student\'s cognitive strengths and weaknesses.'
  },
  {
    icon: IconReportAnalytics,
    title: 'Automated Report Cards',
    desc: 'Generate beautifully designed, comprehensive termly report cards for the entire school in a single click.'
  },
  {
    icon: IconDeviceMobile,
    title: 'Parent Mobile App',
    desc: 'Parents receive real-time push notifications about test scores, attendance, and behavioral remarks instantly.'
  },
  {
    icon: IconChartBar,
    title: 'School-Wide Trends',
    desc: 'Administrators get macro-level insights to see which subjects need more resource allocation and which teachers are outperforming.'
  }
];

export default function ResultsProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-emerald-300">
              <IconChartBar size={16} />
              <span>ResultsPro ResultsPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Turning raw scores into <span style={{ fontWeight: 700, color: 'white' }}>actionable intelligence.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Stop burying data in filing cabinets. ResultsPRO uses artificial intelligence to process exam scores, identify learning patterns, and deliver instant, rich report cards to parents.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/school" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Setup ResultsPRO
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
                Keep parents in the loop, automatically.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Schools that use ResultsPRO see a 400% increase in parental engagement. By delivering transparent, easy-to-understand analytics directly to their phones, parents become active partners in their child's education.
              </p>
              <ul className="space-y-4">
                {[
                  'One-click result compilation',
                  'Custom grading systems (WAEC, IGCSE, etc.)',
                  'Behavioral & psychomotor evaluations',
                  'Automated class rankings'
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
                src="/photo07.jpeg" 
                alt="Parents viewing ResultsPRO app" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Analytics that matter.</h2>
            <p className="text-muted text-lg">Empowering teachers and parents with deep insights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-3">{feat.title}</h3>
                <p className="text-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl fw-600 mb-6">Ready to streamline your grading?</h2>
          <p className="text-xl text-white/70 mb-10">Say goodbye to manual calculations and printed broadsheets.</p>
          <Link href="/onboard/school" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Get Started <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
