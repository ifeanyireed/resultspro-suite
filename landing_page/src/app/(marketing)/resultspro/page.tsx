import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import { MotionRise } from '@/components/ScrollRiseProvider';
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
  title: 'ResultsPRO | AI Assessment & Result Intelligence Engine',
  description: 'AI handwritten marksheet OCR, voice score entry, pre-publication AI result auditing, AI teacher & principal report card remarks, multi-campus performance intelligence, and the AI Results-Processing Officer.',
};

const FEATURES = [
  {
    icon: IconBrain,
    title: 'AI Handwritten Marksheet OCR & Voice Entry',
    desc: 'Snap photos of multi-page handwritten marksheets or dictate scores by voice. ResultsPRO fuzzy-matches names against CampusPRO rosters with mandatory teacher approval.'
  },
  {
    icon: IconReportAnalytics,
    title: 'Pre-Publication AI Result Auditor & Broadsheets',
    desc: 'Automatically detect missing CA scores, duplicate entries, attendance conflicts, and >25% term-over-term anomalies before deterministically compiling master broadsheets.'
  },
  {
    icon: IconChartBar,
    title: 'AI Results-Processing Officer & Multi-Campus Intelligence',
    desc: 'Compare Ikeja, Lekki, and Abuja campuses with strict campus isolation, query school data in plain English, and let the AI Results Officer guide end-of-term readiness.'
  },
  {
    icon: IconDeviceMobile,
    title: 'AI Teacher Remarks & Parent Remedial Loop',
    desc: 'Batch-generate personalized teacher and principal remarks in 4 tones, and give parents plain-language AI result interpretation that launches 1-click ClassroomPRO revision packs.'
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300">
              <IconChartBar size={16} />
              <span>ResultsPro ResultsPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Turning raw scores into <span style={{ fontWeight: 700, color: 'white' }}>actionable intelligence.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              From manual score entry to intelligent multi-campus academic reporting. ResultsPRO combines handwritten marksheet OCR, pre-publication AI error auditing, deterministic broadsheet computation, AI report-card narratives, and the AI Results-Processing Officer copilot.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/school" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: '#0D1060', fontWeight: 700, padding: '1rem 2rem', fontSize: '1rem' }}>
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
      <section className="section-py bg-white border-b border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <MotionRise>
              <h2 className="text-3xl fw-600 text-navy mb-6 leading-tight">
                Keep parents in the loop, automatically.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Schools that use ResultsPRO see a 400% increase in parental engagement. By delivering transparent, easy-to-understand analytics directly to their phones, parents become active partners in their child's education.
              </p>
              <ul className="space-y-4">
                {[
                  'Handwritten marksheet OCR & voice score entry matched to CampusPRO rosters',
                  'Pre-publication AI Result Auditor catching missing scores & attendance conflicts',
                  'AI Teacher & Principal report-card comment generator across 4 tone presets',
                  'Parent AI Result Interpreter with 1-click ClassroomPRO remedial revision packs'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 text-green-700 p-1 rounded-full">
                      <IconCheck size={14} />
                    </div>
                    <span className="fw-500 text-navy">{item}</span>
                  </li>
                ))}
              </ul>
            </MotionRise>
            <MotionRise delay={0.15} className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://res.cloudinary.com/qsdwzejd/image/upload/v1789250551/landing_page/photo07.jpg" 
                alt="Parents viewing ResultsPRO app" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </MotionRise>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="section-py bg-light">
        <div className="container-nets">
          <MotionRise className="text-center max-w-2xl mx-auto mb-16">
            <div className="overline-dark mb-4">Core Capabilities</div>
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Analytics that matter.</h2>
            <p className="text-muted text-lg">Empowering teachers and parents with deep insights.</p>
          </MotionRise>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <MotionRise key={i} delay={i * 0.08} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-xl fw-600 text-navy mb-3">{feat.title}</h3>
                <p className="text-muted leading-relaxed">{feat.desc}</p>
              </MotionRise>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <MotionRise className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl fw-600 mb-6">Ready to streamline your grading?</h2>
          <p className="text-xl text-white/70 mb-10">Say goodbye to manual calculations and printed broadsheets.</p>
          <Link href="/onboard/school" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: '#0D1060', fontWeight: 700, padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Get Started <IconArrowRight size={20} />
          </Link>
        </MotionRise>
      </section>
    </main>
  );
}
