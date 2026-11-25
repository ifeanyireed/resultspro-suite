"use client";

import api from '@/lib/api';
import { IconWallet as Wallet, IconTrendingUp as TrendingUp, IconCalendar as Calendar, IconChevronRight as ChevronRight, IconArrowUpRight as ArrowUpRight, IconDownload as Download, IconHistory as History, IconCurrencyDollar as DollarSign, IconChartPie as PieChart, IconTarget as Target, IconLoader2 as Loader2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

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
    <main className="min-h-screen bg-gray-50 pb-24">
            
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <MotionRise className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 mb-2">
              Earnings <span className="text-blue">Dashboard</span>
            </h1>
            <p className="text-gray-600">Track your revenue, commissions, and upcoming payouts.</p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-green text-navy font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-sm">
             <Wallet className="w-5 h-5" /> REQUEST PAYOUT
          </button>
        </MotionRise>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
             <Loader2 className="w-12 h-12 text-blue animate-spin mb-4" />
             <p className="text-gray-900 font-bold">Loading earnings...</p>
           </div>
        ) : (
          <>
            {/* Financial Highlights */}
            <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <div className="p-8 rounded-[40px] bg-navy text-white relative overflow-hidden group shadow-xl">
                  <div className="relative z-10">
                     <div className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-2">Available for Payout</div>
                     <div className="text-5xl font-display font-black text-white mb-6">
                        ₦{earningsData?.balance?.toLocaleString() || '0'}
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-green">
                        <ArrowUpRight size={14} /> +12.5% from last month
                     </div>
                  </div>
                  <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
               </div>

               <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                     <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Pending Clearance</div>
                     <div className="text-3xl font-display font-black text-gray-900 mb-2">₦12,400</div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                     <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Earned (All Time)</div>
                     <div className="text-lg font-bold text-gray-900">
                        ₦{earningsData?.total_earned?.toLocaleString() || '0'}
                     </div>
                  </div>
               </div>

               <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6">Earnings by Subject</div>
                  <div className="space-y-4">
                     {[
                       { label: 'Mathematics', val: '65%', color: 'bg-blue' },
                       { label: 'Physics', val: '25%', color: 'bg-navy' },
                       { label: 'English', val: '10%', color: 'bg-green' },
                     ].map((s, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-gray-600">{s.label}</span>
                             <span className="text-gray-900">{s.val}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                             <div className={`h-full ${s.color} rounded-full`} style={{ width: s.val }} />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </MotionStagger>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Detailed Log */}
               <MotionRise delay={0.1} className="lg:col-span-2 space-y-8">
                  <section>
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
                           <History className="w-6 h-6 text-gray-400" /> Recent Sessions
                        </h2>
                        <button className="text-[10px] font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2 transition-colors">
                           <Download className="w-4 h-4" /> Export CSV
                        </button>
                     </div>

                     <div className="bg-white border border-gray-100 shadow-sm rounded-[40px] overflow-hidden">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-gray-100 bg-gray-50/50">
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Session / Student</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Net Earned</th>
                                 <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                 <th className="px-8 py-4 text-right"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {earningsData?.history?.map((item: any) => (
                                 <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                       <div className="text-sm font-bold text-gray-900 mb-0.5">{item.subject}</div>
                                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.student} • {item.date}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <div className="text-sm font-black text-gray-900">{item.amount}</div>
                                       <div className="text-[10px] text-red-500 font-bold tracking-tighter">-{item.fee} Platform Fee</div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                          item.status === 'Cleared' ? 'bg-green/20 text-navy' : 'bg-blue/10 text-blue'
                                       }`}>
                                          {item.status}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                       <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
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
               </MotionRise>

               {/* Sidebar */}
               <MotionRise delay={0.2} className="space-y-8">
                  <section className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                     <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Revenue Targets</h3>
                     <div className="space-y-8">
                        <div>
                           <div className="flex justify-between text-xs font-bold mb-3">
                              <span className="text-gray-500">Monthly Goal</span>
                              <span className="text-gray-900">₦200,000 / ₦300,000</span>
                           </div>
                           <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green rounded-full" style={{ width: '66%' }} />
                           </div>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                           <div className="flex items-center gap-3 text-blue font-bold text-xs mb-2">
                              <Target size={14} /> Streak Bonus
                           </div>
                           <p className="text-[10px] text-gray-600 leading-relaxed">Complete 10 more sessions this month to unlock a 5% commission discount.</p>
                        </div>
                     </div>
                  </section>

                  <section className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm">
                     <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency Report</h3>
                     <p className="text-xs text-gray-600 leading-relaxed mb-6">We take a flat 20% commission on marketplace bookings to cover hosting, payment processing, and support costs.</p>
                     <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        VIEW FEE BREAKDOWN
                     </button>
                  </section>
               </MotionRise>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
