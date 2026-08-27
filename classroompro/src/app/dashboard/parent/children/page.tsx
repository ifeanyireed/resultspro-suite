"use client";

import { IconHeart as Heart, IconUserPlus as UserPlus, IconShieldCheck as ShieldCheck, IconSettings as Settings, IconMail as Mail, IconCertificate as GraduationCap } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const childrenData = [
  { id: 1, name: "Jessica Alabi", school: "Lekki British School", class: "SSS 1", studentId: "LBS-2024-042", status: "Linked", email: "jessica@student.com" },
  { id: 2, name: "Daniel Alabi", school: "Lekki British School", class: "JSS 2", studentId: "LBS-2026-115", status: "Linked", email: "daniel@student.com" },
];

export default function MyChildren() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <main className="p-8 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
          <div className="space-y-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-56 rounded-[32px]" />)}
          </div>
          <Skeleton className="h-48 w-full rounded-[40px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Child Management</h2>
            <p className="text-sm text-gray-500">Link and manage your children's accounts to monitor their academic progress.</p>
          </div>
          <Button className="bg-emerald-600 text-white font-bold h-12 px-6">
            <UserPlus className="w-5 h-5 mr-2" /> Link New Child
          </Button>
        </div>

        <div className="grid gap-6">
           {childrenData.map((child) => (
              <div key={child.id} className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8 hover:border-gray-200 transition-all group">
                 <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="w-24 h-24 rounded-[32px] bg-[#146ef5] border border-gray-100 flex items-center justify-center text-3xl font-bold text-white shrink-0 shadow-2xl">
                       {child.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1 space-y-4">
                       <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{child.name}</h3>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-green/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                             <ShieldCheck className="w-3 h-3" /> {child.status}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">School & Class</p>
                             <p className="text-gray-900 font-medium flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#146ef5]" /> {child.school} • {child.class}
                             </p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Student ID</p>
                             <p className="text-gray-900 font-medium font-mono">{child.studentId}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email Address</p>
                             <p className="text-gray-900 font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-amber-600" /> {child.email}
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 shrink-0">
                       <Button variant="outline" className="flex-1 lg:flex-none border-gray-100 text-gray-900 h-11 px-6 font-bold text-xs">
                          <Settings className="w-4 h-4 mr-2" /> Manage Profile
                       </Button>
                       <Button variant="outline" className="flex-1 lg:flex-none border-gray-100 text-gray-900 h-11 px-6 font-bold text-xs">
                          Account Access
                       </Button>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Info Card */}
        <div className="bg-blue/5 border border-blue/20 p-8 rounded-[40px] flex items-start gap-6">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#146ef5] shrink-0">
              <Heart className="w-6 h-6" />
           </div>
           <div className="space-y-2">
              <h4 className="text-lg font-bold text-gray-900">Why link a child's account?</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                 Linking an account allows you to receive weekly performance summaries, get notified when they finish assignments, 
                 and see exactly which areas they are struggling with in real-time. You can link up to 5 children under one parent account.
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
