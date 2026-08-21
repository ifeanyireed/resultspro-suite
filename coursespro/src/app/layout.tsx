import type { Metadata } from 'next';
import './globals.css';
import "./nets.css";

import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'CoursesPRO — Cohort Learning & Mentor Operating System',
  description: 'Cohort-based learning operating system with 7-stage journeys, live presence, and mentor reviews',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-canvas text-ink">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
