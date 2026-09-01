'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Target, BookOpen } from 'lucide-react';

export default function OrientationWalkthroughPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#0B1021]">
      
      {/* Background Abstract Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-12">
          <Image src="/logo.png" alt="CoursesPRO" width={48} height={48} className="object-contain" priority />
          <h1 className="font-bold text-white text-2xl tracking-tight">CoursesPRO</h1>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`h-2 rounded-full transition-all duration-500 ${step === 1 ? 'w-12 bg-blue-500' : 'w-2 bg-blue-500/30'}`}></div>
          <div className={`h-2 rounded-full transition-all duration-500 ${step === 2 ? 'w-12 bg-blue-500' : 'w-2 bg-blue-500/30'}`}></div>
          <div className={`h-2 rounded-full transition-all duration-500 ${step === 3 ? 'w-12 bg-blue-500' : 'w-2 bg-blue-500/30'}`}></div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 w-full min-h-[480px] flex flex-col justify-between">
          
          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm mb-6 flex items-center justify-center overflow-hidden p-1">
                <img src="/avatars/mentor.jpg" alt="Mentor" className="w-full h-full rounded-xl object-cover" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=Chidi+A&background=2563EB&color=fff'} />
              </div>
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Target className="w-4 h-4" />
                <span>Your Mentor</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to the cohort, Ada.</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                "I'm Chidi, your mentor for the next 12 weeks. My goal isn't just to teach you code—it's to help you build the portfolio and confidence to get hired."
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="flex -space-x-4 mb-8">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-emerald-500 text-white flex items-center justify-center font-bold text-lg z-30">Ada</div>
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-blue-400 z-20"></div>
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-purple-400 z-10"></div>
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 z-0">+21</div>
              </div>
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Users className="w-4 h-4" />
                <span>Your Classmates</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">You are not building alone.</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                You're joining 23 other builders. You will review each other's code, debug together in the coworking rooms, and present your final projects on Demo Day.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-full max-w-xs mx-auto mb-10 flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 font-bold">1</div>
                  <span className="text-xs font-bold text-slate-900 uppercase">Learn</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-600 flex items-center justify-center font-bold">2</div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Build</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-600 flex items-center justify-center font-bold">3</div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Review</span>
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <BookOpen className="w-4 h-4" />
                <span>The Journey</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Progress is earned.</h2>
              <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                This isn't a passive video library. The next module only unlocks when you submit your project and Chidi approves it. Let's build your portfolio.
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-auto border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-slate-500 hover:text-slate-900 font-bold px-4 py-2 transition-colors"
              >
                Go Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-sm transition-all flex items-center gap-2 group"
              >
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link 
                href="/dashboard"
                className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-full shadow-sm transition-all flex items-center gap-2 group"
              >
                Enter Workspace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
