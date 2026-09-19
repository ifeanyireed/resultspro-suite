"use client";

import { IconDeviceGamepad2 as Gamepad2, IconTrophy as Trophy, IconUsers as Users, IconBolt as Zap, IconPlayerPlay as Play, IconStar as Star, IconSparkles as Sparkles, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { RoleGate } from '@/components/RoleGate';

export default function GamesHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/student/games');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch games data");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#146ef5] animate-spin" />
      </main>
    );
  }

  const games = data?.games || [];
  const tournament = data?.tournament;
  const rank = data?.leaderboard_rank || "N/A";

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-gray-50 pb-24">
                
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
             <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                   Games Hub
                </h1>
                <p className="text-sm text-gray-500">Play, learn, and compete with other students.</p>
             </div>
             
             <div className="flex gap-4">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm">
                   <Trophy className="w-5 h-5 text-amber-500" />
                   <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">Global Rank</div>
                      <div className="font-bold text-gray-900 leading-tight">#{rank}</div>
                   </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm">
                   <Zap className="w-5 h-5 text-[#146ef5]" />
                   <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">Energy</div>
                      <div className="font-bold text-gray-900 leading-tight">100/100</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             {/* Main Featured Game */}
             <div className="lg:col-span-2 rounded-[1.5rem] bg-gradient-to-br from-[#146ef5] to-[#0a2e70] p-8 md:p-12 relative overflow-hidden flex flex-col justify-end min-h-[360px] shadow-sm group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full filter blur-[4rem] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                
                <div className="relative z-10 w-full max-w-md">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-4">
                      <Star className="w-3.5 h-3.5 fill-current" /> Featured Game
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Math Blaster Elite</h2>
                   <p className="text-white/80 mb-6 text-sm">Defend the galaxy by solving quick arithmetic equations. The faster you solve, the higher your score!</p>
                   <button className="bg-white text-[#146ef5] hover:bg-gray-50 px-8 py-3.5 rounded-full font-bold shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 w-full md:w-auto">
                      <Play className="w-5 h-5 fill-current" /> Play Now
                   </button>
                </div>
             </div>

             {/* Live Tournament */}
             <div className="rounded-[1.5rem] bg-white border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-normal text-gray-900">Live Tournament</h3>
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                   </div>
                   
                   <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                      <Trophy className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-semibold text-gray-900 mb-1">Weekly Spelling Bee</h4>
                   <p className="text-sm text-gray-500 mb-6">Join 450+ other students competing for the top spot on the leaderboard this week.</p>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Prize Pool</span>
                      <span className="font-bold text-amber-500 flex items-center gap-1"><Sparkles className="w-4 h-4" /> 5,000 XP</span>
                   </div>
                   <div className="flex items-center justify-between text-sm pb-4 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Time Left</span>
                      <span className="font-semibold text-gray-900">2d 14h</span>
                   </div>
                   <button className="w-full bg-[#146ef5] hover:bg-[#105bd1] text-white py-3 rounded-full font-semibold transition-all">
                      Join Tournament
                   </button>
                </div>
             </div>
          </div>

          {/* Game Library */}
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-normal text-gray-900">All Games</h3>
             <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium">All</button>
                <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">Math</button>
                <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">Science</button>
                <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">Language</button>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {games.length > 0 ? games.map((game: any) => (
                <div key={game.id} className="rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                   <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {/* Placeholder for game image */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                         <Gamepad2 className="w-12 h-12" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <button className="w-12 h-12 rounded-full bg-[#146ef5] text-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                            <Play className="w-5 h-5 fill-current" />
                         </button>
                      </div>
                   </div>
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-semibold text-gray-900">{game.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{game.description}</p>
                      <div className="flex items-center gap-2">
                         <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                            {game.category}
                         </span>
                      </div>
                   </div>
                </div>
             )) : (
                <div className="col-span-full py-12 rounded-[1.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center bg-white text-gray-500">
                   <Gamepad2 className="w-12 h-12 mb-4 text-gray-300" />
                   <p className="font-medium text-sm">No games available right now</p>
                </div>
             )}
          </div>

        </div>
      </main>
    </RoleGate>
  );
}
