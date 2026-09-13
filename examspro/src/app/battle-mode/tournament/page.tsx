"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { IconTrophy as Trophy, IconUsers as Users, IconCalendar as Calendar, IconClock as Timer, IconCoins as Coins, IconChevronLeft as ChevronLeft, IconLoader2 as Loader2, IconCircleCheck as CheckCircle2, IconArrowRight as ArrowRight, IconShieldCheck as ShieldCheck, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TournamentPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [tournamentData, setTournamentData] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    fetchTournamentData();
  }, []);

  const fetchTournamentData = async () => {
    try {
      const res = await api.get('/tournaments/current');
      setTournamentData(res.data);
      
      if (res.data.tournament) {
        const rankingsRes = await api.get(`/tournaments/${res.data.tournament.id}/rankings`);
        setRankings(rankingsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch tournament data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setRegistering(true);
    try {
      await api.post(`/battles/tournament/register/${tournamentData.tournament.id}`);
      toast.success("Successfully registered! 🎉");
      fetchTournamentData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-500 font-bold">Loading Tournament...</p>
        </div>
      </main>
    );
  }

  const tournament = tournamentData?.tournament;
  const isRegistered = tournamentData?.isRegistered;

  if (!tournament) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
           <Trophy className="w-24 h-24 text-gray-800 mx-auto mb-8 opacity-20" />
           <h1 className="text-4xl font-display font-black text-gray-900 mb-4">NO ACTIVE TOURNAMENTS</h1>
           <p className="text-gray-500 mb-8 max-w-md mx-auto">Check back soon for the next weekly challenge with massive prize pools!</p>
           <Link href="/battle-mode">
             <Button variant="outline" className="rounded-full px-8 py-6 border-gray-200  text-gray-900 hover:bg-slate-100">
                <ChevronLeft className="w-5 h-5 mr-2" /> Back to Lobby
             </Button>
           </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/10 via-transparent to-blue/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
          <Link href="/battle-mode" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            BACK TO LOBBY
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
                <Timer className="w-4 h-4 animate-pulse" />
                Next Tournament Starts: {format(new Date(tournament.startTime), 'MMM d, h:mm a')}
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 mb-6 leading-none">
                {tournament.title.toUpperCase()}
              </h1>
              <p className="text-xl text-gray-500 mb-8 max-w-lg leading-relaxed">
                {tournament.description}
              </p>

              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary border border-gray-200 ">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prize Pool</div>
                    <div className="text-2xl font-display font-black text-gray-900">₦{tournament.prizePool.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-secondary border border-gray-200 ">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entry Fee</div>
                    <div className="text-2xl font-display font-black text-gray-900">{tournament.registrationFee} Coins</div>
                  </div>
                </div>
              </div>

              {isRegistered ? (
                <div className="inline-flex items-center gap-4 px-8 py-5 rounded-3xl bg-secondary/10 border border-secondary/20 text-secondary font-black text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  YOU ARE REGISTERED
                </div>
              ) : (
                <Button 
                  onClick={handleRegister}
                  disabled={registering}
                  className="px-12 py-8 rounded-[32px] bg-amber text-navy hover:bg-amber/90 font-black text-xl shadow-2xl shadow-amber/20 hover:scale-105 transition-all group"
                >
                  {registering ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      REGISTER NOW
                      <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-amber/20 blur-[120px] rounded-full" />
              <div className="relative p-12 rounded-[60px] bg-slate-100 border border-gray-200  backdrop-blur-xl">
                 <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest mb-8">
                   <ShieldCheck className="w-5 h-5" /> Tournament Rules
                 </div>
                 <ul className="space-y-6">
                   {[
                     "Highest total score over 10 consecutive matches.",
                     "Matches must be played within the tournament window.",
                     "Draws are settled by average response time.",
                     "Prizes are credited instantly after completion."
                   ].map((rule, i) => (
                     <li key={i} className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-[10px] font-black text-gray-900">
                         {i + 1}
                       </div>
                       <p className="text-gray-500 text-sm font-medium leading-relaxed">{rule}</p>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-display font-black text-gray-900 mb-2">LIVE RANKINGS</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Updated every 5 minutes
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200  text-center min-w-[120px]">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Participants</div>
              <div className="text-xl text-gray-900 font-black">{rankings.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200  text-center min-w-[120px]">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</div>
              <div className="text-xl text-secondary font-black uppercase">{tournament.status}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[40px] border border-white/5 overflow-hidden bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200  bg-white">
                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest w-24">Rank</th>
                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Player</th>
                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Matches</th>
                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankings.length > 0 ? rankings.map((row, i) => (
                <tr key={row.id} className="group hover:bg-white transition-colors">
                  <td className="px-8 py-6">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm
                      ${i === 0 ? 'bg-amber text-navy' : i === 1 ? 'bg-gray-300 text-navy' : i === 2 ? 'bg-amber/40 text-gray-900' : 'bg-slate-100 text-gray-500'}
                    `}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200  flex items-center justify-center overflow-hidden">
                        <img src={`/avatars/character${ (String(row.userId).charCodeAt(0) % 20) || 1 }.jpg`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{row.user?.name}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mastery Level 4</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-gray-500">10 / 10</td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-lg font-display font-black text-gray-900">{row.totalScore.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Points</div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="text-gray-500 italic font-medium">No registrations yet. Be the first to join!</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
