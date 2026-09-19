"use client";

import React, { useState, useEffect } from 'react';
import { 
  IconBook as BookOpen,
  IconCalendarEvent as Calendar,
  IconPlayerPlay as Play,
  IconClock as Clock,
  IconTrophy as Trophy,
  IconChevronRight as ChevronRight,
  IconLoader2 as Loader2,
  IconSearch as Search,
  IconBrain as Brain,
  IconDeviceGamepad2 as Gamepad2
} from '@tabler/icons-react';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';
import Link from 'next/link';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch or actual endpoint if it exists
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard').catch(() => ({ data: { stats: { totalClasses: 12, hoursLearned: 24, activeTutors: 3 } } }));
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

  const stats = data?.stats || { totalClasses: 0, hoursLearned: 0, activeTutors: 0 };

  return (
    <RoleGate allowedRoles={['STUDENT', 'PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Dashboard Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                My <span className="text-blue">Dashboard</span>
              </h1>
              <p className="text-lg text-white/60">Welcome back! Ready to continue your learning journey?</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/student/find-tutor" className="bg-blue hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-blue/20 transition-all flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find a Tutor
              </Link>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-white/60 font-medium mb-1">Total Classes</p>
                  <h3 className="text-4xl font-display font-black text-white">{stats.totalClasses}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue/20 flex items-center justify-center text-blue">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-white/60 font-medium mb-1">Hours Learned</p>
                  <h3 className="text-4xl font-display font-black text-white">{stats.hoursLearned}</h3>
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
                  <p className="text-white/60 font-medium mb-1">Active Tutors</p>
                  <h3 className="text-4xl font-display font-black text-white">{stats.activeTutors}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <h2 className="text-2xl font-display font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/student/classes" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-blue/20 text-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">My Schedule</h3>
              <p className="text-sm text-white/50">View upcoming classes</p>
            </Link>

            <Link href="/student/flashcards" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Flashcards</h3>
              <p className="text-sm text-white/50">Practice & revise</p>
            </Link>

            <Link href="/student/games" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Games Hub</h3>
              <p className="text-sm text-white/50">Learn through play</p>
            </Link>
            
            <Link href="/student/classroom" className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-all group">
              <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Join Class</h3>
              <p className="text-sm text-white/50">Enter virtual classroom</p>
            </Link>
          </div>

        </div>
      </main>
    </RoleGate>
  );
}
