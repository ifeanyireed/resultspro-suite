"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Eye, 
  Users, 
  Play, 
  Search, 
  ChevronRight, 
  Monitor, 
  ShieldCheck,
  Globe,
  Clock,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';

export default function SpectatorLobby() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/live/active');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading && rooms.length === 0) {
    return (
      <main className="min-h-screen bg-navy text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Live Feed...</p>
      </main>
    );
  }

  const featuredRoom = rooms.length > 0 ? rooms[0] : null;

  return (
    <main className="min-h-screen bg-navy text-white pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" /> Live Feed
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">No Coins Required to Watch</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
              Spectator <span className="text-blue">Browser</span>
            </h1>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search live matches..."
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="py-40 text-center bg-white/[0.02] rounded-[40px] border border-dashed border-white/[0.1] border-t-white/[0.15] flex flex-col items-center gap-6">
             <Monitor className="w-16 h-16 text-gray-700" />
             <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Arena is Quiet</h3>
                <p className="text-gray-500 max-w-sm">No live games are currently active. Check back later when admins host a championship.</p>
             </div>
          </div>
        ) : (
          <>
            {/* Featured Live Match */}
            {featuredRoom && (
              <div className="relative p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-blue/20 via-blue/5 to-transparent border border-white/10 overflow-hidden mb-12 group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                  <Monitor className="w-64 h-64 text-blue" />
                </div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-2 text-blue font-black text-xs uppercase tracking-widest mb-6">
                      <Zap className="w-4 h-4 fill-current" /> Most Watched Right Now
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
                      {featuredRoom.subject?.name || featuredRoom.title}
                    </h2>
                    <div className="flex items-center gap-8 mb-10">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-bold uppercase mb-1">Spectators</span>
                        <span className="text-2xl font-display font-black text-blue">{featuredRoom.spectatorCount.toLocaleString()}</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-bold uppercase mb-1">Status</span>
                        <span className="text-2xl font-display font-black text-white capitalize">{featuredRoom.status}</span>
                      </div>
                    </div>
                    <Link href={`/spectate/room?roomId=${featuredRoom.id}`}>
                      <Button className="bg-blue text-white hover:bg-blue/90 rounded-2xl px-12 py-8 text-xl font-black flex gap-3 shadow-[0_0_30px_rgba(21,101,192,0.3)]">
                        <Play className="w-6 h-6 fill-current" /> WATCH LIVE
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="hidden lg:grid grid-cols-2 gap-4 opacity-50">
                     {/* Mock of the play screen grid */}
                     {Array.from({ length: 4 }).map((_, i) => (
                       <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] h-32" />
                     ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Matches */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(1).map((game) => (
                <div key={game.id} className="p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/[0.1] border-t-white/[0.15] flex items-center justify-center text-blue">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${game.type === 'High Stakes' ? 'bg-red-500/10 text-red-500' : 'bg-green/10 text-green'}`}>
                      {game.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">{game.subject?.name || game.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">{game.id.split('-')[0]} • Official</p>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Users className="w-3.5 h-3.5" /> {game._count?.participants || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue">
                        <Eye className="w-3.5 h-3.5" /> {game.spectatorCount}
                      </div>
                    </div>
                    
                    <Link href={`/spectate/room?roomId=${game.id}`}>
                      <Button variant="ghost" className="p-2 text-blue hover:text-white hover:bg-blue/10 rounded-xl font-black text-xs uppercase tracking-widest flex gap-1">
                        Watch <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
