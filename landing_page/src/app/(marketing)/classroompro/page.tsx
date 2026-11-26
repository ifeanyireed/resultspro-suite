import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import { MotionRise } from '@/components/ScrollRiseProvider';
import Link from 'next/link';
import { 
  IconDeviceLaptop, 
  IconWifiOff, 
  IconBooks, 
  IconListCheck, 
  IconChartArcs, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'ClassroomPRO | NERDC Digital Learning & Formative Assessment Hub',
  description: 'Offline-first NERDC Markdown lesson notes, AI storybooks, linked YouTube video lessons, spaced-repetition flashcards, AI-moderated CBT quizzes, and traceable score synchronization to CampusPRO.',
};

const FEATURES = [
  {
    icon: IconBooks,
    title: 'NERDC Markdown Notes, AI Stories & YouTube Videos',
    desc: 'Deliver structured NERDC weekly Markdown lesson notes, illustrated AI storybooks, and teacher-linked YouTube video lessons mapped to every topic—with zero raw video upload overhead.'
  },
  {
    icon: IconWifiOff,
    title: 'Offline-First PWA & Spaced-Repetition Flashcards',
    desc: 'Students cache lesson packages in IndexedDB/SQLite for zero-data home study and master key definitions using intelligent spaced-repetition (SRS) flashcard decks.'
  },
  {
    icon: IconListCheck,
    title: 'AI Quiz Moderation & Traceable CampusPRO Score Sync',
    desc: 'Generate NERDC-aligned CBT quizzes with AI exam moderation. Students can practice multiple times while teachers explicitly approve which official CA score syncs into CampusPRO.'
  },
  {
    icon: IconChartArcs,
    title: 'Multi-Year Topic-Gap Analytics & Remedial Loops',
    desc: 'Retain multi-year attempt history and question-level mastery telemetry, automatically receiving 1-click remedial revision packs triggered from ResultsPRO report card diagnostics.'
  }
];

export default function ClassroomProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300">
              <IconDeviceLaptop size={16} />
              <span>ResultsPro ClassroomPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              The classroom that works <span style={{ fontWeight: 700, color: 'white' }}>offline.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Synced read-only with your CampusPRO class rosters, ClassroomPRO powers daily teaching and formative assessment with NERDC Markdown lesson notes, AI storybooks, linked YouTube video lessons, spaced-repetition flashcards, and traceable CA score synchronization.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="/onboard/teacher" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: '#0D1060', fontWeight: 700, padding: '1rem 2rem', fontSize: '1rem' }}>
                Setup Classroom
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
                Bridge the digital divide permanently.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                By allowing students to consume rich educational content without requiring a constant active internet connection at home, we ensure equitable access to quality education.
              </p>
              <ul className="space-y-4">
                {[
                  'NERDC Markdown notes, AI storybooks & linked YouTube video lessons',
                  'Spaced-repetition (SRS) flashcards & offline-first PWA caching',
                  'Traceable teacher score-approval sync to CampusPRO Exam Ledger',
                  '1-click remedial revision loop connected directly to ResultsPRO'
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
                src="https://res.cloudinary.com/qsdwzejd/image/upload/v1789250545/landing_page/photo04.jpg" 
                alt="Teacher using ClassroomPRO" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Built for resilience.</h2>
            <p className="text-muted text-lg">Designed to keep learning uninterrupted.</p>
          </MotionRise>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <MotionRise key={i} delay={i * 0.08} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-6 text-amber-600">
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
          <h2 className="text-4xl fw-600 mb-6">Ready to upgrade your classroom?</h2>
          <p className="text-xl text-white/70 mb-10">Give your students the tools they need to succeed, anywhere.</p>
          <Link href="/onboard/teacher" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: '#0D1060', fontWeight: 700, padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Get Started <IconArrowRight size={20} />
          </Link>
        </MotionRise>
      </section>
    </main>
  );
}
