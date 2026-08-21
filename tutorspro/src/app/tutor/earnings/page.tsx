"use client";

import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { IconWallet as Wallet, IconTrendingUp as TrendingUp, IconCalendar as Calendar, IconChevronRight as ChevronRight, IconArrowUpRight as ArrowUpRight, IconDownload as Download, IconHistory as History, IconDollarSign as DollarSign, IconPieChart as PieChart, IconTarget as Target, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TutorEarnings() {
  const [mounted, setMounted] = useState(false);
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const res = await api.get('/tutor/earnings');
      setEarningsData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-2">
              Earnings <span className="text-green">Dashboard</span>
            </h1>
            <p className="text-gray-400">Track your revenue, commissions, and upcoming payouts.</p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green/20">
             <Wallet className="w-5 h-5" /> REQUEST PAYOUT
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-green animate-spin mb-4" />
             <p className="text-white font-bold">Loading earnings...</p>
           </div>
        ) : (
          <>
            {/* Financial Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <div className="p-8 rounded-[40px] bg-gradient-to-br from-green/20 to-blue/10 border border-white/10 relative overflow-hidden group">
                  <div className="relative z-10">
                     <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Available for Payout</div>
                     <div className="text-5xl font-display font-black text-white mb-6">
                        ₦{earningsData?.balance?.toLocaleString() || '0'}
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-green">
                        <ArrowUpRight size={14} /> +12.5% from last month
                     </div>
                  </div>
                  <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
               </div>

               <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                     <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Pending Clearance</div>
                     <div className="text-3xl font-display font-black text-white mb-2">₦12,400</div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                     <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Total Earned (All Time)</div>
                     <div className="text-lg font-bold text-white">
                        ₦{earningsData?.total_earned?.toLocaleString() || '0'}
                     </div>
                  </div>
               </div>

               <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6">Earnings by Subject</div>
                  <div className="space-y-4">
                     {[
                       { label: 'Mathematics', val: '65%', color: 'bg-blue' },
                       { label: 'Physics', val: '25%', color: 'bg-purple' },
                       { label: 'English', val: '10%', color: 'bg-green' },
                     ].map((s, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-gray-400">{s.label}</span>
                             <span className="text-white">{s.val}</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full ${s.color} rounded-full`} style={{ width: s.val }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Detailed Log */}
               <div className="lg:col-span-2 space-y-8">
                  <section>
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                           <History className="w-6 h-6 text-gray-500" /> Recent Sessions
                        </h2>
                        <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                           <Download className="w-4 h-4" /> Export CSV
                        </button>
                     </div>

                     <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-white/5 bg-white/[0.02]">
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Session / Student</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Net Earned</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                                 <th className="px-8 py-4 text-right"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {earningsData?.history?.map((item: any) => (
                                 <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                       <div className="text-sm font-bold text-white mb-0.5">{item.subject}</div>
                                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.student} • {item.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <div className="text-sm font-black text-white">{item.amount}</div>
                                       <div className="text-[10px] text-red-400 font-bold tracking-tighter">-{item.fee} Platform Fee</div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                          item.status === 'Cleared' ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                                       }`}>
                                          {item.status}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                       <ChevronRight size={14} className="text-gray-700 group-hover:text-white transition-colors" />
                                    </td>
                                 </tr>
                              ))}
                              {!earningsData?.history?.length && (
                                <tr>
                                   <td colSpan={4} className="px-8 py-10 text-center text-gray-500 text-sm font-bold">
                                      No recent sessions found.
                                   </td>
                                </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </section>
               </div>

               {/* Sidebar */}
               <div className="space-y-8">
                  <section className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                     <h3 className="text-xl font-display font-bold text-white mb-6">Revenue Targets</h3>
                     <div className="space-y-8">
                        <div>
                           <div className="flex justify-between text-xs font-bold mb-3">
                              <span className="text-gray-500">Monthly Goal</span>
                              <span className="text-white">₦200,000 / ₦300,000</span>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-green rounded-full shadow-[0_0_10px_rgba(0,200,83,0.3)]" style={{ width: '66%' }} />
                           </div>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                           <div className="flex items-center gap-3 text-amber font-bold text-xs mb-2">
                              <Target size={14} /> Streak Bonus
                           </div>
                           <p className="text-[10px] text-gray-500 leading-relaxed">Complete 10 more sessions this month to unlock a 5% commission discount.</p>
                        </div>
                     </div>
                  </section>

                  <section className="p-8 rounded-[40px] bg-gradient-to-br from-purple/20 to-transparent border border-white/10">
                     <h3 className="text-lg font-bold text-white mb-2">Transparency Report</h3>
                     <p className="text-xs text-gray-500 leading-relaxed mb-6">We take a flat 20% commission on marketplace bookings to cover hosting, payment processing, and support costs.</p>
                     <button className="w-full py-3 rounded-xl border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                        VIEW FEE BREAKDOWN
                     </button>
                  </section>
               </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
