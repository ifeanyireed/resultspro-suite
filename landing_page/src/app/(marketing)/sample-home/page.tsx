import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  DocumentCheckIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

export default function SampleHomepage() {
  return (
    // dashboard-page resets the global text colors, bg-white covers the global sky background
    <div className="dashboard-page min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* 
        Isolated Navbar just for the sample page. 
        It has its own styling independent of the main app.
      */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Simulated Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ResultsPRO <span className="text-[#0EA5E9]">NG</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-[#0EA5E9] transition-colors">Platform</Link>
            <Link href="#solutions" className="hover:text-[#0EA5E9] transition-colors">Solutions</Link>
            <Link href="#testimonials" className="hover:text-[#0EA5E9] transition-colors">Stories</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/onboard" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95">
              Launch Campus
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0EA5E9] text-sm font-medium mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5E9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EA5E9]"></span>
            </span>
            ResultsPRO 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            The Digital Foundation for <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]">
              Modern African Schools.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From admission to graduation, ResultsPRO provides the comprehensive infrastructure needed to scale excellence and track student progress with AI-powered intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#0EA5E9] text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-[#0284C7] transition-all hover:scale-105 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <PlayCircleIcon className="w-6 h-6 text-slate-400" /> Watch Demo
            </button>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Trusted by 500+ Top Schools</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Simulated Logos */}
              <div className="text-xl font-bold font-serif">Harvard Int'l</div>
              <div className="text-xl font-bold font-mono">EXCEL ACADEMY</div>
              <div className="text-xl font-bold font-sans tracking-tight">Greenwood</div>
              <div className="text-xl font-bold italic">Lighthouse</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run a world-class institution.</h2>
            <p className="text-slate-600 text-lg">Four powerful modules. One seamless digital campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Item 1 - Large */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <ChartBarIcon className="w-6 h-6 text-[#0EA5E9]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">ResultsPRO Engine</h3>
                <p className="text-slate-600 max-w-md">Reduce result processing time to absolute zero. Generate AI-powered performance insights and monetize end-of-term delivery at scale.</p>
              </div>
              <div className="mt-8 relative h-48 md:h-auto md:absolute md:right-0 md:bottom-0 md:w-1/2 md:h-[80%] translate-y-8 md:translate-y-12 group-hover:translate-y-4 transition-transform duration-500">
                <div className="w-full h-full bg-slate-100 rounded-tl-xl border-t border-l border-slate-200 shadow-2xl p-4 overflow-hidden">
                  {/* Mock UI */}
                  <div className="w-full h-4 bg-slate-200 rounded-full mb-3 w-1/3"></div>
                  <div className="w-full h-24 bg-white rounded-lg shadow-sm mb-3 flex items-end p-2 gap-2">
                    <div className="w-1/6 bg-blue-400 h-[40%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-blue-500 h-[60%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-[#0EA5E9] h-[80%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-blue-600 h-[100%] rounded-t-sm"></div>
                  </div>
                  <div className="w-full h-4 bg-slate-200 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Bento Item 2 - Tall */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <AcademicCapIcon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ExamsPRO</h3>
              <p className="text-slate-600 mb-6">Gamify external exam preparation with an advanced CBT engine and real-time readiness tracking.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircleIcon className="w-5 h-5 text-emerald-500"/> JAMB & WAEC ready</li>
                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircleIcon className="w-5 h-5 text-emerald-500"/> Performance tracking</li>
                <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircleIcon className="w-5 h-5 text-emerald-500"/> Borderless competition</li>
              </ul>
            </div>

            {/* Bento Item 3 - Square */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <DocumentCheckIcon className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ClassroomPRO</h3>
              <p className="text-slate-600 text-sm">Provide structured resources and offline-first digital classrooms for continuous learning.</p>
            </div>

            {/* Bento Item 4 - Wide */}
            <div className="md:col-span-2 bg-[#0C4A6E] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden text-white">
              <div className="relative z-10 md:w-2/3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-6">
                  New Product
                </div>
                <h3 className="text-3xl font-bold mb-4">TutorsPRO</h3>
                <p className="text-blue-100 mb-8 max-w-md">Connect students with vetted, top-rated, curriculum-aligned tuition. Perfect for academic support with real-time collaboration tools.</p>
                <button className="px-6 py-3 bg-white text-[#0C4A6E] rounded-full font-bold hover:bg-blue-50 transition-colors">
                  Explore Network
                </button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 md:opacity-20 translate-x-1/4 translate-y-1/4">
                <UserGroupIcon className="w-96 h-96" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Don't just take our word for it.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 text-left border border-slate-100">
              <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-700 italic mb-6">"ResultsPRO literally changed how we operate. Result processing that used to take 3 weeks now happens automatically in under 5 minutes."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">EA</div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Ezekiel Adebayo</div>
                  <div className="text-slate-500 text-xs">Principal, Excel Academy</div>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 text-left border border-slate-100">
              <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-700 italic mb-6">"The parents love the digital dashboard. Having access to ClassroomPRO and ExamsPRO in one place is incredible for student retention."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600">SJ</div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Sarah Johnson</div>
                  <div className="text-slate-500 text-xs">Director, Lighthouse Sch.</div>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="p-8 rounded-2xl bg-[#0EA5E9] text-left text-white shadow-xl shadow-blue-500/20 transform md:-translate-y-4">
              <div className="flex gap-1 text-yellow-300 mb-4">★★★★★</div>
              <p className="text-blue-50 italic mb-6">"As an agency agent, selling ResultsPRO is the easiest pitch I've ever made. Schools instantly see the value. Best tech platform in Africa."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-white">CO</div>
                <div>
                  <div className="font-bold text-white text-sm">Chinedu Okeke</div>
                  <div className="text-blue-100 text-xs">Distributor Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 bg-slate-900 text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to prepare Africa for takeover?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">Join hundreds of forward-thinking schools scaling excellence through our digital campus infrastructure.</p>
        <button className="px-8 py-4 bg-[#0EA5E9] text-white rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-[#0284C7] transition-all hover:scale-105">
          Launch Your Digital Campus Now
        </button>
      </section>

    </div>
  );
}
