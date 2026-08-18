"use client";

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { IconChevronRight as ChevronRight, IconBrain as Brain, IconUsers as Users, IconTarget as Target, IconTrophy as Trophy, IconSparkles as Sparkles, IconShieldCheck as ShieldCheck, IconZap as Zap, IconStar as Star, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get('/public/home');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch home data");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const personas = data?.personas || [
    { name: 'Student', role: 'Learn & Grow', icon: Brain, color: 'text-green', bg: 'bg-green/10', desc: 'Access lessons, practice, and track progress.', href: '/student/dashboard' },
    { name: 'Parent', role: 'Monitor & Support', icon: Users, color: 'text-blue', bg: 'bg-blue/10', desc: 'Transparent visibility into progress and billing.', href: '/parent/dashboard' },
    { name: 'Tutor', role: 'Teach & Earn', icon: Target, color: 'text-amber', bg: 'bg-amber/10', desc: 'Complete workspace for planning and teaching.', href: '/tutor/dashboard' },
    { name: 'School', role: 'Manage & Scale', icon: Trophy, color: 'text-purple', bg: 'bg-purple/10', desc: 'Multi-tenant SaaS for school-wide tutoring.', href: '/school/dashboard' },
  ];

  const featuredTutors = data?.featured_tutors || [];

  const getPersonaIcon = (name: string) => {
    switch (name) {
      case 'Student': return Brain;
      case 'Parent': return Users;
      case 'Tutor': return Target;
      case 'School': return Trophy;
      default: return Brain;
    }
  };

  const getPersonaColors = (name: string) => {
    switch (name) {
      case 'Student': return { color: 'text-green', bg: 'bg-green/10' };
      case 'Parent': return { color: 'text-blue', bg: 'bg-blue/10' };
      case 'Tutor': return { color: 'text-amber', bg: 'bg-amber/10' };
      case 'School': return { color: 'text-purple', bg: 'bg-purple/10' };
      default: return { color: 'text-green', bg: 'bg-green/10' };
    }
  };

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />
      <Hero />

      {/* Personas Section */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            A Solution for <span className="text-green">Everyone</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our platform provides role-specific experiences tailored to the unique needs of every learner and educator.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona: any, i: number) => {
            const Icon = getPersonaIcon(persona.name);
            const { color, bg } = getPersonaColors(persona.name);
            return (
              <Link href={persona.href} key={i} className="group relative p-8 rounded-3xl border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-1">{persona.name}</h3>
                <div className={`text-sm ${color} font-bold uppercase tracking-widest mb-4`}>{persona.role}</div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {persona.desc}
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                  ENTER PORTAL <ChevronRight className="w-4 h-4 text-green" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tutors Section */}
      {!loading && featuredTutors.length > 0 && (
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
                Learn from the <span className="text-amber">Best</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Our featured tutors are top-rated experts vetted for academic excellence and teaching ability.
              </p>
            </div>
            <Link href="/tutors" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              Browse All Tutors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTutors.map((tutor: any) => (
              <div key={tutor.id} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={tutor.avatar || `https://i.pravatar.cc/150?u=${tutor.id}`} 
                    className="w-16 h-16 rounded-2xl object-cover" 
                    alt={tutor.name}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
                    <div className="flex items-center gap-1 text-amber text-xs font-bold">
                       <Star className="w-3 h-3 fill-current" /> {tutor.rating}
                    </div>
                  </div>
                </div>
                <Link href="/signup" className="w-full py-4 rounded-2xl bg-amber text-navy font-black text-xs text-center block hover:bg-amber/90 transition-all">
                   BOOK A SESSION
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Modules Section */}
      <section className="py-24 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-xs font-bold text-blue mb-6 uppercase tracking-tighter">
              <Sparkles className="w-3 h-3" />
              Modular Core Architecture
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              Powerful Tools <br />
              <span className="text-blue">Built to Scale</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              TutorsPro is built as a modular system so that live tutoring, recorded content, 
              assessments, and school management can all work together without forcing every customer into the same workflow.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                { text: 'Live Classroom Engine', icon: Zap },
                { text: 'Assessment & Analytics', icon: Brain },
                { text: 'Tutor Marketplace', icon: Users },
                { text: 'Parent Insight Portal', icon: ShieldCheck },
                { text: 'School SaaS Suite', icon: Trophy },
                { text: 'Payments & Wallet', icon: Sparkles },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-green group-hover:bg-green/20 transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-md relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-green/20 via-blue/20 to-amber/20 blur-3xl opacity-30 -z-10" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-[32px] bg-white/[0.03] border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue/20 flex items-center justify-center text-blue">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-white">Live</div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Classes</div>
                  </div>
                </div>
                <div className="aspect-[4/5] rounded-[32px] bg-white/[0.03] border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green/20 flex items-center justify-center text-green">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-white">AI</div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Insights</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-[32px] bg-white/[0.03] border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center text-amber">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-white">Expert</div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Network</div>
                  </div>
                </div>
                <div className="aspect-square rounded-[32px] bg-white/[0.03] border border-white/10 p-8 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center text-purple">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-white">SaaS</div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School SaaS Section */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 blur-[100px] -z-10" />
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Transform Your School <br />
              <span className="text-purple">Into a Tutoring Hub</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Onboard your own teachers, manage classes, and monitor school-wide progress 
              with our dedicated school SaaS suite. White-label options available.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schools" className="px-8 py-4 rounded-2xl bg-white text-navy font-bold hover:bg-gray-200 transition-colors">
                Explore School Plans
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
                Book a Demo
              </Link>
            </div>
          </div>
          <div className="flex-1 lg:max-w-sm">
            <div className="space-y-4">
              {[
                { title: 'Isolated Data', desc: 'Secure tenant-level data isolation.' },
                { title: 'Custom Branding', desc: 'Add your school logo and colors.' },
                { title: 'Teacher Manager', desc: 'Invite and manage your own staff.' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <div className="text-white font-bold mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
