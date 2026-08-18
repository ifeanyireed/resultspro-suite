"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  MoreVertical,
  School,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolAdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="School Admin Dashboard" />
        <main className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: "1,284", icon: <GraduationCap className="w-5 h-5" />, color: "text-green", bg: "bg-green/10", trend: "+12%" },
    { label: "Total Teachers", value: "86", icon: <UserCheck className="w-5 h-5" />, color: "text-blue", bg: "bg-blue/10", trend: "+2%" },
    { label: "Total Classes", value: "24", icon: <School className="w-5 h-5" />, color: "text-amber", bg: "bg-amber/10", trend: "Stable" },
    { label: "Notes Created", value: "3,420", icon: <BookOpen className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10", trend: "+5%" },
  ];

  const recentTeachers = [
    { name: "Sarah Johnson", subject: "Mathematics", classes: "JSS 1, JSS 2", status: "Active" },
    { name: "Michael Chen", subject: "Physics", classes: "SSS 1, SSS 2", status: "Active" },
    { name: "Amina Okoro", subject: "English", classes: "JSS 3", status: "Inactive" },
  ];

  return (
    <div className="flex-1">
      <DashboardHeader title="School Admin Dashboard" />
      
      <main className="p-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display">Welcome, Principal</h2>
            <p className="text-muted-foreground">Here's what's happening at your school today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Calendar className="w-4 h-4 mr-2" /> Schedule Term
            </Button>
            <Button className="bg-green hover:bg-green/90 text-navy font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Teacher
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                  stat.trend.startsWith('+') ? "bg-green/20 text-green" : "bg-white/10 text-muted-foreground"
                )}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teachers List */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-display">Recent Teachers</h3>
              <Button variant="link" className="text-green p-0 h-auto font-bold text-sm">View all</Button>
            </div>
            <div className="divide-y divide-white/10">
              {recentTeachers.map((teacher, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue/20 text-blue flex items-center justify-center font-bold">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{teacher.name}</div>
                      <div className="text-xs text-muted-foreground">{teacher.subject} • {teacher.classes}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                      teacher.status === "Active" ? "text-green bg-green/10" : "text-muted-foreground bg-white/10"
                    )}>
                      {teacher.status}
                    </span>
                    <button className="text-muted-foreground hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-green border border-green/20 p-6 rounded-2xl text-navy">
              <h3 className="text-lg font-bold mb-2 font-display">Subscription Status</h3>
              <p className="text-sm font-medium mb-4 opacity-80">Your Premium Plan expires in 45 days. Renew now for uninterrupted access.</p>
              <Button className="w-full bg-navy text-white hover:bg-navy/90 font-bold border-none">
                Renew Plan
              </Button>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 font-display">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Storage Usage</span>
                  <span className="text-sm font-bold text-white">64%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green w-[64%]" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="text-sm font-bold text-white">412</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
