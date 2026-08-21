"use client";

import Link from "next/link";
import { IconArrowLeft as ArrowLeft, IconHome as Home, IconSearch as Search, IconAlertCircle as AlertCircle } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green/5 blur-[100px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue/5 blur-[100px] rounded-full -ml-48 -mb-48" />

      <div className="relative z-10 text-center space-y-8 max-w-lg">
         <div className="flex justify-center mb-12">
            <Logo />
         </div>

         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest mb-4">
               <AlertCircle className="w-4 h-4" /> Error 404
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white font-display tracking-tight">
               Page <span className="text-green text-stroke-white">Not Found</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
               Oops! It seems you've wandered into an uncharted topic. 
               The page you are looking for doesn't exist or has been moved.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/">
               <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-black h-12 px-8 rounded-xl shadow-xl shadow-green/20">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
               </Button>
            </Link>
            <Link href="/dashboard">
               <Button variant="outline" className="w-full sm:w-auto border-white/10 text-white h-12 px-8 rounded-xl hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Go to Dashboard
               </Button>
            </Link>
         </div>

         <div className="pt-12">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold">
               Need help? <Link href="/dashboard/help" className="text-green hover:underline">Visit Help Center</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
