"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  TrendingUp, 
  ChevronRight,
  Clock,
  AlertCircle,
  Award,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Child {
  id: string;
  name: string;
  class: string;
  progress: number;
  lastActivity: string;
}

interface Activity {
  id: string;
  child: string;
  action: string;
  time: string;
  type: string;
}

export default function ParentDashboard() {
  const user = useAuthStore((state) => state.user);
  const parentName = user?.full_name || "Parent";
  
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("5");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenRes, activityRes] = await Promise.all([
          api.get("/parent/children"),
          api.get("/parent/activity")
        ]);
        setChildren(Array.isArray(childrenRes.data) ? childrenRes.data : []);
        setActivities(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (error) {
        console.error("Failed to fetch parent dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination Logic
  const totalItems = activities.length;
  const limit = parseInt(itemsPerPage);
  const totalPages = Math.ceil(totalItems / limit);
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentActivities = useMemo(() => {
    return activities.slice(indexOfFirstItem, indexOfLastItem);
  }, [activities, indexOfFirstItem, indexOfLastItem]);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Parent Overview" />
        <main className="p-8 space-y-10">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-80 rounded-lg" />
            </div>
            <div className="flex gap-4">
               <Skeleton className="h-20 w-32 rounded-2xl" />
               <Skeleton className="h-20 w-32 rounded-2xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => <Skeleton key={i} className="h-96 rounded-[40px]" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-96 rounded-[32px]" />
            <Skeleton className="h-96 rounded-[32px]" />
          </div>
        </main>
      </div>
    );
  }

  const avgScore = activities.length > 0 
    ? Math.round(activities.reduce((acc, curr) => {
        const matches = curr.action.match(/\d+/);
        const score = matches ? parseInt(matches[0]) : 0;
        return acc + score;
      }, 0) / activities.length)
    : 0;

  return (
    <div className="flex-1 pb-12">
      <DashboardHeader title="Parent Overview" />
      
      <main className="p-8 space-y-10">
        {/* Welcome & Quick Stats */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
           <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-display">Hello, {parentName}</h2>
              <p className="text-muted-foreground">Here&apos;s how your children are performing this week.</p>
           </div>
           <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg. Score</p>
                 <p className="text-xl font-bold text-green">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Time</p>
                 <p className="text-xl font-bold text-blue">12h</p>
              </div>
           </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {children.length > 0 ? children.map((child) => (
              <div key={child.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8">
                    <Link href={`/dashboard/parent/progress?childId=${child.id}`}>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                 </div>
                 
                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-navy border-2 border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                       {child.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white group-hover:text-green transition-colors">{child.name}</h3>
                       <p className="text-muted-foreground text-sm font-medium">{child.class} Student</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                          <span className="text-muted-foreground uppercase tracking-widest">Weekly Goal Progress</span>
                          <span className="text-white">{child.progress}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-green transition-all duration-1000" style={{ width: `${child.progress}%` }} />
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       <Clock className="w-3 h-3" /> Last: {child.lastActivity}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mt-8">
                    <Link href={`/dashboard/parent/progress?childId=${child.id}`} className="w-full">
                       <Button variant="outline" className="w-full border-white/10 text-white h-11 font-bold text-xs">
                          Full Report
                       </Button>
                    </Link>
                    <Link href={`/dashboard/parent/messages?childId=${child.id}`} className="w-full">
                       <Button variant="outline" className="w-full border-white/10 text-white h-11 font-bold text-xs">
                          Ask Teacher
                       </Button>
                    </Link>
                 </div>
              </div>
           )) : (
             <div className="col-span-full p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-[40px]">
                <p className="text-muted-foreground">No children linked to your account yet.</p>
             </div>
           )}
        </div>

        {/* Activity & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6 flex flex-col">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-bold text-white font-display">Recent Activity</h3>
                 {totalItems > limit && (
                    <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-8 w-8 border-white/10 text-white disabled:opacity-30"
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         disabled={currentPage === 1}
                       >
                          <ChevronLeft className="w-3 h-3" />
                       </Button>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                          {currentPage} / {totalPages}
                       </span>
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-8 w-8 border-white/10 text-white disabled:opacity-30"
                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         disabled={currentPage === totalPages}
                       >
                          <ChevronRight className="w-3 h-3" />
                       </Button>
                    </div>
                 )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex-1">
                 {currentActivities.length > 0 ? currentActivities.map((item, i) => (
                    <div key={i} className="p-5 flex items-center gap-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", 
                          item.type === 'score' ? 'bg-green/10 text-green' : 
                          item.type === 'achievement' ? 'bg-amber/10 text-amber' : 'bg-red-500/10 text-red-500'
                       )}>
                          {item.type === 'score' && <TrendingUp className="w-5 h-5" />}
                          {item.type === 'achievement' && <Award className="w-5 h-5" />}
                          {item.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm text-white/90">
                             <span className="font-bold text-white">{item.child}</span> {item.action}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{item.time}</p>
                       </div>
                       <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                       </Button>
                    </div>
                 )) : (
                   <div className="p-8 text-center text-muted-foreground text-sm">
                      No recent activity found.
                   </div>
                 )}
              </div>

              {/* Show Selector */}
              {totalItems > 5 && (
                <div className="flex justify-end mt-4 px-2">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Show</span>
                      <Select value={itemsPerPage} onValueChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}>
                         <SelectTrigger className="w-16 bg-navy border-white/10 text-white h-8 rounded-lg text-[10px]">
                            <SelectValue placeholder="5" />
                         </SelectTrigger>
                         <SelectContent className="bg-navy border-white/10 text-white">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-display px-2">Key Highlights</h3>
              <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue/20 to-green/10 border border-white/10 space-y-6">
                 <div className="space-y-2">
                    <h4 className="text-xs font-black text-green uppercase tracking-[0.2em]">Strength</h4>
                    <p className="text-sm text-white font-bold leading-relaxed">
                       Your children are making steady progress in their assigned subjects. Keep it up!
                    </p>
                 </div>
                 <div className="space-y-2 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-black text-amber uppercase tracking-[0.2em]">Next Step</h4>
                    <p className="text-sm text-white font-bold leading-relaxed">
                       Review the full report to see detailed performance by topic and subject.
                    </p>
                 </div>
                 <Button className="w-full bg-white text-navy font-black h-11 hover:bg-white/90 text-xs uppercase tracking-widest mt-4">
                    View Study Plan
                 </Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
