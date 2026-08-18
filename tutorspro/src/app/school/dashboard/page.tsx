"use client";

import Navbar from '@/components/Navbar';
import { 
  Users, 
  BookOpen, 
  Settings, 
  ChevronRight, 
  BarChart3, 
  ShieldCheck,
  Building2,
  UserPlus,
  ArrowRight,
  GraduationCap,
  FileText,
  CreditCard,
  Palette,
  Bell,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function SchoolDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/school/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch school dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple animate-spin" />
      </main>
    );
  }

  const stats = data?.stats || { total_students: 0, total_teachers: 0, live_classes: 0, avg_attendance: 0 };
  const activeClassrooms = data?.active_classrooms || [];
  const recentActivity = data?.recent_activity || [];
  const subscription = data?.subscription || { plan: "N/A", next_billing: "N/A", teacher_seats: 0, max_seats: 0 };

  const quickLinks = [
    { label: 'Manage Teachers', icon: Users, href: '/school/teachers', color: 'text-purple', bg: 'bg-purple/10' },
    { label: 'Class Setup', icon: BookOpen, href: '/school/classes', color: 'text-blue', bg: 'bg-blue/10' },
    { label: 'Student Import', icon: GraduationCap, href: '/school/students', color: 'text-green', bg: 'bg-green/10' },
    { label: 'Analytics', icon: BarChart3, href: '/school/analytics', color: 'text-amber', bg: 'bg-amber/10' },
    { label: 'Reports', icon: FileText, href: '/school/reports', color: 'text-pink', bg: 'bg-pink/10' },
    { label: 'Subscription', icon: CreditCard, href: '/school/subscription', color: 'text-cyan', bg: 'bg-cyan/10' },
    { label: 'Branding', icon: Palette, href: '/school/branding', color: 'text-indigo', bg: 'bg-indigo/10' },
    { label: 'Notifications', icon: Bell, href: '/school/notifications', color: 'text-rose', bg: 'bg-rose/10' },
  ];

  return (
    <RoleGate allowedRoles={['SCHOOL_ADMIN', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-purple/20 border border-purple/30 flex items-center justify-center text-purple">
                 <Building2 className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                  School <span className="text-purple">Admin</span>
                </h1>
                <p className="text-gray-400">{data?.school_name || "School Portal"} • {stats.total_teachers} Active Teachers</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/school/branding" className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                <Settings className="w-5 h-5 text-gray-400" /> Branding
              </Link>
              <Link href="/school/teachers" className="px-6 py-3 rounded-2xl bg-purple text-white font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <UserPlus className="w-5 h-5" /> Onboard Teacher
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Students', value: stats.total_students.toString(), icon: Users, color: 'text-blue', bg: 'bg-blue/10' },
              { label: 'Total Teachers', value: stats.total_teachers.toString(), icon: ShieldCheck, color: 'text-green', bg: 'bg-green/10' },
              { label: 'Live Classes', value: stats.live_classes.toString(), icon: BookOpen, color: 'text-amber', bg: 'bg-amber/10' },
              { label: 'Avg Attendance', value: `${stats.avg_attendance}%`, icon: BarChart3, color: 'text-purple', bg: 'bg-purple/10' },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                 <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                 <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Access Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold text-white mb-8">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">{link.label}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 group-hover:text-purple transition-colors">
                    Open Module <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Operations (Left) */}
            <div className="lg:col-span-2 space-y-8">
              <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-display font-bold text-white">Active Classrooms</h2>
                   <Link href="/school/classes" className="text-sm text-purple font-medium hover:underline">Manage All</Link>
                 </div>
                 
                 {activeClassrooms.length > 0 ? (
                   <div className="space-y-4">
                     {activeClassrooms.map((cls: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                              <BookOpen className="w-5 h-5" />
                           </div>
                           <div>
                             <div className="text-white font-bold">{cls.name}</div>
                             <div className="text-xs text-gray-500">Teacher: {cls.teacher} • {cls.students} Students</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              cls.status === 'Live' ? 'bg-green/10 text-green' : cls.status === 'Ended' ? 'bg-white/5 text-gray-500' : 'bg-blue/10 text-blue'
                            }`}>
                              {cls.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 text-sm italic">No active classrooms at the moment.</p>
                 )}
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
               {/* Subscription status */}
               <section className="p-8 rounded-[40px] bg-gradient-to-br from-purple/20 to-transparent border border-purple/20">
                  <h3 className="text-xl font-display font-bold text-white mb-2">{subscription.plan}</h3>
                  <p className="text-sm text-gray-400 mb-6">Your next billing cycle is on {subscription.next_billing}.</p>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
                     <div className="text-xs text-gray-500">Teacher Seats</div>
                     <div className="text-sm font-bold text-white">{subscription.teacher_seats} / {subscription.max_seats}</div>
                  </div>
                  <Link href="/school/subscription" className="w-full py-4 rounded-2xl bg-purple text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                     Manage Subscription <ArrowRight className="w-4 h-4" />
                  </Link>
               </section>

               {/* Recent Activity */}
               <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display font-bold text-white mb-6">Recent Activity</h3>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-6">
                      {recentActivity.map((act: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                            {/* In a real app, icon would be dynamic */}
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">{act.action}</div>
                            <div className="text-xs text-gray-500">{act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs italic">No recent activity logged.</p>
                  )}
               </section>
            </div>
          </div>
        </div>
      </main>
    </RoleGate>
  );
}
