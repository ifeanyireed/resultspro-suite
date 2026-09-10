import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { 
  IconPuzzle, 
  IconCode, 
  IconTrophy, 
  IconBuildingCommunity, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'PuzzlePRO | ResultsPro Edu Suite',
  description: 'Learn to code with 636 coding games for kids in HTML, CSS, JavaScript, and Python. Master tech skills through fun gamified adventures!',
};

const FEATURES = [
  {
    icon: IconCode,
    title: '636 Coding Games',
    desc: 'Take students from basic logic with Scratch Blocks all the way to advanced HTML, CSS, JavaScript, and Python through immersive coding worlds.'
  },
  {
    icon: IconBuildingCommunity,
    title: 'Educator Portal',
    desc: 'Manage school campuses, organize classes, and assign specific coding labs tailored to Grade 5, Robotics, or STEM curriculums.'
  },
  {
    icon: IconPuzzle,
    title: 'Passwordless Access',
    desc: 'No complicated logins for young learners. Generate and copy instant 8-digit access codes for frictionless student onboarding.'
  },
  {
    icon: IconTrophy,
    title: 'XP Progress Tracking',
    desc: 'Gamified learning at its best. Monitor student coding milestones and total XP automatically directly from the teacher dashboard.'
  }
];

export default function PuzzleProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-orange-300">
              <IconPuzzle size={16} />
              <span>ResultsPro PuzzlePRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Inspiring the next generation of <span style={{ fontWeight: 700, color: 'white' }}>young coders.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Turn screen time into skill time. PuzzlePRO offers 636 coding games for kids in HTML, CSS, JavaScript, and Python, fully equipped with a powerful Educator Portal for schools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="https://www.learn2earnhq.com/schools" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Visit PuzzlePRO
              </Link>
              <Link href="#features" className="btn btn-outline-white w-full sm:w-auto text-center" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="section-py bg-white border-b border-nets-border">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl fw-600 text-navy mb-6 leading-tight">
                A complete computer science curriculum in a box.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                We remove the technical hurdles of teaching kids to code. With zero installation required, students jump straight into browser-based learning environments while teachers effortlessly track progress.
              </p>
              <ul className="space-y-4">
                {[
                  'Progressive difficulty scaling',
                  'Support for multiple campuses/hubs',
                  'Frictionless 8-digit access codes',
                  'Comprehensive XP & milestone tracking'
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
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-orange-50 flex items-center justify-center">
              <IconPuzzle size={120} className="text-orange-200" />
              {/* Optional: <img src="/puzzlepro.jpeg" alt="PuzzlePro" className="absolute inset-0 w-full h-full object-cover" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="section-py bg-light">
        <div className="container-nets">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="overline-dark mb-4">Core Capabilities</div>
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">Gamified STEM education.</h2>
            <p className="text-muted text-lg">Everything you need to successfully launch coding in your school.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 text-orange-600">
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
          <h2 className="text-4xl fw-600 mb-6">Ready to empower your students?</h2>
          <p className="text-xl text-white/70 mb-10">Discover why schools trust PuzzlePRO to deliver engaging coding curriculum.</p>
          <Link href="https://www.learn2earnhq.com/schools" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Learn More on PuzzlePRO <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
