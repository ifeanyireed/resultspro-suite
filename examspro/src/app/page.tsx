import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { ChevronRight, Coins, Target, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const categories = [
    { name: 'West African', exams: ['WAEC', 'NECO', 'GCE'], color: 'green' },
    { name: 'University Entry', exams: ['JAMB/UTME', 'Post-UTME'], color: 'blue' },
    { name: 'International', exams: ['SAT', 'ACT', 'GRE', 'GMAT'], color: 'amber' },
    { name: 'Professional', exams: ['ICAN', 'ACCA', 'CFA'], color: 'purple' },
  ];

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />

      {/* Exam Categories Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Choose Your <span className="text-blue">Target</span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Select from over 50+ localized and international examinations.
            </p>
          </div>
          <Link href="/practice" className="text-green font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all exams <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group relative p-8 rounded-2xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-4">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.exams.map((exam) => (
                  <span key={exam} className="px-3 py-1 rounded-md bg-white/5 border border-white/[0.1] border-t-white/[0.15] text-xs font-medium text-gray-300">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coin Economy Section */}
      <section className="py-20 bg-white/[0.02] border-y border-white/[0.05] border-t-white/[0.1]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Correct MCQ', reward: '+1', icon: Coins },
                { title: 'Theory (AI)', reward: '+3', icon: Brain },
                { title: '7-Day Streak', reward: '+15', icon: Target },
                { title: 'Win Battle', reward: 'Pool', icon: Trophy },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-navy/50 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center text-amber">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{item.title}</div>
                    <div className="text-xl font-display font-bold text-white">{item.reward} Coins</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              The <span className="text-amber">Coin</span> Economy
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Earn coins by answering correctly. Spend them on AI deep-dives, 
              unlocking past questions, or entering high-stakes battles.
            </p>
            <ul className="space-y-4 mb-8">
              {['No subscription required', 'Earn as you learn', 'Real-world rewards', 'Referral bonuses'].map((text) => (
                <li key={text} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green/20 flex items-center justify-center text-green text-[10px]">✓</div>
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/economy" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber text-navy font-bold hover:opacity-90 transition-opacity">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Footer CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto p-12 rounded-[40px] bg-gradient-to-br from-green/20 via-blue/10 to-transparent border border-white/10 backdrop-blur-md">
          <Users className="w-12 h-12 text-green mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Join 50,000+ Students Already Winning
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Start your journey today. Sign up for free and get 50 bonus coins.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green text-navy font-bold text-lg hover:shadow-[0_0_30px_rgba(0,200,83,0.3)] transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/>
    </svg>
  );
}
