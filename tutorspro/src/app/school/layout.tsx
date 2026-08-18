"use client";

import { usePathname } from 'next/navigation';
import SchoolSidebar from '@/components/school/SchoolSidebar';
import Navbar from '@/components/Navbar';

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignup = pathname === '/school/signup';

  if (isSignup) {
    return (
      <div className="min-h-screen bg-navy">
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-navy">
      <SchoolSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
