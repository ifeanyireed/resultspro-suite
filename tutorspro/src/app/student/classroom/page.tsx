import { IconVideo as Video, IconMic as Mic, IconMessageSquare as MessageSquare, IconHand as Hand, IconLayout as Layout, IconSettings as Settings, IconLogOut as LogOut, IconUsers as Users, IconShare as Share, IconMaximize as Maximize, IconPlay as Play, IconSquare as Square, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function Classroom() {
  const { user } = useAuthStore();
  const [activeTab, setActiveCategory] = useState('Chat');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await api.get('/student/classroom/active');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch classroom data");
      } finally {
        setLoading(false);
      }
    };
    fetchClassroom();
  }, []);

  if (loading) {
    return (
      <main className="h-screen bg-[#050B14] flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </main>
    );
  }

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SUPERADMIN']}>
      <main className="h-screen bg-[#050B14] flex flex-col overflow-hidden text-white">
        {/* Top Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-navy/20">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue/20 flex items-center justify-center text-blue font-bold">
                 {data?.subject?.[0] || 'C'}
              </div>
              <div>
                 <h1 className="text-sm font-bold">{data?.subject}</h1>
                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tutor: {data?.tutor?.name}</div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                 {data?.status} • {Math.floor(data?.elapsed_ms / 60000)}:15
              </div>
              <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all">
                 <Settings className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-red-700 transition-all">
                 <LogOut className="w-4 h-4" /> Leave
              </button>
           </div>
        </header>

        {/* Main Classroom Content */}
        <div className="flex-1 flex overflow-hidden">
           {/* Left Side: Video & Whiteboard */}
           <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
              {/* Whiteboard / Content Area */}
              <div className="flex-1 rounded-[32px] bg-navy/40 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center group">
                 <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5 pointer-events-none" />
                 <div className="text-center relative z-10 p-12">
                    <div className="w-20 h-20 rounded-3xl bg-green/10 flex items-center justify-center text-green mx-auto mb-6">
                       <Layout className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Collaborative Whiteboard</h2>
                    <p className="text-sm text-gray-500">Tutor is currently preparing the next slide...</p>
                 </div>
                 
                 {/* Controls for content */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Maximize className="w-5 h-5" /></button>
                    <div className="w-px h-6 bg-white/10" />
                    <button className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"><Share className="w-5 h-5" /></button>
                 </div>
              </div>

              {/* Local Video & Controls Strip */}
              <div className="h-24 flex items-center justify-between px-8 rounded-3xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-6">
                    <div className="relative">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green to-blue overflow-hidden border-2 border-green shadow-[0_0_15px_rgba(0,200,83,0.3)]">
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} className="w-full h-full object-cover" alt="You" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-navy font-black text-xl">
                               {user?.full_name?.[0] || 'U'}
                            </div>
                          )}
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green border-2 border-navy flex items-center justify-center">
                          <Mic className="w-2.5 h-2.5 text-navy" />
                       </div>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-white">{user?.full_name}</div>
                       <div className="text-[10px] text-gray-500">Network: Excellent</div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                       <Mic className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                       <Video className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                       <Hand className="w-5 h-5" />
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button className="px-6 h-12 rounded-2xl bg-green text-navy font-black text-xs hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                       SCREEN SHARE
                    </button>
                 </div>

                 <div className="hidden lg:flex items-center gap-4">
                    <div className="flex -space-x-3">
                       {data?.participants?.slice(0, 3).map((p: any, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-navy bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                             {p.name[0]}
                          </div>
                       ))}
                    </div>
                    {data?.participants?.length > 3 && (
                      <span className="text-[10px] text-gray-500 font-bold">+{data.participants.length - 3} Others</span>
                    )}
                 </div>
              </div>
           </div>

           {/* Right Side: Chat & Participants */}
           <div className="w-80 border-l border-white/5 bg-navy/10 flex flex-col">
              <div className="flex p-4 gap-2">
                 {['Chat', 'People'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveCategory(tab)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                         activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {activeTab === 'Chat' ? (
                    <>
                      <div className="flex flex-col gap-1 max-w-[85%]">
                         <div className="text-[10px] text-gray-500 font-bold ml-1">{data?.tutor?.name}</div>
                         <div className="p-3 rounded-2xl rounded-tl-none bg-blue/10 border border-blue/20 text-xs leading-relaxed">
                            Please look at the board, we are starting the exercise.
                         </div>
                      </div>
                      <div className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                         <div className="text-[10px] text-gray-500 font-bold mr-1">You</div>
                         <div className="p-3 rounded-2xl rounded-tr-none bg-green/10 border border-green/20 text-xs leading-relaxed">
                            Got it, {data?.tutor?.name?.split(' ')[0]}. Ready!
                         </div>
                      </div>
                    </>
                 ) : (
                    <div className="space-y-3">
                       {data?.participants?.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold">
                                   {p.name[0]}
                                </div>
                                <div>
                                   <div className="text-[10px] font-bold text-white">{p.name}</div>
                                   <div className="text-[8px] text-gray-500 uppercase tracking-tighter">{p.role}</div>
                                </div>
                             </div>
                             <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-green' : 'bg-gray-600'}`} />
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              <div className="p-4">
                 <div className="relative">
                    <input type="text" placeholder="Type a message..." className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-xs outline-none focus:border-green transition-all" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-green">
                       <MessageSquare className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </RoleGate>
  );
}
