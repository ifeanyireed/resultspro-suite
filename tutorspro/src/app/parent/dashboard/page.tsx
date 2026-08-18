"use client";

import Navbar from '@/components/Navbar';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Wallet, 
  ChevronRight, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleGate } from '@/components/RoleGate';
import api from '@/lib/api';

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/parent/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch parent dashboard:', err);
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

  const children = data?.children || [];
  const recentAlerts = data?.recent_alerts || [];
  const upcomingWeek = data?.upcoming_week || [];
  const nextPayment = data?.next_payment || { amount: 0, due_date: "" };

  return (
    <RoleGate allowedRoles={['PARENT', 'SUPERADMIN']}>
      <main className="min-h-screen bg-navy pb-24">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
                Parent <span className="text-blue">Portal</span>
              </h1>
              <p className="text-gray-400">Managing progress for {children.length} children.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/parent/billing" className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all">
                <Wallet className="w-5 h-5 text-amber" />
                <div className="text-left">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Billing Status</div>
                  <div className="text-sm font-bold text-white">{data?.billing_status || "Checking..."}</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Children Cards (Left) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                   <Users className="w-6 h-6 text-green" />
                   Your Children
                 </h2>
                 <button className="text-sm text-blue font-medium hover:underline">+ Link New Child</button>
              </div>
              
              {children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child: any) => (
                    <div key={child.id} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <TrendingUp className="w-24 h-24 text-blue" />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green/20 to-blue/20 flex items-center justify-center text-white text-2xl font-black">
                          {child.name[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{child.name}</h3>
                          <div className="text-sm text-gray-500">{child.grade}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-navy/50 border border-white/5">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Attendance</div>
                          <div className="text-lg font-display font-bold text-white">{child.attendance}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-navy/50 border border-white/5">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Avg. Score</div>
                          <div className="text-lg font-display font-bold text-green">{child.avgScore}</div>
                        </div>
                      </div>

                      <Link href={`/parent/children/${child.id}`} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                        View Full Report <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 rounded-[40px] bg-white/5 border border-dashed border-white/10 text-center">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">No children linked to this account</p>
                   <button className="px-8 py-3 rounded-2xl bg-blue text-white font-bold hover:opacity-90 transition-all">Link a Child</button>
                </div>
              )}

              {/* Recent Activity / Schedule */}
              <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <h3 className="text-xl font-display font-bold text-white mb-6">Upcoming This Week</h3>
                 {upcomingWeek.length > 0 ? (
                   <div className="space-y-4">
                     {upcomingWeek.map((item: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold text-xs">{item.child[0]}</div>
                           <div>
                             <div className="text-white font-bold text-sm">{item.subject}</div>
                             <div className="text-[10px] text-gray-500">with {item.tutor}</div>
                           </div>
                         </div>
                         <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
                           <Clock className="w-3 h-3" /> {item.time}
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 text-sm italic">No sessions scheduled for your children this week.</p>
                 )}
              </section>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">
              {/* Real-time Alerts */}
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-amber" />
                  Live Alerts
                </h2>
                {recentAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {recentAlerts.map((alert: any) => (
                      <div key={alert.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
                        <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          alert.type === 'success' ? 'bg-green/10 text-green' : 'bg-red/10 text-red-500'
                        }`}>
                          {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm text-gray-200 leading-relaxed mb-1">{alert.message}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/5 text-center">
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">No new alerts</p>
                  </div>
                )}
              </section>

              {/* Quick Actions */}
              <section className="space-y-3">
                 <button className="w-full py-4 rounded-2xl bg-blue text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                   <MessageSquare className="w-5 h-5" /> Message Support
                 </button>
                 <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                   <Calendar className="w-5 h-5 text-green" /> Reschedule Session
                 </button>
              </section>

              {/* Payment Summary */}
              <section className="p-8 rounded-[40px] bg-gradient-to-br from-amber/20 to-transparent border border-white/10">
                 <h3 className="text-xl font-display font-bold text-white mb-4">Next Payment</h3>
                 <div className="text-3xl font-black text-white mb-1">₦{nextPayment.amount.toLocaleString()}</div>
                 <div className="text-sm text-gray-400 mb-6">Due on {nextPayment.due_date || "N/A"}</div>
                 <button className="w-full py-3 rounded-xl bg-amber text-navy font-bold hover:opacity-90 transition-all">
                   Pay Now
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
