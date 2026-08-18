"use client";

import Navbar from '@/components/Navbar';
import { 
  Calendar, 
  Users, 
  Brain, 
  Wallet, 
  ChevronRight, 
  Play, 
  Clock, 
  Star,
  CheckCircle2,
  Trophy,
  BookOpen,
  Zap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green animate-spin" />
      </main>
    );
  }

  const upcomingClasses = data?.upcoming_classes || [];
  const recommendedTutors = data?.recommended_tutors || [];
  const stats = data?.stats || { wallet_balance: 0, xp_level: 0, xp_progress: 0 };

  return (
    <RoleGate allowedRoles={['STUDENT', 'TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Welcome back, <span className="text-green">{user?.full_name?.split(' ')[0] || 'Learner'}</span>!
              </h1>
              <p className="text-gray-400">
                {upcomingClasses.length > 0 
                  ? `You have ${upcomingClasses.length} classes scheduled for this week.` 
                  : "You have no classes scheduled for this week."}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Wallet Balance</div>
                  <div className="text-xl font-display font-bold text-white">₦{stats.wallet_balance.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Left) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Classes */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue" />
                    Upcoming Classes
                  </h2>
                  <Link href="/student/classes" className="text-sm text-green font-medium hover:underline">View Schedule</Link>
                </div>
                
                {upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingClasses.map((cls: any) => (
                      <div key={cls.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue/20 flex items-center justify-center text-blue">
                              <BookOpen className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{cls.subject}</h3>
                              <div className="text-sm text-gray-400 flex items-center gap-2">
                                <Users className="w-4 h-4" /> {cls.tutor}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end gap-2">
                            <div className="text-sm text-white font-medium flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber" /> {cls.time}
                            </div>
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{cls.duration}</div>
                          </div>
                          <div className="flex items-center">
                            <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-green text-navy font-bold flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                              <Play className="w-4 h-4 fill-current" />
                              Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No upcoming classes found</p>
                    <Link href="/student/find-tutor" className="mt-4 inline-block text-green text-sm font-bold hover:underline">Book a session now</Link>
                  </div>
                )}
              </section>

              {/* Learning Modules Quick Access */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Quizzes', icon: Brain, color: 'text-purple', bg: 'bg-purple/10', count: 'Explore Practice' },
                  { title: 'Flashcards', icon: Zap, color: 'text-amber', bg: 'bg-amber/10', count: 'Study Cards' },
                  { title: 'Assignments', icon: CheckCircle2, color: 'text-green', bg: 'bg-green/10', count: 'View Tasks' },
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.count}</div>
                  </div>
                ))}
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
              {/* Recommended Tutors */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber fill-amber" />
                    Top Tutors
                  </h2>
                </div>
                
                {recommendedTutors.length > 0 ? (
                  <div className="space-y-4">
                    {recommendedTutors.map((tutor: any) => (
                      <div key={tutor.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all">
                        <div className="flex gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue to-purple flex items-center justify-center text-white font-bold">
                            {tutor.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{tutor.name}</h4>
                            <div className="text-xs text-gray-500">{tutor.subject}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber text-sm font-bold">
                            <Star className="w-3 h-3 fill-current" /> {tutor.rating}
                            <span className="text-gray-500 font-normal ml-1">({tutor.reviews})</span>
                          </div>
                          <div className="text-white font-bold">{tutor.price}</div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No recommendations yet</p>
                  </div>
                )}

                <Link href="/student/find-tutor" className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-medium flex items-center justify-center gap-2 hover:text-white hover:bg-white/10 transition-all">
                  Browse All Tutors <ChevronRight className="w-4 h-4" />
                </Link>
              </section>

              {/* Achievement / Stats */}
              <section className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-transparent border border-white/10 relative overflow-hidden">
                 <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-green/10 -rotate-12" />
                 <h3 className="text-2xl font-display font-bold text-white mb-2">Mastery Rank</h3>
                 <div className="text-4xl font-black text-green mb-4">Level {stats.xp_level}</div>
                 <div className="w-full h-2 bg-white/10 rounded-full mb-2">
                   <div style={{ width: `${stats.xp_progress}%` }} className="h-full bg-green rounded-full shadow-[0_0_10px_rgba(0,200,83,0.5)] transition-all duration-1000" />
                 </div>
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">{stats.xp_progress}% of Level Completed</div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
