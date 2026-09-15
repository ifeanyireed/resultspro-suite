import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { 
  IconArrowRight as ArrowRight, 
  IconCircleCheckFilled as CheckCircle2, 
  IconTargetArrow as Target, 
  IconBrain as BrainCircuit, 
  IconClockHour4 as Timer, 
  IconWallet as Wallet, 
  IconShare as Share2,
  IconChartBar as ChartBar,
  IconShieldCheck as ShieldCheck,
  IconBook,
  IconPencil,
  IconRefresh
} from '@tabler/icons-react';
import Image from 'next/image';

export const metadata = {
  title: "ExamsPRO - AI-Powered ICAN Preparation",
  description: "Find your weakness before the exam does. Stop studying blind and start practising with purpose.",
};

export default function IcanLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-white -z-10 rounded-b-[100%] blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-6 border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                The Next ICAN Diet Starts Before Exam Day
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                STOP STUDYING BLIND. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  FIND YOUR WEAKNESS BEFORE ICAN DOES.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
                <strong className="text-slate-900">100 Questions ≠ 100% Prepared.</strong> ExamsPRO uses AI to reveal your preparation gaps so you stop wasting time on what you already know.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://exams.resultspro.ng/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  Start Smarter Practice Now <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#referral" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  Get Paid to Tell Others <Wallet className="w-5 h-5 text-emerald-500" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
              <div className="rounded-2xl border border-slate-200 shadow-2xl bg-white overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Mockup Top Bar */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                
                {/* Real Platform Screenshot */}
                <Image 
                  src="/ican_screenshot_1.png" 
                  alt="ExamsPRO Dashboard" 
                  width={3784} 
                  height={1730} 
                  className="w-full h-auto object-cover border-none"
                  quality={100}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. The Agitation */}
      <section className="py-24 bg-gradient-to-br from-amber-400 to-orange-500 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-amber-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-orange-600/30 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <div className="bg-white rounded-3xl p-8 w-full md:w-1/3 border border-orange-200 shadow-2xl transform hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-orange-200/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconBook className="w-8 h-8 text-orange-950" />
                </div>
                <h3 className="text-2xl font-black text-orange-950">You study.</h3>
              </div>
              <ArrowRight className="w-8 h-8 text-orange-950/40 rotate-90 md:rotate-0 shrink-0" />
              <div className="bg-white rounded-3xl p-8 w-full md:w-1/3 border border-orange-200 shadow-2xl transform hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-orange-200/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconPencil className="w-8 h-8 text-orange-950" />
                </div>
                <h3 className="text-2xl font-black text-orange-950">You practise.</h3>
              </div>
              <ArrowRight className="w-8 h-8 text-orange-950/40 rotate-90 md:rotate-0 shrink-0" />
              <div className="bg-white rounded-3xl p-8 w-full md:w-1/3 border border-orange-200 shadow-2xl transform hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 bg-orange-200/60 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconRefresh className="w-8 h-8 text-orange-950" />
                </div>
                <h3 className="text-2xl font-black text-orange-950">You revise.</h3>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-white bg-orange-950/20 inline-block px-6 py-4 md:px-8 md:py-5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
                But do you actually know where you are weak?
              </h2>
              <p className="text-xl md:text-2xl text-amber-50 font-medium leading-relaxed">
                Thousands of questions don't guarantee success. Stop preparing with hope, and start preparing with data.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Features Walkthrough */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <ScrollReveal>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">"What are your weakest ICAN topics?"</h3>
                <p className="text-lg text-slate-600 font-medium mb-6">
                  Our diagnostic engine instantly tracks your performance across every syllabus topic, showing you exactly where to focus.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Topic-level accuracy tracking</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Overall exam readiness score</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Progress bars that actually mean something</li>
                </ul>
              </ScrollReveal>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <ScrollReveal delay={0.2}>
                <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-blue-600 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  {/* Mock UI */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 h-full flex flex-col justify-end">
                    <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                       <div className="w-8 h-32 bg-white/30 rounded-t-sm"></div>
                       <div className="w-8 h-16 bg-white/30 rounded-t-sm"></div>
                       <div className="w-8 h-48 bg-white/90 rounded-t-sm relative"><div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm">92%</div></div>
                       <div className="w-8 h-24 bg-white/30 rounded-t-sm"></div>
                       <div className="w-8 h-8 bg-rose-400/90 rounded-t-sm relative"><div className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-300 font-bold text-sm">18%</div></div>
                    </div>
                    <div className="text-white font-bold text-sm uppercase tracking-wider text-center">Topic Accuracy Map</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
            <div className="w-full md:w-1/2">
              <ScrollReveal>
                <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-red-500 to-red-700 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-red-400 via-transparent to-transparent"></div>
                  <div className="h-full flex flex-col gap-4">
                    <div className="self-end max-w-[80%] bg-red-800 text-white p-4 rounded-2xl rounded-tr-sm text-sm border border-red-600 shadow-lg">
                      I don't understand why the fixed overhead volume variance is adverse here.
                    </div>
                    <div className="self-start max-w-[90%] bg-white text-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm shadow-xl relative">
                      <div className="absolute -left-2 -top-2 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center"><BrainCircuit className="w-3 h-3 text-white" /></div>
                      <p className="mb-2 font-bold">Let's break it down:</p>
                      <p>The variance is adverse because the actual volume (10,000 units) was less than the budgeted volume (12,000 units). Since fixed costs are sunk, producing less means you under-absorbed the overheads!</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            <div className="w-full md:w-1/2">
              <ScrollReveal delay={0.2}>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">"What if your practice could learn from you?"</h3>
                <p className="text-lg text-slate-600 font-medium mb-6">
                  Our AI Study Assistant is available on every question to explain complex principles the moment you get stuck.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Ask follow-up questions</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Step-by-step ICAN standard explanations</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold"><CheckCircle2 className="text-emerald-500 w-5 h-5" /> Never stay stuck on a calculation again</li>
                </ul>
              </ScrollReveal>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <ScrollReveal>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Timer className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">"The clock is moving. Is your preparation?"</h3>
                <p className="text-lg text-slate-600 font-medium mb-6">
                  Battle the clock, face the Computer Bot, or challenge other candidates in real-time to harden your exam speed.
                </p>
                <a href="https://exams.resultspro.ng/signup" className="inline-flex px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg items-center gap-2">
                  Experience Live Battles <ArrowRight className="w-4 h-4" />
                </a>
              </ScrollReveal>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <ScrollReveal delay={0.2}>
                <div className="aspect-video md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 md:p-8 shadow-2xl flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  
                  <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 relative z-10 flex items-center justify-between border-4 border-emerald-100">
                     <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg md:text-2xl mx-auto mb-1 md:mb-2 border-[3px] md:border-4 border-white shadow-md">YOU</div>
                        <div className="text-xl md:text-3xl font-black text-slate-800">450</div>
                     </div>
                     <div className="text-rose-500 font-black italic text-lg md:text-xl px-2 md:px-4 shrink-0">VS</div>
                     <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-2xl mx-auto mb-1 md:mb-2 border-[3px] md:border-4 border-white shadow-md">BOT</div>
                        <div className="text-xl md:text-3xl font-black text-slate-400">320</div>
                     </div>
                  </div>
                  <div className="w-full bg-rose-400 h-1.5 md:h-2 mt-6 md:mt-8 rounded-full relative z-10 overflow-hidden">
                     <div className="h-full bg-white w-[80%]"></div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      
      {/* Platform Showcase */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">BEAUTIFUL. FAST. SMART.</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Experience a study platform designed specifically to keep you focused and engaged for hours.</p>
            </div>
            
            <div className="rounded-2xl border border-slate-200 shadow-2xl bg-white overflow-hidden transform hover:-translate-y-2 transition-transform duration-500 max-w-5xl mx-auto">
              {/* Mockup Top Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <Image 
                src="/ican_screenshot_2.png" 
                alt="ExamsPRO Practice Mode" 
                width={1888} 
                height={864} 
                className="w-full h-auto object-cover"
                quality={100}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. The Referral Hook */}
      <section id="referral" className="py-24 bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-3/5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-100 font-bold text-[10px] uppercase tracking-widest mb-6">
                  <Wallet className="w-4 h-4" /> ExamsPRO Affiliate Program
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                  GET PAID TO TELL OTHERS. <br/><span className="text-emerald-200">(Yes, we are serious).</span>
                </h2>
                <p className="text-xl text-emerald-50 font-medium leading-relaxed mb-8">
                  Share your link and earn a massive <strong className="bg-emerald-900/40 px-2 py-1 rounded">20% commission</strong> every time a friend buys a plan.
                </p>
                <div className="bg-emerald-700/50 border border-emerald-500 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-300" /> The Catch? There isn't one.</h4>
                  <p className="text-emerald-100">Money drops directly into your wallet. Withdraw to your bank anytime. No minimums.</p>
                </div>
                <a href="https://exams.resultspro.ng/login" className="inline-flex px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-xl transition-all shadow-xl items-center gap-3">
                  Start Earning Now <ArrowRight className="w-5 h-5" />
                </a>
              </div>
              <div className="w-full md:w-2/5">
                <div className="bg-white rounded-3xl p-6 shadow-2xl text-slate-900 transform rotate-2">
                  <div className="text-center mb-6">
                    <p className="text-slate-500 font-bold text-sm uppercase mb-1">Your Wallet Balance</p>
                    <h3 className="text-5xl font-black text-emerald-600">₦24,000</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div><div><p className="text-xs font-bold">Referral Commission</p><p className="text-[10px] text-slate-400">Tola bought Full Diet Plan</p></div></div>
                      <span className="font-bold text-emerald-600">+₦3,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div><div><p className="text-xs font-bold">Referral Commission</p><p className="text-[10px] text-slate-400">Emeka bought Single Paper</p></div></div>
                      <span className="font-bold text-emerald-600">+₦3,000</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-emerald-700 text-white font-black rounded-xl flex items-center justify-center gap-2">
                    Withdraw to Bank <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">YOUR ICAN STUDY PARTNER IS NOW ON YOUR PHONE.</h2>
            <p className="text-lg text-slate-600 mb-12">Get everything you need to crush your next ICAN diet in one powerful platform.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Single Paper */}
              <ScrollReveal delay={0.1} animation="slide-right" className="h-full">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg relative flex flex-col h-full">
                  <h3 className="text-xl font-black text-slate-900 mb-2">SINGLE PAPER</h3>
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-4xl font-black text-slate-900">₦3,500</span>
                    <span className="text-slate-500 font-bold text-xs md:text-sm mb-1">/diet (6 months)</span>
                  </div>
                  <ul className="space-y-4 text-left mb-8 flex-1">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">1 Subject Access</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">Performance Diagnostics</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">Referral Program</span></li>
                  </ul>
                  <a href="https://exams.resultspro.ng/signup" className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl transition-colors text-sm">Get Started</a>
                </div>
              </ScrollReveal>

              {/* Full Diet Access (Most Popular) */}
              <ScrollReveal delay={0.2} animation="zoom-in" className="h-full">
                <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 shadow-2xl relative flex flex-col transform md:-translate-y-4 h-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>
                  <h3 className="text-2xl font-black text-blue-600 mb-2 text-center">FULL DIET ACCESS</h3>
                  <div className="flex justify-center items-end gap-1 mb-8">
                    <span className="text-5xl font-black text-slate-900">₦10,000</span>
                    <span className="text-slate-500 font-bold text-xs md:text-sm mb-1">/diet (6 months)</span>
                  </div>
                  <ul className="space-y-4 text-left mb-8 flex-1">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> <span className="text-slate-700 text-sm font-bold">All Diet Papers Access</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> <span className="text-slate-700 text-sm font-bold">AI Performance Diagnostics</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> <span className="text-slate-700 text-sm font-bold">AI Study Assistant Explanations</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> <span className="text-slate-700 text-sm font-bold">Live Battle Modes</span></li>
                  </ul>
                  <a href="https://exams.resultspro.ng/signup" className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-colors text-base text-center">Start Preparing Now</a>
                </div>
              </ScrollReveal>

              {/* Complete Level */}
              <ScrollReveal delay={0.3} animation="slide-left" className="h-full">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg relative flex flex-col h-full">
                  <h3 className="text-xl font-black text-slate-900 mb-2">COMPLETE LEVEL</h3>
                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-4xl font-black text-slate-900">₦8,500</span>
                    <span className="text-slate-500 font-bold text-xs md:text-sm mb-1">/diet (6 months)</span>
                  </div>
                  <ul className="space-y-4 text-left mb-8 flex-1">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">All Subjects in a Level</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">Performance Diagnostics</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> <span className="text-slate-600 text-sm font-medium">AI Explanations</span></li>
                  </ul>
                  <a href="https://exams.resultspro.ng/signup" className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl transition-colors text-sm">Get Started</a>
                </div>
              </ScrollReveal>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-700 to-indigo-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-black mb-6">STUDY SMARTER. PRACTISE WITH PURPOSE.</h2>
            <p className="text-xl text-slate-400 mb-10">Stop asking: "What should I do next?" Start using your performance to guide your preparation.</p>
            <a href="https://exams.resultspro.ng/signup" className="inline-flex px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/50 text-lg hover:-translate-y-1">
              Create Free Account
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
