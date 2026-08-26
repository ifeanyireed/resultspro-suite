"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconPlus as Plus, IconSearch as Search, IconDotsVertical as MoreVertical, IconFilter as Filter } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const teachersData = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@school.com", phone: "+234 801 234 5678", subjects: ["Mathematics", "Further Math"], classes: ["SSS 1", "SSS 2"], status: "Active" },
  { id: 2, name: "Michael Chen", email: "m.chen@school.com", phone: "+234 802 345 6789", subjects: ["Physics", "Chemistry"], classes: ["SSS 2", "SSS 3"], status: "Active" },
  { id: 3, name: "Amina Okoro", email: "a.okoro@school.com", phone: "+234 803 456 7890", subjects: ["English Literature"], classes: ["JSS 3"], status: "On Leave" },
  { id: 4, name: "David Wilson", email: "d.wilson@school.com", phone: "+234 804 567 8901", subjects: ["Biology"], classes: ["SSS 1", "JSS 2"], status: "Active" },
];

export default function ManageTeachersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="Manage Teachers" />
        <main className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="Manage Teachers" />
      
      <main className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Faculty Directory</h2>
            <p className="text-sm text-muted-foreground">Manage your school's teaching staff and their assignments.</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Teacher
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or subject..." 
              className="pl-10 bg-navy border-white/10 text-white"
            />
          </div>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {/* Teachers Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Teacher</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Subjects</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Classes</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {teachersData.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue/20 text-blue flex items-center justify-center font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{teacher.name}</div>
                        <div className="text-[10px] text-muted-foreground">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-muted-foreground">{teacher.classes.join(", ")}</div>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                      teacher.status === "Active" ? "text-green bg-green/10" : "text-amber bg-amber/10"
                    )}>
                      {teacher.status}
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
