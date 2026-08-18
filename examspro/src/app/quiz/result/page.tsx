"use client";

import Navbar from '@/components/Navbar';
import { 
  Trophy, 
  Coins, 
  ChevronRight, 
  RotateCcw, 
  Share2,
  CheckCircle2,
  XCircle,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function QuizResultPage() {
  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 pt-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-green/10 flex items-center justify-center text-green mx-auto mb-6 relative">
            <Trophy className="w-12 h-12" />
            <div className="absolute inset-0 rounded-full border-2 border-green/20 animate-ping" />
          </div>
          <h1 className="text-4xl font-display font-black text-white mb-2 uppercase italic tracking-tighter">
            QUIZ <span className="text-green">COMPLETED!</span>
          </h1>
          <p className="text-gray-500 font-medium">You did an amazing job. Keep the momentum going!</p>
        </div>

        {/* Score Card */}
        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Star className="w-32 h-32 text-white" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div className="text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Score</div>
              <div className="text-3xl font-display font-black text-white">18/20</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-3xl font-display font-black text-blue">90%</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Coins Earned</div>
              <div className="text-3xl font-display font-black text-amber flex items-center justify-center gap-1">
                <Coins className="w-6 h-6" />
                25
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time Taken</div>
              <div className="text-3xl font-display font-black text-purple">12:45</div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-3xl bg-green/5 border border-green/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green/20 flex items-center justify-center text-green">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">+15 Streak Bonus</div>
                <div className="text-xs text-gray-500">You&apos;ve hit a 7-day study streak!</div>
              </div>
            </div>
            <div className="text-xl font-black text-green">+15</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green" />
              Strong Areas
            </h3>
            <div className="space-y-3">
              {['Reflection Law', 'Specular Reflection', 'Mirrors'].map(t => (
                <div key={t} className="flex items-center justify-between p-3 rounded-xl bg-green/5 text-xs font-bold text-green border border-green/10">
                  {t}
                  <span>100%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Needs Review
            </h3>
            <div className="space-y-3">
              {['Refractive Index', 'Lens Formula'].map(t => (
                <div key={t} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 text-xs font-bold text-red-500 border border-red-500/10">
                  {t}
                  <span>45%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button className="flex-1 py-8 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </Button>
            <Button variant="outline" className="px-8 py-8 rounded-2xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          
          <Link href="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full py-8 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 font-bold text-lg flex items-center justify-center gap-2">
              Back to Dashboard
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Upsell / CTA */}
        <div className="mt-16 p-8 rounded-[40px] bg-gradient-to-r from-blue/20 to-purple/20 border border-white/10 text-center relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-2xl font-display font-bold text-white mb-2">Want to master these topics?</h3>
          <p className="text-gray-400 mb-6">Our AI Tutor can create a personalized study plan based on your results.</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue text-white font-bold">
            Start AI Review
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
