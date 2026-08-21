"use client";

import { DashboardHeader } from "@/components/DashboardLayout";
import { IconSchool as School, IconMapPin as MapPin, IconGlobe as Globe, IconPhone as Phone, IconMail as Mail, IconShieldCheck as ShieldCheck, IconCamera as Camera, IconSave as Save, IconBuilding2 as Building2, IconCalendar as Calendar } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchoolManagementPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        <DashboardHeader title="School Settings" />
        <main className="p-8 max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="aspect-square rounded-[32px]" />
            <Skeleton className="md:col-span-2 h-96 rounded-[32px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Skeleton className="h-64 rounded-[32px]" />
             <Skeleton className="h-64 rounded-[32px]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <DashboardHeader title="School Settings" />
      
      <main className="p-8 max-w-4xl space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">School Profile</h2>
            <p className="text-sm text-muted-foreground">Update your institution's public information and preferences.</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Upload */}
          <div className="space-y-4">
             <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">School Logo</Label>
             <div className="relative group">
                <div className="w-full aspect-square rounded-[32px] bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group-hover:border-green/50 transition-all cursor-pointer">
                   <School className="w-12 h-12 text-muted-foreground group-hover:text-green transition-colors" />
                   <span className="text-[10px] text-muted-foreground font-bold">Click to Upload</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                   <Camera className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* Core Info */}
          <div className="md:col-span-2 space-y-6 bg-white/5 border border-white/10 p-8 rounded-[32px]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground uppercase font-bold">Institution Name</Label>
                   <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="Royal British Academy" className="pl-10 bg-navy border-white/10 text-white" />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground uppercase font-bold">School Website</Label>
                   <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="www.royalbritish.edu.ng" className="pl-10 bg-navy border-white/10 text-white" />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground uppercase font-bold">Primary Email</Label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="admin@royalbritish.edu" className="pl-10 bg-navy border-white/10 text-white" />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs text-muted-foreground uppercase font-bold">Phone Line</Label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="+234 812 345 6789" className="pl-10 bg-navy border-white/10 text-white" />
                   </div>
                </div>
             </div>
             
             <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold">Physical Address</Label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input defaultValue="12 Lekki-Epe Expressway, Lagos, Nigeria" className="pl-10 bg-navy border-white/10 text-white" />
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-6">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green" /> Subscription Plan
              </h3>
              <div className="p-6 rounded-2xl bg-green/10 border border-green/20">
                 <div className="text-[10px] text-green font-bold uppercase tracking-widest mb-1">Active Plan</div>
                 <div className="text-2xl font-bold text-white mb-4">School Pro (Yearly)</div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Next Renewal:</span>
                    <span className="text-white font-bold">Oct 24, 2026</span>
                 </div>
              </div>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                 Upgrade or Manage Billing
              </Button>
           </div>

           <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-6">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-blue" /> Academic Session
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Current Session</Label>
                    <select className="w-full bg-navy border border-white/10 rounded-lg h-10 px-3 text-sm text-white">
                       <option>2025/2026 Academic Session</option>
                       <option>2024/2025 Academic Session</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold">Current Term</Label>
                    <select className="w-full bg-navy border border-white/10 rounded-lg h-10 px-3 text-sm text-white">
                       <option>1st Term</option>
                       <option>2nd Term</option>
                       <option>3rd Term</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
