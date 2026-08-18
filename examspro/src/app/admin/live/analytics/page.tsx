"use client";

import { 
  Users, 
  ShieldCheck,
  HelpCircle,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminLiveAnalyticsContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const options = [
    { label: "A", text: "45 degrees", count: 85, percentage: 68, isCorrect: false },
    { label: "B", text: "90 degrees", count: 24, percentage: 19, isCorrect: true },
    { label: "C", text: "180 degrees", count: 10, percentage: 8, isCorrect: false },
    { label: "D", text: "360 degrees", count: 5, percentage: 5, isCorrect: false },
  ];

  if (!roomId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-navy text-white p-8">
        <h1 className="text-2xl font-bold mb-4">No Room ID provided</h1>
      </div>
    );
  }

  return (
    <>
      <AdminHeader title={`Live Poll Analytics: ${roomId}`} />

      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto w-full no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <div className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-sm">Question 4 of 10</div>
          <Button variant="outline" className="rounded-xl font-bold text-xs gap-2 border-white/[0.1] border-t-white/[0.15] bg-white/5 text-white hover:bg-white/10 transition-colors">
            <Eye className="w-4 h-4" /> PREVIEW AS SPECTATOR
          </Button>
        </div>

        {/* Question Summary */}
        <section className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 shrink-0 border border-white/[0.05] border-t-white/[0.1]">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Question</div>
              <h2 className="text-2xl font-display font-bold text-white leading-tight">In a standard Euclidean plane, what is the sum of angles on a straight line?</h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Time Remaining</div>
              <div className="text-3xl font-display font-black text-red-500">12s</div>
            </div>
          </div>
        </section>

        {/* Poll Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-12">
             <div className="flex justify-between items-center">
               <h3 className="font-display font-bold text-white text-lg">Answer Distribution</h3>
               <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-bold text-gray-500">124 Total Responses</span>
               </div>
             </div>

             <div className="space-y-8">
               {options.map((opt) => (
                 <div key={opt.label} className="space-y-3">
                   <div className="flex justify-between items-end">
                     <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${opt.isCorrect ? 'bg-green text-navy' : 'bg-white/5 text-gray-500 border border-white/[0.05] border-t-white/[0.1]'}`}>
                         {opt.label}
                       </div>
                       <span className={`text-sm font-bold ${opt.isCorrect ? 'text-green' : 'text-white'}`}>{opt.text}</span>
                       {opt.isCorrect && <ShieldCheck className="w-4 h-4 text-green" />}
                     </div>
                     <span className="text-xs font-black text-white">{opt.count} players ({opt.percentage}%)</span>
                   </div>
                   <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                      className={`h-full transition-all duration-1000 ${opt.isCorrect ? 'bg-green shadow-[0_0_15px_rgba(0,200,83,0.3)]' : 'bg-blue-500/20'}`} 
                      style={{ width: `${opt.percentage}%` }} 
                     />
                   </div>
                 </div>
               ))}
             </div>

             <div className="pt-8 border-t border-white/5 flex gap-4">
                <Button className="flex-1 rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/[0.05] border-t-white/[0.1] font-black h-14 gap-2 transition-colors">
                  REVEAL CORRECT ANSWER
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl border-white/[0.05] border-t-white/[0.1] bg-navy text-white hover:bg-white/5 h-14 font-black transition-colors">
                  RE-POLL QUESTION
                </Button>
             </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
                <h4 className="font-display font-bold text-white">Quick Insights</h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:border-white/10 transition-colors group">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Most Common</div>
                    <div className="text-lg font-black text-white">Option A (68%)</div>
                    <div className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Incorrect Trend</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/[0.05] border-t-white/[0.1] hover:border-white/10 transition-colors group">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg. Response Time</div>
                    <div className="text-lg font-black text-white">3.8 Seconds</div>
                    <div className="text-[10px] text-green font-bold uppercase tracking-tighter">Fastest this game</div>
                  </div>
                </div>
             </div>

             <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.05] border-t-white/[0.1] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <h4 className="font-display font-bold text-white mb-6">Real-time Activity</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < 8 ? 'bg-green' : 'bg-white/10'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-4">84/124 have answered</p>
             </div>

             <div className="p-8 rounded-[40px] bg-green/10 border border-green/20 shadow-lg shadow-green-900/5">
                <div className="flex items-center gap-3 text-green mb-4">
                  <MessageSquare className="w-5 h-5" />
                  <h4 className="font-bold">Chat Buzz</h4>
                </div>
                <p className="text-xs text-green/70 leading-relaxed italic">&quot;Most users are discussing Option A in the live chat. Possible misconception identified.&quot;</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminLiveAnalytics() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-navy">
        <Loader2 className="w-10 h-10 animate-spin text-green" />
      </div>
    }>
      <AdminLiveAnalyticsContent />
    </Suspense>
  );
}
