"use client";

import { useState, useEffect } from 'react';
import { IconMic as Mic, IconMicOff as MicOff, IconVideo as Video, IconVideoOff as VideoOff, IconMonitor as Monitor, IconSettings as Settings, IconMessageSquare as MessageSquare, IconUsers as Users, IconHand as Hand, IconLayout as Layout, IconMoreVertical as MoreVertical, IconLogOut as LogOut, IconPenTool as PenTool, IconBrain as Brain, IconShare2 as Share2, IconChevronRight as ChevronRight, IconShieldAlert as ShieldAlert, IconCircleDot as CircleDot } from '@tabler/icons-react';
import Link from 'next/link';

export default function TutorClassroom() {
  const [mounted, setMounted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-screen bg-[#050505] flex flex-col overflow-hidden text-white font-sans">
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-navy/20 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center font-black text-navy">T</div>
              <span className="text-lg font-display font-black tracking-tighter">TutorsPRO <span className="text-gray-500 font-medium">LIVE</span></span>
           </div>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <CircleDot className="w-3 h-3 animate-pulse" /> REC 01:24:05
              </div>
              <h2 className="text-sm font-bold text-gray-400">Advanced Calculus • Grade 12</h2>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-blue" />
              <span className="text-xs font-bold">12 Students Online</span>
           </div>
           <button className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all flex items-center gap-2">
              <LogOut className="w-4 h-4" /> END SESSION
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar - Tools (Left) */}
         <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-navy/30 shrink-0">
            {[
              { icon: Layout, label: 'Board', active: true },
              { icon: PenTool, label: 'Draw' },
              { icon: Monitor, label: 'Share' },
              { icon: Brain, label: 'Polls' },
              { icon: Share2, label: 'Assets' },
            ].map((tool, i) => (
              <button key={i} className={`p-4 rounded-2xl transition-all group relative ${tool.active ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                 <tool.icon className="w-6 h-6" />
                 <span className="absolute left-full ml-4 px-2 py-1 rounded bg-white text-navy text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {tool.label}
                 </span>
              </button>
            ))}
         </div>

         {/* Center - Workspace */}
         <div className="flex-1 relative bg-navy/40 p-4 overflow-hidden">
            <div className="w-full h-full rounded-[40px] border border-white/5 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
               {/* Main Presentation / Whiteboard Surface */}
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <Monitor className="w-24 h-24 text-gray-800 mb-8" />
                  <h3 className="text-3xl font-display font-bold text-gray-700">Presentation Surface</h3>
                  <p className="text-gray-800 max-w-sm mt-4 uppercase tracking-[0.2em] font-black text-xs">Share your screen or start the whiteboard to begin teaching.</p>
               </div>
               
               {/* Floating Tutor Video */}
               <div className="absolute top-6 right-6 w-64 aspect-video rounded-3xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden group">
                  <div className="w-full h-full flex items-center justify-center">
                     <VideoOff className="w-10 h-10 text-gray-800" />
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold border border-white/10">
                     YOU (HOST)
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar - Interactions (Right) */}
         <div className="w-96 border-l border-white/5 flex flex-col bg-navy/30 shrink-0">
            <div className="flex p-2 gap-2 border-b border-white/5">
               {['chat', 'participants', 'qa'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeTab === tab ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               {activeTab === 'chat' && (
                 <div className="space-y-6">
                    {[
                      { user: 'Chidera A.', text: 'Can you explain the derivative of ln(x) again?', time: '10:45 AM' },
                      { user: 'Tobi A.', text: 'I have a question about the chain rule.', time: '10:46 AM' },
                    ].map((msg, i) => (
                      <div key={i} className="space-y-1">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-blue uppercase tracking-widest">{msg.user}</span>
                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{msg.time}</span>
                         </div>
                         <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 text-sm text-gray-300">
                            {msg.text}
                         </div>
                      </div>
                    ))}
                 </div>
               )}
               
               {activeTab === 'participants' && (
                 <div className="space-y-2">
                    {[
                      { name: 'Chidera Anozie', mic: false, video: false, hand: true },
                      { name: 'Tobi Anozie', mic: true, video: false, hand: false },
                      { name: 'Boluwatife S.', mic: false, video: false, hand: false },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white font-bold text-xs">
                               {p.name[0]}
                            </div>
                            <div>
                               <div className="text-sm font-bold">{p.name}</div>
                               <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Student</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            {p.hand && <Hand className="w-4 h-4 text-amber" />}
                            <button className={`p-2 rounded-lg ${p.mic ? 'text-green' : 'text-gray-700'} hover:bg-white/5`}><Mic size={16} /></button>
                            <button className="p-2 rounded-lg text-gray-700 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-navy/50 border-t border-white/5">
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-blue/50 transition-all">
                  <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent py-2 text-sm text-white focus:outline-none" />
                  <button className="w-10 h-10 rounded-xl bg-blue text-white flex items-center justify-center hover:scale-105 transition-all">
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 px-12 border-t border-white/5 flex items-center justify-between bg-[#08080c] shrink-0">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
            >
               {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
            >
               {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
         </div>

         <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[28px] border border-white/10">
            <button className="px-8 py-3 rounded-[20px] bg-green-600 text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green/20">
               SHARE SCREEN
            </button>
            <button className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all">
               <Hand size={24} />
            </button>
            <button className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all">
               <Settings size={24} />
            </button>
         </div>

         <div className="flex items-center gap-3">
            <div className="text-right">
               <div className="text-xs font-bold text-white">Security Panel</div>
               <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Host Mode</div>
            </div>
            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-amber hover:bg-white/10 transition-all">
               <ShieldAlert size={24} />
            </button>
         </div>
      </div>
    </main>
  );
}
