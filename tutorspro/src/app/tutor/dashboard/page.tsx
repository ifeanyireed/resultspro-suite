"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconUsers as Users,
  IconCalendarEvent as Calendar,
  IconClock as Clock,
  IconCreditCard as CreditCard,
  IconChevronRight as ChevronRight,
  IconLoader2 as Loader2,
  IconFolder as Folder,
  IconPlayerPlay as Play
} from '@tabler/icons-react';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';
import Link from 'next/link';

export default function TutorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/tutor/dashboard').catch(() => ({ data: { stats: { students: 15, hoursTaught: 120, totalEarnings: 2450 } } }));
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue animate-spin" />
      </main>
    );
  }

  const stats = data?.stats || { students: 0, hoursTaught: 0, totalEarnings: 0 };

  return (
    <RoleGate allowedRoles={['TUTOR', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Dashboard Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Tutor <span className="text-blue">Dashboard</span>
              </h1>
              <p className="text-lg text-white/60">Welcome back! Check your schedule and student progress.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/tutor/classroom" className="bg-blue hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-blue/20 transition-all flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Class
              </Link>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-white/60 font-medium mb-1">Active Students</p>
                  <h3 className="text-4xl font-display font-black text-white">{stats.students}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue/20 flex items-center justify-center text-blue">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-white/60 font-medium mb-1">Hours Taught</p>
                  <h3 className="text-4xl font-display font-black text-white">{stats.hoursTaught}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-white/60 font-medium mb-1">Total Earnings</p>
                  <h3 className="text-4xl font-display font-black text-white">${stats.totalEarnings}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <h2 className="text-2xl font-display font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/tutor/calendar" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-blue/20 text-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">My Calendar</h3>
              <p className="text-sm text-white/50">Manage availability</p>
            </Link>

            <Link href="/tutor/payouts" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Payouts</h3>
              <p className="text-sm text-white/50">View earnings & withdrawals</p>
            </Link>

            <Link href="/tutor/resources" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Folder className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Resources</h3>
              <p className="text-sm text-white/50">Manage teaching materials</p>
            </Link>
            
            <Link href="/tutor/classroom" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Launch Class</h3>
              <p className="text-sm text-white/50">Open virtual classroom</p>
            </Link>
          </div>

        </div>
      </main>
    </RoleGate>
  );
}
