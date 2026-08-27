"use client";

import { IconWifiOff as WifiOff, IconRefresh as RefreshCcw, IconBook as BookOpen, IconBrain as BrainCircuit, IconHome as Home } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#146ef5] flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-12">
        <Logo />
      </div>

      <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 mb-8">
        <WifiOff className="w-10 h-10" />
      </div>

      <h1 className="text-4xl font-black text-gray-900 font-display mb-4">You're Offline</h1>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
        It looks like you've lost your internet connection. Don't worry, your synced 
        content is still available for you to study.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link href="/dashboard/downloads">
           <Button className="w-full bg-white text-white font-black h-14 rounded-2xl shadow-xl hover:bg-white/90">
              <BookOpen className="w-5 h-5 mr-2" /> Access Offline Notes
           </Button>
        </Link>
        <Button variant="outline" className="w-full border-gray-100 text-gray-900 h-14 rounded-2xl hover:bg-gray-50" onClick={() => window.location.reload()}>
           <RefreshCcw className="w-5 h-5 mr-2" /> Try Reconnecting
        </Button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
         <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
         Offline Mode Active
      </div>
    </div>
  );
}
