"use client";

import { Button } from '@/components/ui/button';
import { 
  Coins, 
  Sparkles,
  ArrowLeft,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ExplanationPage() {
  return (
    <main className="min-h-screen bg-navy text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5 bg-navy/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/quiz" className="p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Explanation</div>
            <div className="text-sm font-bold text-green">Correct Answer (+1 Coin)</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20">
          <Coins className="w-4 h-4 text-amber" />
          <span className="text-sm font-bold text-amber">1,251</span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        {/* Question Recap */}
        <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1]">
          <div className="flex items-center gap-2 mb-3 text-gray-500">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Question Recap</span>
          </div>
          <p className="text-lg font-medium text-gray-300">
            Which of the following best describes the phenomenon of &quot;Reflection&quot; in physics?
          </p>
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-green/10 border border-green/20">
            <div className="w-6 h-6 rounded-md bg-green text-navy flex items-center justify-center font-bold text-xs">B</div>
            <p className="text-sm font-bold text-green">The bouncing back of light when it strikes a polished surface.</p>
          </div>
        </div>

        {/* AI Explanation Content */}
        <div className="mb-12 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-display font-bold">Standard Explanation</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Core Concept",
                description: "Reflection occurs when light rays bounce off a surface rather than being absorbed or passing through (refraction)."
              },
              {
                step: 2,
                title: "The Law of Reflection",
                description: "According to physics, the angle of incidence is always equal to the angle of reflection (θi = θr).",
                highlight: true
              },
              {
                step: 3,
                title: "Surface Quality",
                description: "Smooth, polished surfaces (like mirrors) produce regular reflection, while rough surfaces produce diffuse reflection."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-sm font-bold text-gray-500">
                  {item.step}
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${item.highlight ? 'text-blue' : 'text-white'}`}>{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-blue/5 border border-blue/10 border-dashed">
            <div className="flex items-center gap-2 mb-2 text-blue">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Key Terms</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Incident Ray', 'Reflected Ray', 'Normal', 'Specular Reflection'].map(term => (
                <span key={term} className="px-3 py-1 rounded-lg bg-blue/10 text-xs font-medium text-blue border border-blue/20">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/quiz" className="flex-1">
            <Button variant="outline" className="w-full py-8 rounded-2xl border-white/[0.1] border-t-white/[0.15] text-white hover:bg-white/5 font-bold text-lg">
              Got it
            </Button>
          </Link>
          
          <Button className="flex-[1.5] py-8 rounded-2xl bg-green text-navy hover:bg-green/90 font-bold text-lg flex items-center justify-center gap-3 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <Sparkles className="w-6 h-6" />
            <span>Deep-Dive Explanation</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-navy/20 ml-2">
              <Coins className="w-4 h-4" />
              <span className="text-xs">3</span>
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
}
