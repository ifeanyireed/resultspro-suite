import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { 
  IconChalkboard, 
  IconUserCheck, 
  IconCalendarTime, 
  IconVideo, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'TutorsPRO | ResultsPro Edu Suite',
  description: 'Vetted, curriculum-aligned private tuition. Connect with elite educators for personalized learning.',
};

const FEATURES = [
  {
    icon: IconUserCheck,
    title: 'Elite Vetted Tutors',
    desc: 'Only the top 5% of applicants make it onto our platform. Every tutor undergoes rigorous background checks and subject mastery tests.'
  },
  {
    icon: IconChalkboard,
    title: 'Curriculum Aligned',
    desc: 'Our tutors don\'t just teach; they sync directly with the student\'s school curriculum via the ResultsPro ecosystem.'
  },
  {
    icon: IconCalendarTime,
    title: 'Flexible Scheduling',
    desc: 'Book one-off sessions for exam prep or set up recurring weekly classes. Manage all bookings seamlessly through the app.'
  },
  {
    icon: IconVideo,
    title: 'In-Person or Virtual',
    desc: 'Choose between physical home tutoring or interactive virtual classrooms equipped with digital whiteboards.'
  }
];

export default function TutorsProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-rose-300">
              <IconChalkboard size={16} />
              <span>ResultsPro TutorsPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Personalized learning from <span style={{ fontWeight: 700, color: 'white' }}>elite educators.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Sometimes a classroom isn't enough. TutorsPRO connects students with highly vetted, curriculum-aligned private tutors for targeted, one-on-one academic intervention.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/parent" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Find a Tutor
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
                Quality education, tailored to your child.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                We remove the guesswork from hiring a private tutor. Our intelligent matchmaking algorithm pairs your child with an educator who fits their specific learning style and academic needs.
              </p>
              <ul className="space-y-4">
                {[
                  'Rigorous 4-step vetting process',
                  'Progress reports after every session',
                  'Secure, cashless payments',
                  'Satisfaction guarantee'
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
                src="/photo09.jpeg" 
                alt="Tutor working with student" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">The TutorsPRO difference.</h2>
            <p className="text-muted text-lg">More than just extra lessons; it's a strategic academic advantage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
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

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-24 bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl fw-600 mb-6">Ready to accelerate learning?</h2>
          <p className="text-xl text-white/70 mb-10">Give your child the dedicated attention they deserve.</p>
          <Link href="/onboard/parent" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Find a Tutor <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
