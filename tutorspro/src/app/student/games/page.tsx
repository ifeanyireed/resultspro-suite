"use client";

import Navbar from '@/components/Navbar';
import { Gamepad2, Trophy, Users, Zap, Play, Star, Sparkles, Loader2 } from 'lucide-react';
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
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  const games = data?.games || [];
  const tournament = data?.tournament;
  const rank = data?.leaderboard_rank || "N/A";

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                   Games <span className="text-green">Hub</span>
                </h1>
                <p className="text-gray-400">Play, learn, and compete for global leaderboard spots.</p>
             </div>
             <div className="flex gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                   <Trophy className="w-5 h-5 text-amber" />
                   <div className="text-sm font-bold text-white">{rank}</div>
                </div>
             </div>
          </div>

          {/* Featured Challenge */}
          {tournament && (
            <section className="mb-12 p-8 md:p-12 rounded-[48px] bg-gradient-to-br from-green/20 via-blue/10 to-transparent border border-white/10 relative overflow-hidden group cursor-pointer">
               <Sparkles className="absolute top-12 right-12 w-32 h-32 text-green/10 animate-pulse" />
               <div className="max-w-xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green text-navy text-[10px] font-black uppercase tracking-widest mb-6">
                     Weekend Tournament
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">{tournament.title}</h2>
                  <p className="text-gray-400 mb-8 text-lg">
                     {tournament.desc}
                  </p>
                  <button className="px-8 py-4 rounded-xl bg-white text-navy font-bold text-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                     <Gamepad2 className="w-5 h-5" /> Enter Tournament
                  </button>
               </div>
            </section>
          )}

          {/* Game Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {games.length > 0 ? games.map((game: any, i: number) => (
               <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-all group">
                  <div className={`w-14 h-14 rounded-2xl ${game.color} ${game.text} flex items-center justify-center mb-6`}>
                     <Gamepad2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{game.desc}</p>
                  
                  <div className="flex items-center justify-between mb-8">
                     <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" /> {game.players}
                     </div>
                     <div className={`text-[10px] font-black ${game.text}`}>{game.xp}</div>
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-green group-hover:text-navy group-hover:border-green transition-all">
                     <Play className="w-3 h-3 fill-current" /> Play Now
                  </button>
               </div>
             )) : (
               <div className="col-span-full py-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                  <p className="text-gray-500 font-bold">No games available at the moment.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
