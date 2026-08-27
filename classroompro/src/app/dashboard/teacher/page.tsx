"use client";

import { IconUsers as Users, IconFilePlus as FilePlus, IconBook as BookOpen, IconChartBar as BarChart3, IconChevronRight as ChevronRight, IconPlus as Plus, IconCalendar as Calendar, IconMessage as MessageSquare } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const teacherName = user?.full_name || "Teacher";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <div className="p-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 rounded-2xl" />
                  <Skeleton className="h-64 rounded-2xl" />
               </div>
               <Skeleton className="h-64 rounded-2xl" />
            </div>
            <Skeleton className="h-[500px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const teacherStats = [
    { label: "My Classes", value: "4", icon: <Users className="w-5 h-5 text-[#146ef5]" />, bg: "bg-blue-50" },
    { label: "Total Students", value: "156", icon: <Users className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Notes Published", value: "24", icon: <BookOpen className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    { label: "Assessments", value: "8", icon: <BarChart3 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
  ];

  const myClasses = [
    { name: "SS3 Biology", students: 42, performance: "82%" },
    { name: "SS2 Biology", students: 38, performance: "75%" },
    { name: "SS1 Biology", students: 45, performance: "68%" },
  ];

  const recentMessages = [
    { id: 1, sender: "Mr. Kunle Alabi", role: "Parent (Jessica)", message: "Thank you for the update on Jessica's progress.", time: "10:24 AM" },
    { id: 2, sender: "Mrs. Sarah John", role: "Parent (Daniel)", message: "Is there any extra material for Algebra?", time: "09:15 AM" },
  ];

  return (
    <div className="flex-1 pb-12">
      
      
      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Welcome & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello, {teacherName}! 👋</h2>
            <p className="text-gray-500">Manage your classes and learning materials.</p>
          </div>
          <div className="flex gap-3">
             <Button className="bg-emerald-600 text-white font-bold">
               <Plus className="w-4 h-4 mr-2" /> Create Note
             </Button>
             <Button variant="outline" className="border-gray-100 text-gray-900">
               <FilePlus className="w-4 h-4 mr-2" /> New Quiz
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teacherStats.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* My Classes */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-bold text-gray-900">My Classes</h3>
                 <Link href="/dashboard/teacher/classes">
                    <Button variant="link" className="text-emerald-600 font-bold text-xs">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
                 </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 {myClasses.map((cls, idx) => (
                   <div key={idx} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-blue/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#146ef5] transition-colors">{cls.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Students</span>
                            <span className="text-gray-900 font-medium">{cls.students}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Avg. Performance</span>
                            <span className="text-gray-900 font-medium">{cls.performance}</span>
                         </div>
                      </div>
                      <Link href={`/dashboard/teacher/classes/${idx}`} className="block mt-6">
                        <Button variant="outline" className="w-full border-gray-100 text-gray-900 group-hover:bg-blue group-hover:border-blue group-hover:text-gray-900 transition-all">
                          Manage Class
                        </Button>
                      </Link>
                   </div>
                 ))}
              </div>

              {/* Recent Messages Section */}
              <div className="space-y-6 pt-4">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-gray-900">Recent Messages</h3>
                    <Link href="/dashboard/teacher/messages">
                       <Button variant="link" className="text-emerald-600 font-bold text-xs">Open Inbox <ChevronRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                 </div>
                 <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                    {recentMessages.map((msg) => (
                       <Link key={msg.id} href="/dashboard/teacher/messages" className="block p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-[#146ef5] border border-gray-100 flex items-center justify-center font-bold text-white text-xs">
                                {msg.sender.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                   <h4 className="text-sm font-bold text-gray-900 truncate">{msg.sender}</h4>
                                   <span className="text-[10px] text-gray-500">{msg.time}</span>
                                </div>
                                <p className="text-[10px] text-[#146ef5] font-bold uppercase tracking-widest mb-1">{msg.role}</p>
                                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                             </div>
                          </div>
                       </Link>
                    ))}
                 </div>
              </div>
           </div>

           {/* Upcoming Deadlines / Tasks */}
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 px-2">Tasks & Deadlines</h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex flex-col items-center justify-center text-amber-600 flex-shrink-0">
                       <span className="text-[10px] font-bold leading-none">OCT</span>
                       <span className="text-lg font-bold leading-none">24</span>
                    </div>
                    <div>
                       <h5 className="font-bold text-gray-900 text-sm">Grade SS3 Biology Quiz</h5>
                       <p className="text-xs text-gray-500 mt-1">42 submissions pending</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-[#146ef5] flex-shrink-0">
                       <span className="text-[10px] font-bold leading-none">OCT</span>
                       <span className="text-lg font-bold leading-none">26</span>
                    </div>
                    <div>
                       <h5 className="font-bold text-gray-900 text-sm">Upload Week 5 Notes</h5>
                       <p className="text-xs text-gray-500 mt-1">Due for all classes</p>
                    </div>
                 </div>
              </div>
              <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900 flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> View full calendar
              </Button>

              <div className="p-6 rounded-[32px] bg-gradient-to-br from-green/20 to-blue/20 border border-gray-100 mt-8">
                 <h4 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h4>
                 <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Check out our teacher guides for tips on creating engaging quizzes and managing your virtual classroom.
                 </p>
                 <Link href="/dashboard/help">
                    <Button className="w-full bg-white text-white font-bold h-10 text-xs">
                       Open Help Center
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
