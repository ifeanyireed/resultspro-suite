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
    <main className="min-h-screen bg-navy text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-green text-navy font-bold text-[10px] uppercase tracking-widest animate-pulse">Live Now</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Admin Hosted Rooms</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
              Live Game <span className="text-green">Lobby</span>
            </h1>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search rooms or subjects..."
              className="w-full bg-white/5 border border-white/[0.1] border-t-white/[0.15] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green/50 transition-colors"
            />
          </div>
        </div>

        {/* Exam Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar mb-8">
          <button
            onClick={() => setSelectedExam('all')}
            className={`px-6 py-3 rounded-2xl border font-bold text-sm whitespace-nowrap transition-all ${
              selectedExam === 'all' 
              ? 'bg-green border-green text-navy shadow-lg shadow-green/20' 
              : 'bg-white/5 border-white/[0.1] text-gray-400 hover:bg-white/10'
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
                ? 'bg-green border-green text-navy shadow-lg shadow-green/20' 
                : 'bg-white/5 border-white/[0.1] text-gray-400 hover:bg-white/10'
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center text-green">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Synchronous Play</h4>
              <p className="text-sm text-gray-400">Answer same questions at same time as everyone else.</p>
            </div>
          </div>
          
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-blue">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Massive Rooms</h4>
              <p className="text-sm text-gray-400">Compete with up to 500 students in a single room.</p>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-amber/20 to-transparent border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Bigger Prizes</h4>
              <p className="text-sm text-gray-400">Large pools mean the winner takes home thousands of coins.</p>
            </div>
          </div>
        </div>

        {/* Active Rooms Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Available Rooms</h3>
            <span className="text-xs text-gray-600 font-bold">{filteredRooms.length} rooms found</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-64 rounded-[32px] bg-white/5 animate-pulse" />
              ))
            ) : filteredRooms.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[32px] border border-dashed border-white/[0.1] border-t-white/[0.15]">
                <p className="text-gray-500">No live rooms available for this exam. Check back soon!</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div key={room.id} className="group relative p-8 rounded-[32px] border border-white/[0.05] border-t-white/[0.1] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-[1.2] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/5 hover:border-white/10 transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <Sword className="w-32 h-32 text-white -rotate-12" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${room.type === 'High Stakes' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green/10 text-green border border-green/20'}`}>
                          {room.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{room.id.split('-')[0]}</span>
                      </div>
                      
                      <h3 className="text-2xl font-display font-bold mb-1 group-hover:text-green transition-colors">{room.subject?.name || 'Untitled Subject'}</h3>
                      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                        <span>Hosted by</span>
                        <span className="text-gray-300 font-bold">{room.adminName}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="font-bold text-white">{room._count?.participants || 0}</span>
                          <span className="text-gray-600">/ {room.maxPlayers}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="font-bold text-white">{room.spectatorCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber">
                          <Coins className="w-4 h-4" />
                          <span className="font-black">{room.entryFee} coins</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue uppercase tracking-widest bg-blue/10 px-4 py-2 rounded-xl">
                        <Timer className="w-4 h-4" />
                        {room.status === 'pending' ? 'Waiting...' : 'Starting Soon'}
                      </div>
                      
                      <Button 
                        onClick={() => handleJoinRoom(room.id)}
                        className="flex-1 md:w-full bg-green text-navy hover:bg-green/90 rounded-2xl px-8 py-6 text-lg font-black flex gap-2"
                      >
                        JOIN <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 p-12 rounded-[40px] bg-white/[0.02] border border-white/[0.05] border-t-white/[0.1] text-center flex flex-col items-center gap-6">
          <Eye className="w-12 h-12 text-blue opacity-50" />
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white">Prefer to watch first?</h2>
          <p className="text-gray-400 max-w-lg mb-4 text-lg">Spectate active live games for free to learn from top players before jumping in.</p>
          <Button 
            variant="outline" 
            onClick={() => !user ? setIsLoginModalOpen(true) : router.push('/spectate')}
            className="rounded-2xl border-white/[0.1] border-t-white/[0.15] text-white px-10 py-6 text-lg font-bold hover:bg-white/5"
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
