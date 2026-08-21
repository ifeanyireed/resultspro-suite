"use client";

import Navbar from '@/components/Navbar';
import { IconCalendar as Calendar, IconUsers as Users, IconWallet as Wallet, IconChevronRight as ChevronRight, IconPlay as Play, IconClock as Clock, IconStar as Star, IconCircleCheck as CheckCircle2, IconLayoutDashboard as LayoutDashboard, IconArrowUpRight as ArrowUpRight, IconPlus as Plus, IconLoader2 as Loader2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function TutorDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/tutor/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch tutor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber animate-spin" />
      </main>
    );
  }

  const upcomingSessions = data?.upcoming_sessions || [];
  const pendingRequests = data?.pending_requests || [];
  const stats = data?.stats || { total_earnings: 0, hours_taught: 0, avg_rating: 0, teaching_score: 0 };

  return (
    <RoleGate allowedRoles={['TUTOR', 'SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Tutor <span className="text-amber">Workspace</span>
              </h1>
              <p className="text-gray-400">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Tutor'}. 
                {upcomingSessions.length > 0 ? ` You have ${upcomingSessions.length} sessions today.` : " No sessions scheduled for today."}
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all">
                <Plus className="w-5 h-5" /> Set Availability
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main (Left) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Total Earnings', value: `₦${stats.total_earnings.toLocaleString()}`, icon: Wallet, color: 'text-green', bg: 'bg-green/10' },
                  { label: 'Hours Taught', value: `${stats.hours_taught}h`, icon: Clock, color: 'text-blue', bg: 'bg-blue/10' },
                  { label: 'Avg Rating', value: stats.avg_rating.toString(), icon: Star, color: 'text-amber', bg: 'bg-amber/10' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                     <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                        <stat.icon className="w-5 h-5" />
                     </div>
                     <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                     <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Upcoming Sessions */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue" />
                    Today&apos;s Sessions
                  </h2>
                  <Link href="/tutor/calendar" className="text-sm text-amber font-medium hover:underline">Full Calendar</Link>
                </div>
                
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session: any) => (
                      <div key={session.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber/20 flex items-center justify-center text-amber">
                              <Users className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{session.subject}</h3>
                              <div className="text-sm text-gray-400 flex items-center gap-2">
                                Student: {session.student}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end gap-2 text-right">
                            <div className="text-sm text-white font-medium flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber" /> {session.time}
                            </div>
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{session.duration}</div>
                          </div>
                          <div className="flex items-center">
                            <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2">
                              <Play className="w-4 h-4 fill-current" />
                              Start Class
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No sessions scheduled for today</p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
              {/* Pending Requests */}
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-green" />
                  New Requests
                </h2>
                
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((req: any) => (
                      <div key={req.id} className="p-5 rounded-3xl bg-white/5 border border-white/10">
                        <div className="font-bold text-white mb-1">{req.student}</div>
                        <div className="text-sm text-gray-400 mb-4">{req.subject} • {req.time}</div>
                        <div className="flex gap-2">
                           <button className="flex-1 py-2 rounded-xl bg-green/20 text-green font-bold text-xs hover:bg-green/30 transition-all">Accept</button>
                           <button className="flex-1 py-2 rounded-xl bg-white/5 text-gray-500 font-bold text-xs hover:bg-white/10 transition-all">Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No pending requests</p>
                  </div>
                )}
              </section>

              {/* Teaching Progress */}
              <section className="p-8 rounded-[40px] bg-gradient-to-br from-blue/20 to-transparent border border-white/10 relative overflow-hidden">
                 <ArrowUpRight className="absolute -top-4 -right-4 w-32 h-32 text-blue/10" />
                 <h3 className="text-xl font-display font-bold text-white mb-2">Teaching Score</h3>
                 <div className="text-4xl font-black text-blue mb-4">{stats.teaching_score}%</div>
                 <p className="text-sm text-gray-500 leading-relaxed">
                   Your score is based on student reviews, punctuality, and material quality. Keep it up!
                 </p>
              </section>

              {/* Quick Actions */}
              <section className="space-y-3">
                 <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                   <LayoutDashboard className="w-5 h-5 text-amber" /> Lesson Planner
                 </button>
                 <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                   <CheckCircle2 className="w-5 h-5 text-green" /> Mark Assignments
                 </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}

function Bell({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}
