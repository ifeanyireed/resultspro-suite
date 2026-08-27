"use client";

import { IconTrendingUp as TrendingUp, IconCurrencyDollar as DollarSign, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconCalendar as Calendar, IconDownload as Download, IconCreditCard as CreditCard, IconSchool as School, IconWallet as Wallet, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const revenueStats = [
  { label: "Total Revenue", value: "₦142.8M", trend: "+12.5%", positive: true, icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Monthly Recurring", value: "₦12.4M", trend: "+8.2%", positive: true, icon: <TrendingUp className="w-5 h-5" />, color: "text-[#146ef5]", bg: "bg-blue-50" },
  { label: "Active Subscriptions", value: "112", trend: "+5", positive: true, icon: <School className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Pending Payouts", value: "₦1.2M", trend: "-2.1%", positive: false, icon: <Wallet className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
];

const transactionsData = [
  { id: "TX-9012", school: "Lekki British School", plan: "Premium (Annual)", amount: "₦4,500,000", date: "2 hours ago", status: "Successful" },
  { id: "TX-9011", school: "Greenwood Hall", plan: "Standard (Monthly)", amount: "₦250,000", date: "5 hours ago", status: "Pending" },
  { id: "TX-9010", school: "Corona Schools", plan: "Premium (Annual)", amount: "₦8,200,000", date: "Yesterday", status: "Successful" },
  { id: "TX-9009", school: "Atlantic Hall", plan: "Premium (Annual)", amount: "₦7,500,000", date: "2 days ago", status: "Successful" },
  { id: "TX-9008", school: "British International", plan: "Enterprise", amount: "₦12,000,000", date: "3 days ago", status: "Successful" },
];

export default function RevenueAnalytics() {
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Pagination Logic
  const totalItems = transactionsData.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentTransactions = transactionsData.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <main className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-48 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[24px]" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[450px] rounded-[32px]" />
            <Skeleton className="h-[450px] rounded-[32px]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-96 w-full rounded-[32px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      
      
      <main className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Performance</h2>
            <p className="text-sm text-gray-500">Detailed breakdown of platform revenue and subscription health.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-gray-100 text-gray-900 hover:bg-gray-50 h-12">
                <Calendar className="w-4 h-4 mr-2" /> Jan 2025 - Dec 2025
             </Button>
             <Button className="bg-white text-white font-bold h-12 px-6 hover:bg-white/90 shadow-lg shadow-white/10">
                <Download className="w-4 h-4 mr-2" /> Export Report
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat, i) => (
            <div key={i} className="bg-white shadow-sm border border-gray-100 p-6 rounded-[24px] hover:border-gray-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div className={cn("flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full", 
                  stat.positive ? "bg-emerald-100 text-emerald-600" : "bg-red-400/20 text-red-400"
                )}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Revenue Chart Placeholder */}
           <div className="lg:col-span-2 bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 font-display">Revenue Over Time</h3>
                    <p className="text-xs text-gray-500 mt-1">Comparing 2024 vs 2025 performance</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue" />
                       <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-gray-100" />
                       <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">2024</span>
                    </div>
                 </div>
              </div>
              
              <div className="h-72 flex items-end justify-between gap-3 px-4">
                 {[40, 55, 45, 70, 85, 65, 95, 80, 75, 100, 110, 120].map((height, i) => (
                    <div key={i} className="flex-1 space-y-3 group">
                       <div className="relative w-full h-full flex items-end">
                          <div 
                            className="w-full bg-blue/20 group-hover:bg-blue/40 transition-all rounded-t-lg" 
                            style={{ height: `${height}%` }} 
                          />
                          <div 
                            className="absolute bottom-0 w-full bg-white shadow-sm border border-gray-100 rounded-t-lg" 
                            style={{ height: `${height * 0.6}%` }} 
                          />
                       </div>
                       <div className="text-[10px] text-center text-gray-500 font-bold uppercase">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Plan Distribution */}
           <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-gray-900 font-display mb-8">Plan Distribution</h3>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-gray-900/80">Premium (Annual)</span>
                       <span className="font-bold text-purple-600">45%</span>
                    </div>
                    <div className="w-full h-2 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-400 transition-all" style={{ width: '45%' }} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-gray-900/80">Premium (Monthly)</span>
                       <span className="font-bold text-[#146ef5]">30%</span>
                    </div>
                    <div className="w-full h-2 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue transition-all" style={{ width: '30%' }} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-gray-900/80">Standard</span>
                       <span className="font-bold text-emerald-400">20%</span>
                    </div>
                    <div className="w-full h-2 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 transition-all" style={{ width: '20%' }} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-gray-900/80">Other</span>
                       <span className="font-bold text-gray-500">5%</span>
                    </div>
                    <div className="w-full h-2 bg-white shadow-sm border border-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-white/20 transition-all" style={{ width: '5%' }} />
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Next Payout</span>
                 </div>
                 <p className="text-2xl font-bold text-gray-900">₦1,240,500</p>
                 <p className="text-[10px] text-gray-500 mt-1">Scheduled for Feb 1st, 2025</p>
              </div>
           </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-gray-900 font-display px-2">Recent Transactions</h3>
           <div className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                   <thead>
                      <tr className="border-b border-gray-100 bg-white shadow-sm border border-gray-100">
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Transaction ID</th>
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">School</th>
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Plan</th>
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Amount</th>
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Date</th>
                         <th className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {currentTransactions.map((tx) => (
                         <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-mono text-xs text-gray-500">{tx.id}</td>
                            <td className="p-6 font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{tx.school}</td>
                            <td className="p-6 text-xs text-gray-500">{tx.plan}</td>
                            <td className="p-6 font-bold text-gray-900">{tx.amount}</td>
                            <td className="p-6 text-xs text-gray-500">{tx.date}</td>
                            <td className="p-6 text-right">
                               <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase", 
                                  tx.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                               )}>{tx.status}</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {totalItems > limit && (
                 <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Show</span>
                       <Select value={itemsPerPage} onValueChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}>
                          <SelectTrigger className="w-20 bg-[#146ef5] border-gray-100 text-white h-9 rounded-xl">
                             <SelectValue placeholder="10" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#146ef5] border-gray-100 text-white">
                             <SelectItem value="10">10</SelectItem>
                             <SelectItem value="25">25</SelectItem>
                             <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-9 w-9 border-gray-100 text-gray-900 disabled:opacity-30"
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         disabled={currentPage === 1}
                       >
                          <ChevronLeft className="w-4 h-4" />
                       </Button>
                       
                       <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                            .map((p, i, arr) => (
                               <span key={p} className="flex items-center gap-1">
                                  {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-500 px-1">...</span>}
                                  <Button
                                    variant={currentPage === p ? "default" : "outline"}
                                    className={cn(
                                       "h-9 w-9 rounded-xl font-bold text-xs",
                                       currentPage === p ? "bg-emerald-600 text-white hover:bg-emerald-600/90" : "border-gray-100 text-white"
                                    )}
                                    onClick={() => setCurrentPage(p)}
                                  >
                                     {p}
                                  </Button>
                               </span>
                            ))
                          }
                       </div>

                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-9 w-9 border-gray-100 text-gray-900 disabled:opacity-30"
                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         disabled={currentPage === totalPages}
                       >
                          <ChevronRight className="w-4 h-4" />
                       </Button>
                    </div>

                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                       Page {currentPage} of {totalPages}
                    </p>
                 </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
