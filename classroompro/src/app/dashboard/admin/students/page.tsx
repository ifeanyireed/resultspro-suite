"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { 
  GraduationCap, 
  Search, 
  MoreVertical, 
  Filter,
  Download,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const studentsData = [
  { id: 1, name: "Daniel Smith", class: "SSS 3", parentEmail: "p.smith@example.com", attendance: "95%", performance: "Excellent", status: "Active" },
  { id: 2, name: "Jessica Alabi", class: "SSS 2", parentEmail: "alabi@example.com", attendance: "88%", performance: "Good", status: "Active" },
  { id: 3, name: "Emeka Obi", class: "JSS 3", parentEmail: "obi.fam@example.com", attendance: "72%", performance: "Average", status: "Active" },
  { id: 4, name: "Fatima Yusuf", class: "SSS 1", parentEmail: "yusuf.f@example.com", attendance: "98%", performance: "Excellent", status: "Active" },
  { id: 5, name: "Tunde Bakare", class: "JSS 2", parentEmail: "bakare@example.com", attendance: "65%", performance: "Below Average", status: "Warning" },
];

export default function ManageStudentsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Manage Students" />
        <main className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32 rounded-xl" />
              <Skeleton className="h-11 w-32 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Manage Students" />
      
      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Student Enrollment</h2>
            <p className="text-sm text-muted-foreground">Monitor student attendance, performance, and account status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button className="bg-green hover:bg-green/90 text-navy font-bold">
              <UserPlus className="w-4 h-4 mr-2" /> Enroll Student
            </Button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by student name or class..." 
              className="pl-10 bg-navy border-white/10 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Filter className="w-4 h-4 mr-2" /> All Classes
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Filter className="w-4 h-4 mr-2" /> Performance
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Student Name</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Class</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Attendance</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Performance</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/80">
              {studentsData.map((student) => (
                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green/20 text-green flex items-center justify-center font-bold text-xs">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-[10px] text-muted-foreground">{student.parentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{student.class}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", parseInt(student.attendance) > 80 ? "bg-green" : "bg-amber")} 
                          style={{ width: student.attendance }} 
                        />
                      </div>
                      <span className="text-[10px]">{student.attendance}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                      student.performance === "Excellent" ? "text-green bg-green/10" : 
                      student.performance === "Below Average" ? "text-red-400 bg-red-400/10" : "text-blue bg-blue/10"
                    )}>
                      {student.performance}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                      student.status === "Active" ? "text-green bg-green/10" : "text-amber bg-amber/10"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-muted-foreground hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
