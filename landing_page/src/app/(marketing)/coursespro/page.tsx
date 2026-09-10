import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { 
  IconCertificate, 
  IconVideo, 
  IconBook2, 
  IconBadge, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'CoursesPRO | ResultsPro Edu Suite',
  description: 'Curated digital courses and certification pathways. Upskill with premium, self-paced learning modules.',
};

const FEATURES = [
  {
    icon: IconVideo,
    title: 'Rich Video Learning',
    desc: 'High-definition, studio-quality video lectures from subject matter experts designed for maximum retention.'
  },
  {
    icon: IconBook2,
    title: 'Self-Paced Pathways',
    desc: 'Learn on your own schedule. Our modules adapt to your pace, allowing you to pause, rewind, and master concepts.'
  },
  {
    icon: IconBadge,
    title: 'Verified Certificates',
    desc: 'Earn verifiable digital certificates upon course completion to showcase your newly acquired skills to the world.'
  },
  {
    icon: IconCertificate,
    title: 'Curriculum Aligned',
    desc: 'Courses designed in strict accordance with modern educational standards to ensure practical, real-world applicability.'
  }
];

export default function CoursesProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-cyan-300">
              <IconCertificate size={16} />
              <span>ResultsPro CoursesPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Premium digital courses for <span style={{ fontWeight: 700, color: 'white' }}>continuous growth.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Unlock your potential with CoursesPRO. We provide curated, high-quality digital learning pathways designed to help you master new skills and earn verified certifications.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/agent" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Explore Catalog
              </Link>
              <Link href="#features" className="btn btn-outline-white w-full sm:w-auto text-center" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                View Features
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
                Upskill with expertly crafted modules.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Whether you're looking to bridge knowledge gaps or acquire entirely new skill sets, CoursesPRO delivers structured, self-paced learning experiences that guarantee results.
              </p>
              <ul className="space-y-4">
                {[
                  'Expert-led video lectures',
                  'Interactive quizzes & assignments',
                  'Downloadable offline resources',
                  'Lifetime access to purchased modules'
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
                src="/photo11.jpeg" 
                alt="Student learning on CoursesPRO" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Learn without limits.</h2>
            <p className="text-muted text-lg">A powerful engine designed to make online learning seamless and impactful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center mb-6 text-cyan-600">
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
          <h2 className="text-4xl fw-600 mb-6">Ready to expand your knowledge?</h2>
          <p className="text-xl text-white/70 mb-10">Start your journey today and earn certificates that matter.</p>
          <Link href="/onboard/agent" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Browse Courses <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
