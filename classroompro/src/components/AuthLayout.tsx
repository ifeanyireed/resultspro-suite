"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/5 blur-[120px] rounded-full -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Logo imageSize={48} textSize="text-2xl" />
        </div>
        <h2 className="text-center text-3xl font-bold font-display text-white">{title}</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 py-8 px-4 border border-white/10 shadow sm:rounded-2xl sm:px-10 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
