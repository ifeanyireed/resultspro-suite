"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconUsers as Users, IconCoins as Coins, IconTrophy as Trophy, IconClock as Timer, IconChevronRight as ChevronRight, IconSword as Sword, IconSearch as Search, IconBolt as Zap, IconEye as Eye, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import LoginPromptModal from '@/components/LoginPromptModal';

export default function LiveGameLobby() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, examsRes, settingsRes] = await Promise.all([
          api.get('/live/active'),
          api.get('/exams?battleReady=true'),
          api.get('/public/settings').catch(() => ({ data: {} }))
        ]);

        if (settingsRes.data && settingsRes.data['live_games_enabled'] === 'false') {
          router.push('/dashboard');
          return;
        }

        setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
        
        // Flatten categorized exams if necessary
        const rawExams = Array.isArray(examsRes.data) ? examsRes.data : [];
        const flatExams = rawExams.length > 0 && rawExams[0].exams 
          ? rawExams.flatMap((cat: any) => cat.exams || [])
          : rawExams;

        setExams(Array.isArray(flatExams) ? flatExams : []);
      } catch (error) {
        console.error('Error fetching live lobby data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleJoinRoom = (roomId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/live/waiting?roomId=${roomId}`);
  };

  const filteredRooms = rooms.filter(room => {
    if (selectedExam === 'all') return true;
    return room.subject?.examId?.toString() === selectedExam || room.subject?.exam?.id?.toString() === selectedExam;
  });

  return (
    <main className="min-h-screen bg-light text-navy">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest animate-pulse">Live Now</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-muted text-xs font-bold uppercase tracking-widest">Admin Hosted Rooms</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
              Live Game Lobby
            </h1>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search rooms or subjects..."
              className="w-full bg-white border border-nets-border shadow-sm rounded-2xl py-4 pl-12 pr-4 text-navy placeholder:text-gray-400 focus:outline-none focus:border-blue/50 transition-colors"
            />
          </div>
        </div>

        {/* Exam Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar mb-8">
          <button
            onClick={() => setSelectedExam('all')}
            className={`px-6 py-3 rounded-2xl border font-bold text-sm whitespace-nowrap transition-all ${
              selectedExam === 'all' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue/20' 
              : 'bg-white border-nets-border shadow-sm text-gray-600 hover:bg-slate-50'
            }`}
          >
            All Exams
          </button>
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id.toString())}
              className={`px-6 py-3 rounded-2xl border font-bold text-sm whitespace-nowrap transition-all ${
                selectedExam === exam.id.toString() 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue/20' 
                : 'bg-white border-nets-border shadow-sm text-gray-600 hover:bg-slate-50'
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Synchronous Play</h4>
              <p className="text-sm text-white/80">Answer same questions at same time as everyone else.</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-red-500 to-red-900 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Massive Rooms</h4>
              <p className="text-sm text-white/80">Compete with up to 500 students in a single room.</p>
            </div>
          </div>

          <div className="relative overflow-hidden p-8 rounded-[40px] shadow-lg flex flex-col gap-4 bg-gradient-to-br from-[#146ef5] to-[#0a2e70] text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Bigger Prizes</h4>
              <p className="text-sm text-white/80">Large pools mean the winner takes home thousands of coins.</p>
            </div>
          </div>
        </div>

        {/* Active Rooms Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Available Rooms</h3>
            <span className="text-xs text-gray-600 font-bold">{filteredRooms.length} rooms found</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-64 rounded-[32px] bg-slate-200 animate-pulse" />
              ))
            ) : filteredRooms.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white shadow-sm rounded-[32px] border border-dashed border-nets-border">
                <p className="text-gray-500">No live rooms available for this exam. Check back soon!</p>
              </div>
            ) : (
              filteredRooms.map((room, cardIdx) => (
                <div key={room.id} className={`block group relative p-8 rounded-[1.5rem] shadow-sm hover:-translate-y-1 transition-transform h-full overflow-hidden bg-gradient-to-br ${cardIdx % 2 === 0 ? 'from-[#146ef5] to-[#0a2e70]' : 'from-red-500 to-red-900'}`}>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60 pointer-events-none"></div>
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full filter blur-[3rem] opacity-20 pointer-events-none"></div>
                  
                  <div className="flex flex-col h-full relative z-10 justify-center min-h-[160px]">
                    <div className="mt-auto pt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${room.type === 'High Stakes' ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' : 'bg-blue/20 text-blue border border-blue/30'}`}>
                          {room.type}
                        </span>
                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{room.id.split('-')[0]}</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-white mb-2 leading-tight">
                        {room.subject?.name || 'Untitled Subject'}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span className="font-bold text-white">{room._count?.participants || 0}</span> / {room.maxPlayers}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/30" />
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span className="font-bold text-white">{room.spectatorCount}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/30" />
                        <div className="flex items-center gap-1.5 text-[#FFD700]">
                          <Coins className="w-4 h-4" />
                          <span className="font-bold">{room.entryFee} coins</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <Button 
                        onClick={() => handleJoinRoom(room.id)}
                        className="bg-white/20 text-white hover:bg-white/30 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10"
                      >
                        JOIN ROOM <ArrowRight className="w-3 h-3" />
                      </Button>
                      
                      {room.status === 'pending' ? (
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Waiting</span>
                      ) : (
                        <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest border border-white/10">Starting Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 p-12 rounded-[40px] bg-white shadow-sm border border-nets-border text-center flex flex-col items-center gap-6">
          <Eye className="w-12 h-12 text-blue opacity-50" />
          <h2 className="text-2xl md:text-4xl font-display font-bold text-navy">Prefer to watch first?</h2>
          <p className="text-gray-500 max-w-lg mb-4 text-lg">Spectate active live games for free to learn from top players before jumping in.</p>
          <Button 
            variant="outline" 
            onClick={() => !user ? setIsLoginModalOpen(true) : router.push('/spectate')}
            className="rounded-2xl border-none bg-gradient-to-r from-red-500 to-red-800 text-white px-10 py-6 text-lg font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-red-500/20"
          >
            Open Spectator Lobby
          </Button>
        </div>
      </div>

      <Footer />

      <LoginPromptModal 
        show={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </main>
  );
}
