import HeroAnimationWrapper from '@/components/HeroAnimationWrapper';
import Link from 'next/link';
import { 
  IconTrophy, 
  IconDeviceGamepad2, 
  IconBrain, 
  IconChartLine, 
  IconSwords, 
  IconCheck, 
  IconArrowRight 
} from '@tabler/icons-react';

export const metadata = {
  title: 'ExamsPRO | ResultsPro Edu Suite',
  description: 'Gamified CBT preparation for WAEC, JAMB, and external exams. Practice with live multiplayer battles and AI assistance.',
};

const FEATURES = [
  {
    icon: IconDeviceGamepad2,
    title: 'Gamified Learning Loop',
    desc: 'Students earn coins, build streaks, and unlock achievements. We transform tedious exam preparation into an engaging, addictive loop.'
  },
  {
    icon: IconSwords,
    title: 'Live Multiplayer Battles',
    desc: 'Compete in real-time against students nationwide. Our matchmaking engine pairs students of similar skill levels for head-to-head CBT challenges.'
  },
  {
    icon: IconBrain,
    title: 'AI Study Assistant',
    desc: 'Get instant, step-by-step explanations for missed questions. Our AI tutor acts as a 24/7 personal guide for complex topics.'
  },
  {
    icon: IconChartLine,
    title: 'Weakness Identification',
    desc: 'Our engine tracks granular performance data across subjects, automatically generating personalized study paths to patch knowledge gaps.'
  }
];

export default function ExamsProPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '8rem' }}>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-nets relative z-10">
          <HeroAnimationWrapper>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm fw-600 mb-6 backdrop-blur-sm text-blue-300">
              <IconTrophy size={16} />
              <span>ResultsPro ExamsPRO</span>
            </div>
            <h1 className="fw-300 tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Exam prep, engineered like a <span style={{ fontWeight: 700, color: 'white' }}>video game.</span>
            </h1>
            <p className="text-body-lg text-white/70 mt-6 max-w-2xl">
              Traditional rote learning is failing modern students. ExamsPRO simulates the exact CBT environment for WAEC and JAMB while injecting extreme engagement through leaderboards, live battles, and AI tutoring.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link href="https://exams.resultspro.ng" className="btn w-full sm:w-auto" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }}>
                Launch ExamsPRO
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
                Build extreme readiness for high-stakes exams.
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                By removing the anxiety of the CBT interface and making practice genuinely fun, students dramatically increase their study hours and perform at their absolute peak on exam day.
              </p>
              <ul className="space-y-4">
                {[
                  'Extensive WAEC & JAMB past question bank',
                  'Simulated exam environment',
                  'Global leaderboards & weekly prizes',
                  'Performance analytics for schools & parents'
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
                src="/photo03.jpeg" 
                alt="Students using ExamsPRO" 
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
            <h2 className="text-4xl fw-600 text-navy mb-4 tracking-tight">The ultimate practice engine.</h2>
            <p className="text-muted text-lg">Designed specifically for the competitive modern student.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-nets-border hover:shadow-card-lg transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6 text-purple-600">
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
          <h2 className="text-4xl fw-600 mb-6">Ready to dominate your exams?</h2>
          <p className="text-xl text-white/70 mb-10">Join thousands of students turning their study time into winning streaks.</p>
          <Link href="https://exams.resultspro.ng" className="btn inline-flex items-center gap-2" style={{ backgroundColor: 'var(--color-nets-red)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            Start Practicing <IconArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
