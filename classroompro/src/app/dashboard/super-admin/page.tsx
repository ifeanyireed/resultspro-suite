"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { IconSchool as School, IconUsers as Users, IconBookOpen as BookOpen, IconTrendingUp as TrendingUp, IconArrowUpRight as ArrowUpRight, IconArrowDownRight as ArrowDownRight, IconShieldCheck as ShieldCheck, IconAlertCircle as AlertCircle, IconChevronRight as ChevronRight, IconDollarSign as DollarSign } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  { label: "Total Schools", value: "124", trend: "+12", positive: true, icon: <School className="w-5 h-5" />, color: "text-blue", bg: "bg-blue/10" },
  { label: "Active Students", value: "45,200", trend: "+5.2%", positive: true, icon: <Users className="w-5 h-5" />, color: "text-green", bg: "bg-green/10" },
  { label: "Content Items", value: "12,850", trend: "+840", positive: true, icon: <BookOpen className="w-5 h-5" />, color: "text-amber", bg: "bg-amber/10" },
  { label: "Monthly Revenue", value: "₦12.4M", trend: "+14.2%", positive: true, icon: <DollarSign className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const recentSchools = [
  { name: "Lekki British School", location: "Lagos", plan: "Premium", status: "Active", students: 1240 },
  { name: "Greenwood Hall", location: "Abuja", plan: "Standard", status: "Pending", students: 850 },
  { name: "Corona Schools", location: "Lagos", plan: "Premium", status: "Active", students: 2100 },
];

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 pb-12 animate-in fade-in duration-500">
      <DashboardHeader title="Platform Overview" />
      
      <main className="p-8 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                {loading ? (
                  <Skeleton className="h-4 w-12 rounded-full" />
                ) : (
                  <div className={cn("flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full", 
                    stat.positive ? "bg-green/20 text-green" : "bg-red-400/20 text-red-400"
                  )}>
                    {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {loading ? <Skeleton className="h-8 w-24" /> : stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Schools Table */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-bold text-white font-display">New School Onboarding</h3>
                 <Link href="/dashboard/super-admin/schools">
                    <Button variant="link" className="text-green font-bold text-xs">View All Schools <ChevronRight className="w-3 h-3 ml-1" /></Button>
                 </Link>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden text-sm">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">School Name</th>
                          <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Plan</th>
                          <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Students</th>
                          <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
                          <th className="p-6 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {loading ? (
                          Array(3).fill(0).map((_, i) => (
                            <tr key={i}>
                               <td className="p-6">
                                  <Skeleton className="h-4 w-32 mb-2" />
                                  <Skeleton className="h-3 w-20" />
                               </td>
                               <td className="p-6">
                                  <Skeleton className="h-5 w-16 rounded" />
                               </td>
                               <td className="p-6">
                                  <Skeleton className="h-4 w-12" />
                               </td>
                               <td className="p-6">
                                  <Skeleton className="h-4 w-16 rounded-full" />
                               </td>
                               <td className="p-6 text-right">
                                  <Skeleton className="h-4 w-12 ml-auto" />
                               </td>
                            </tr>
                          ))
                       ) : recentSchools.map((school, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                             <td className="p-6">
                                <div className="font-bold text-white">{school.name}</div>
                                <div className="text-xs text-muted-foreground">{school.location}</div>
                             </td>
                             <td className="p-6">
                                <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter", 
                                   school.plan === 'Premium' ? 'bg-purple-400/10 text-purple-400' : 'bg-blue/10 text-blue'
                                )}>{school.plan}</span>
                             </td>
                             <td className="p-6 text-white font-medium">{school.students.toLocaleString()}</td>
                             <td className="p-6">
                                <span className={cn("flex items-center gap-1.5 text-xs font-bold", 
                                   school.status === 'Active' ? 'text-green' : 'text-amber'
                                )}>
                                   <div className={cn("w-1.5 h-1.5 rounded-full", school.status === 'Active' ? 'bg-green' : 'bg-amber')} />
                                   {school.status}
                                </span>
                             </td>
                             <td className="p-6 text-right">
                                <button className="text-xs font-bold text-green hover:underline">Manage</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Platform Health/Alerts */}
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-display px-2">Platform Health</h3>
              
              <div className="space-y-4">
                 <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3 text-green">
                       <ShieldCheck className="w-5 h-5" />
                       <h4 className="font-bold text-white text-sm uppercase tracking-widest">System Status</h4>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                       <span className="text-xs text-muted-foreground">API Server</span>
                       <span className="text-[10px] font-bold text-green uppercase">99.9% Up</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                       <span className="text-xs text-muted-foreground">File Storage</span>
                       <span className="text-[10px] font-bold text-green uppercase">Operational</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                       <span className="text-xs text-muted-foreground">Sync Service</span>
                       <span className="text-[10px] font-bold text-green uppercase">Healthy</span>
                    </div>
                 </div>

                 <div className="p-6 rounded-[32px] bg-amber/5 border border-amber/20 space-y-4">
                    <div className="flex items-center gap-3 text-amber">
                       <AlertCircle className="w-5 h-5" />
                       <h4 className="font-bold text-white text-sm uppercase tracking-widest">Moderation Queue</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       There are <span className="text-white font-bold">42 items</span> awaiting review in the global content queue.
                    </p>
                    <Link href="/dashboard/super-admin/moderation" className="block">
                       <Button size="sm" className="w-full bg-amber/20 hover:bg-amber/30 text-amber border-none font-bold text-xs h-10">
                          Open Queue
                       </Button>
                    </Link>
                 </div>

                 <div className="p-6 rounded-[32px] bg-blue/5 border border-blue/20">
                    <h4 className="text-xs font-bold text-blue uppercase tracking-widest mb-2">Platform Tip</h4>
                    <p className="text-xs text-blue/80 leading-relaxed italic">
                       "Content engagement is up by 12% this week. Consider highlighting the top performing schools in the next newsletter."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
