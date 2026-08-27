"use client";

import { IconCreditCard as CreditCard, IconClock as Clock, IconCalendar as Calendar, IconArrowRight as ArrowRight, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const activePlansData = [
  { child: "Jessica Alabi", plan: "Premium (Annual)", status: "Active", expires: "Oct 24, 2025", price: "₦45,000" },
  { child: "Daniel Alabi", plan: "Standard (Monthly)", status: "Active", expires: "Feb 15, 2025", price: "₦5,000" },
];

export default function ParentBilling() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 pb-12 animate-in fade-in duration-500">
        
        <main className="p-8 max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg ml-2" />
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-[40px]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-12">
      
      
      <main className="p-8 max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Subscriptions</h2>
            <p className="text-sm text-gray-500">Monitor active plans and payment history for your children.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#146ef5]">
                <CreditCard className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Saved Card</p>
                <p className="text-gray-900 font-bold text-sm">•••• 4242</p>
             </div>
             <Button variant="ghost" className="text-[#146ef5] text-xs font-bold hover:text-[#146ef5] hover:bg-blue/5">Update</Button>
          </div>
        </div>

        {/* Active Plans */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-gray-900 font-display px-2">Active Child Plans</h3>
           <div className="grid gap-4">
              {activePlansData.map((item, i) => (
                 <div key={i} className="bg-white shadow-sm border border-gray-100 rounded-[32px] p-8 hover:border-gray-200 transition-all group flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{item.child}</h4>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">Active</span>
                       </div>
                       <p className="text-sm text-gray-500 mb-6">{item.plan} • {item.price}</p>
                       
                       <div className="flex flex-wrap gap-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-900/60 uppercase tracking-widest">
                             <Calendar className="w-4 h-4 text-[#146ef5]" />
                             Expires {item.expires}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-900/60 uppercase tracking-widest">
                             <Clock className="w-4 h-4 text-[#146ef5]" />
                             Auto-renews enabled
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       <Button variant="outline" className="border-gray-100 text-gray-900 h-11 px-8 font-bold text-xs">
                          Change Plan
                       </Button>
                       <Button variant="outline" className="border-gray-100 text-red-400 hover:text-red-500 hover:bg-red-400/10 h-11 px-6 font-bold text-xs">
                          Cancel
                       </Button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Upgrade/Pricing Teaser */}
        <div className="p-10 rounded-[40px] bg-gradient-to-br from-green/20 via-navy to-blue/20 border border-gray-100 relative overflow-hidden text-center">
           <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-black text-gray-900 font-display tracking-tight">Save 20% with Annual Plans</h3>
              <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
                 Switch to yearly billing for all your children and get two months free every year. Includes priority support and advanced analytics.
              </p>
              <div className="pt-4">
                 <Button className="bg-white text-white font-black h-12 px-10 rounded-full shadow-2xl shadow-white/10 hover:bg-white/90">
                    Switch to Annual Billing <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[100px] -mr-32 -mt-32 rounded-full" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 blur-[100px] -ml-32 -mb-32 rounded-full" />
        </div>

        {/* Info Box */}
        <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-start gap-4">
           <AlertCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
           <p className="text-xs text-gray-500 leading-relaxed">
              Subscriptions are managed per child. Your school may provide group discounts for families with 3 or more children. 
              Contact your school admin for more information.
           </p>
        </div>
      </main>
    </div>
  );
}
